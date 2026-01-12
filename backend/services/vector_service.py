# import os
# import httpx
# import math

# OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# EMBED_URL = "https://openrouter.ai/api/v1/embeddings"
# EMBED_MODEL = "text-embedding-3-small"

# # Simple in-memory vector store
# # Each item: { user_id, embedding, text }
# VECTOR_STORE = []


# async def embed_text(text: str):
#     headers = {
#         "Authorization": f"Bearer {OPENROUTER_API_KEY}",
#         "Content-Type": "application/json"
#     }

#     payload = {
#         "model": EMBED_MODEL,
#         "input": text
#     }

#     async with httpx.AsyncClient(timeout=30) as client:
#         response = await client.post(EMBED_URL, headers=headers, json=payload)
#         response.raise_for_status()
#         data = response.json()

#     return data["data"][0]["embedding"]


# def cosine_similarity(a, b):
#     dot = sum(x * y for x, y in zip(a, b))
#     norm_a = math.sqrt(sum(x * x for x in a))
#     norm_b = math.sqrt(sum(x * x for x in b))
#     return dot / (norm_a * norm_b)


# async def store_embedding(user_id: int, message_id: str, text: str):
#     embedding = await embed_text(text)

#     VECTOR_STORE.append({
#         "user_id": user_id,
#         "message_id": message_id,
#         "embedding": embedding,
#         "text": text
#     })


# async def search_similar(user_id: int, query: str, top_k: int = 3):
#     if not VECTOR_STORE:
#         return []

#     query_embedding = await embed_text(query)

#     scored = []
#     for item in VECTOR_STORE:
#         if item["user_id"] != user_id:
#             continue

#         score = cosine_similarity(query_embedding, item["embedding"])
#         scored.append((score, item["text"]))

#     scored.sort(reverse=True, key=lambda x: x[0])
#     return [text for _, text in scored[:top_k]]


import os
import httpx
import faiss
import pickle
import numpy as np
from typing import List

# ---------------- CONFIG ----------------

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

EMBED_URL = "https://openrouter.ai/api/v1/embeddings"
EMBED_MODEL = "text-embedding-3-small"

EMBED_DIM = 1536

FAISS_DIR = "/app/faiss"
FAISS_INDEX_PATH = f"{FAISS_DIR}/faiss.index"
META_PATH = f"{FAISS_DIR}/faiss_meta.pkl"

os.makedirs(FAISS_DIR, exist_ok=True)

# ---------------- LOAD / INIT FAISS ----------------

if os.path.exists(FAISS_INDEX_PATH):
    index = faiss.read_index(FAISS_INDEX_PATH)
else:
    index = faiss.IndexFlatL2(EMBED_DIM)

if os.path.exists(META_PATH):
    with open(META_PATH, "rb") as f:
        METADATA = pickle.load(f)
else:
    METADATA = []

# ---------------- EMBEDDING ----------------

async def embed_text(text: str) -> List[float]:
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

# ---------------- STORE EMBEDDING ----------------

async def store_embedding(user_id: int, message_id: str, text: str):
    embedding = await embed_text(text)

    # ✅ Convert to NumPy float32, shape (1, dim)
    vector = np.array([embedding], dtype="float32")

    index.add(vector)

    METADATA.append({
        "user_id": user_id,
        "message_id": message_id,
        "text": text
    })

    faiss.write_index(index, FAISS_INDEX_PATH)
    with open(META_PATH, "wb") as f:
        pickle.dump(METADATA, f)

# ---------------- SEMANTIC SEARCH ----------------

async def search_similar(user_id: int, query: str, top_k: int = 3):
    if index.ntotal == 0:
        return []

    query_embedding = await embed_text(query)

    # ✅ Convert query to NumPy
    query_vector = np.array([query_embedding], dtype="float32")

    distances, indices = index.search(query_vector, top_k * 5)

    results = []
    for idx in indices[0]:
        if idx == -1:
            continue

        meta = METADATA[idx]
        if meta["user_id"] != user_id:
            continue

        results.append(meta["text"])
        if len(results) == top_k:
            break

    return results
