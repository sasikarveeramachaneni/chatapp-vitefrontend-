def generate_chat_title(topics: list[str]) -> str:
    if not topics:
        return "New Chat"

    # Take first 2–3 topics
    return " · ".join(topics[:3])
