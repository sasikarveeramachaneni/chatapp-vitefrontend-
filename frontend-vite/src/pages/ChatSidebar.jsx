export default function ChatSidebar({
  sessions,
  activeChatId,
  onSelectChat,
  onNewChat
}) {
  return (
    <div className="chat-sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <h3>Your Chats</h3>
        <button className="new-chat-btn" onClick={onNewChat}>
          + New
        </button>
      </div>

      {/* Chat List */}
      <div className="chat-list">
        {sessions.length === 0 && (
          <p className="empty-sidebar">No chats yet</p>
        )}

        {sessions.map((chat) => (
          <div
            key={chat.chat_id}
            className={`chat-item ${
              chat.chat_id === activeChatId ? "active" : ""
            }`}
            onClick={() => onSelectChat(chat.chat_id)}
          >
            <div className="chat-title">
              {chat.title || "New Chat"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

