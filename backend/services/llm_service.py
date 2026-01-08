import httpx
import os
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# MODEL_NAME = "mistralai/mixtral-8x7b-instruct"
MODEL_NAME = "meta-llama/llama-3-8b-instruct"





async def get_ai_response_with_context(messages: list):
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL_NAME,
        "messages": messages
    }
    # print("=======================")
    # print(messages)
    async with httpx.AsyncClient() as client:
        response = await client.post(
            OPENROUTER_URL,
            headers=headers,
            json=payload,
            timeout=60
        )

    data = response.json()
    return data["choices"][0]["message"]["content"]
