import os
import httpx
import math

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

EMBED_URL = "https://openrouter.ai/api/v1/embeddings"
EMBED_MODEL = "text-embedding-3-small"

# Simple in-memory vector store
# Each item: { user_id, embedding, text }
VECTOR_STORE = []


async def embed_text(text: str):
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": EMBED_MODEL,
        "input": text
    }

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(EMBED_URL, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()

    return data["data"][0]["embedding"]


def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    return dot / (norm_a * norm_b)


async def store_embedding(user_id: int, message_id: str, text: str):
    embedding = await embed_text(text)

    VECTOR_STORE.append({
        "user_id": user_id,
        "message_id": message_id,
        "embedding": embedding,
        "text": text
    })


async def search_similar(user_id: int, query: str, top_k: int = 3):
    if not VECTOR_STORE:
        return []

    query_embedding = await embed_text(query)

    scored = []
    for item in VECTOR_STORE:
        if item["user_id"] != user_id:
            continue

        score = cosine_similarity(query_embedding, item["embedding"])
        scored.append((score, item["text"]))

    scored.sort(reverse=True, key=lambda x: x[0])
    return [text for _, text in scored[:top_k]]
