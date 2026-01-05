
from fastapi import APIRouter, Depends
from fastapi import BackgroundTasks
from auth import get_current_user
from schemas import ChatMessage
from services.chat_service import (
    create_chat_session,
    store_message,
    get_chat_history
)
from services.llm_service import get_ai_response_with_context
# from services.topic_service import extract_topics
from services.chat_service import link_message_to_topics
from services.vector_service import store_embedding, search_similar
from services.title_service import generate_chat_title
from services.chat_service import update_chat_title_if_empty
from services.topic_service import extract_topics_llm


router = APIRouter(prefix="/chat", tags=["Chat"])

async def process_message_background(
    chat_id: str,
    user_id: int,
    user_seq: int,
    user_text: str,
    ai_seq: int,
    ai_text: str
):
    # Topics
    topics = await extract_topics_llm(user_text)

    if topics:
        link_message_to_topics(
            chat_id=chat_id,
            user_id=user_id,
            message_sequence=user_seq,
            topics=topics
        )

        title = generate_chat_title(topics)
        update_chat_title_if_empty(
            chat_id=chat_id,
            user_id=user_id,
            title=title
        )

    # Embeddings (API-based)
    await store_embedding(
        user_id=user_id,
        message_id=f"{chat_id}:{user_seq}",
        text=user_text
    )

    await store_embedding(
        user_id=user_id,
        message_id=f"{chat_id}:{ai_seq}",
        text=ai_text
    )


# 🔹 STEP 3: Start a new chat session
@router.post("/start")
def start_chat(current_user = Depends(get_current_user)):
    chat_id = create_chat_session(current_user.id)
    return {
        "chat_id": chat_id
    }



def build_llm_messages(
    history: list,
    new_message: str,
    semantic_memory: list
):
    messages = [
        {
            "role": "system",
            "content": (
                "You are an AI assistant that answers questions accurately and clearly. "
                "Stay strictly on the topic asked by the user."
            )
        }
    ]

    # 🔹 Inject semantic memory (Step 4)
    if semantic_memory:
        messages.append({
            "role": "system",
            "content": (
                "Relevant past discussions from this user:\n"
                + "\n".join(semantic_memory)
            )
        })

    # 🔹 Add chat history (Step 2)
    for msg in history:
        messages.append({
            "role": "user" if msg["sender"] == "user" else "assistant",
            "content": msg["text"]
        })

    # 🔹 Current user message
    messages.append({
        "role": "user",
        "content": new_message
    })

    return messages




@router.post("/{chat_id}/message")
async def send_message(
    chat_id: str,
    payload: ChatMessage,
    background_tasks: BackgroundTasks,
    current_user = Depends(get_current_user)
):
    # 1️⃣ Chat history
    history = get_chat_history(chat_id, current_user.id)

    # 2️⃣ Semantic memory (API-based)
    semantic_memory = await search_similar(
        user_id=current_user.id,
        query=payload.message,
        top_k=3
    )

    # 3️⃣ Build LLM prompt
    llm_messages = build_llm_messages(
        history=history,
        new_message=payload.message,
        semantic_memory=semantic_memory
    )

    # 4️⃣ Call LLM
    ai_response = await get_ai_response_with_context(llm_messages)

    # 5️⃣ Store USER message
    user_seq = store_message(
        chat_id=chat_id,
        user_id=current_user.id,
        sender="user",
        text=payload.message
    )

    # 6️⃣ Topics → Knowledge Graph
    # topics = extract_topics(payload.message)
    # link_message_to_topics(
    #     chat_id=chat_id,
    #     user_id=current_user.id,
    #     message_sequence=user_seq,
    #     topics=topics
    # )

    # if topics:
    #     title = generate_chat_title(topics)
    #     update_chat_title_if_empty(
    #         chat_id=chat_id,
    #         user_id=current_user.id,
    #         title=title
    #     )

    # # 7️⃣ Store USER embedding
    # await store_embedding(
    #     user_id=current_user.id,
    #     message_id=f"{chat_id}:{user_seq}",
    #     text=payload.message
    # )

    # 8️⃣ Store AI message
    ai_seq = store_message(
        chat_id=chat_id,
        user_id=current_user.id,
        sender="ai",
        text=ai_response
    )

    # 9️⃣ Store AI embedding
    # await store_embedding(
    #     user_id=current_user.id,
    #     message_id=f"{chat_id}:{ai_seq}",
    #     text=ai_response
    # )
    background_tasks.add_task(
        process_message_background,
        chat_id,
        current_user.id,
        user_seq,
        payload.message,
        ai_seq,
        ai_response
    )

    return {"reply": ai_response}



# # 🔹 STEP 5: Fetch chat history
@router.get("/{chat_id}/history")
def chat_history(
    chat_id: str,
    current_user = Depends(get_current_user)
):
    history = get_chat_history(chat_id, current_user.id)
    return {
        "chat_id": chat_id,
        "messages": history
    }

@router.get("/sessions")
def list_chat_sessions(current_user = Depends(get_current_user)):
    from services.chat_service import get_user_chat_sessions

    sessions = get_user_chat_sessions(current_user.id)
    return {
        "sessions": sessions
    }
