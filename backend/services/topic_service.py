# import re

# COMMON_TOPICS = [
#     "JWT", "Authentication", "FastAPI", "Neo4j",
#     "LLM", "Transformer", "API", "Database",
#     "Graph", "Security", "Python"
# ]

# def extract_topics(text: str) -> list[str]:
#     text_lower = text.lower()
#     found = []

#     for topic in COMMON_TOPICS:
#         if re.search(rf"\b{topic.lower()}\b", text_lower):
#             found.append(topic)

#     return list(set(found))

import json
from services.llm_service import get_ai_response_with_context


async def extract_topics_llm(text: str) -> list[str]:
    """
    Extract 2–4 concise topics from user text.
    """

    messages = [
        {
            "role": "system",
            "content": (
                "Extract 2 to 4 short, high-level topics from the user's message. "
                "Return ONLY a JSON array of strings. "
                "No explanation, no markdown."
            )
        },
        {
            "role": "user",
            "content": text
        }
    ]

    response = await get_ai_response_with_context(messages)

    try:
        topics = json.loads(response)
        if isinstance(topics, list):
            return [t.strip() for t in topics][:4]
    except Exception:
        pass

    return []
