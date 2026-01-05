// import { useEffect, useState } from "react";
// import { startChat, sendMessage, getHistory } from "../services/api";

// export default function Chat() {
//   const token = localStorage.getItem("token");
//   const [chatId, setChatId] = useState(null);
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     async function init() {
//       const res = await startChat(token);
//       setChatId(res.chat_id);
//     }
//     init();
//   }, [token]);

//   async function handleSend() {
//     if (!input.trim()) return;

//     await sendMessage(chatId, input, token);
//     const history = await getHistory(chatId, token);
//     setMessages(history.messages);
//     setInput("");
//   }

//   return (
//     <div style={{ padding: 30 }}>
//       <h2>AI Chat</h2>

//       <div
//         style={{
//           border: "1px solid #ccc",
//           height: 350,
//           overflowY: "auto",
//           padding: 10,
//         }}
//       >
//         {messages.map((m, i) => (
//           <div key={i}>
//             <b>{m.sender}:</b> {m.text}
//           </div>
//         ))}
//       </div>

//       <br />

//       <input
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder="Type your message"
//         style={{ width: "80%" }}
//       />
//       <button onClick={handleSend}>Send</button>
//     </div>
//   );
// }

//with logout

// import { useEffect, useState,useRef } from "react";
// import { startChat, sendMessage, getHistory } from "../services/api";
// import "./Chat.css";

// export default function Chat({ onLogout }) {
//   const token = localStorage.getItem("token");
//   const [chatId, setChatId] = useState(null);
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]);
//   const startedRef = useRef(false);

//   // useEffect(() => {
//   //   async function init() {
//   //     const res = await startChat(token);
//   //     setChatId(res.chat_id);
//   //   }
//   //   init();
//   // }, [token]);


// useEffect(() => {
//   if (startedRef.current) return;
//   startedRef.current = true;

//   async function init() {
//     const res = await startChat(token);
//     setChatId(res.chat_id);
//   }
//   init();
// }, [token]);


//   // async function handleSend() {
//   //   if (!input.trim()) return;

//   //   await sendMessage(chatId, input, token);
//   //   const history = await getHistory(chatId, token);
//   //   setMessages(history.messages);
//   //   setInput("");
//   // }
// const [sending, setSending] = useState(false);

// async function handleSend() {
//   if (!input.trim() || sending) return;

//   setSending(true);
//   await sendMessage(chatId, input, token);
//   const history = await getHistory(chatId, token);
//   setMessages(history.messages);
//   setInput("");
//   setSending(false);
// }

//   function handleLogout() {
//     localStorage.removeItem("token");
//     onLogout();
//   }

//   return (
//     <div className="chat-container">
//       <div className="chat-header">
//         <span>AI Chat Assistant</span>
//         <button className="logout-btn" onClick={handleLogout}>
//           Logout
//         </button>
//       </div>

//       <div className="chat-messages">
//         {messages.map((m, i) => (
//           <div
//             key={i}
//             className={`message ${m.sender === "user" ? "user" : "ai"}`}
//           >
//             {m.text}
//           </div>
//         ))}
//       </div>

//       <div className="chat-input">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type your message..."
//         />
//         <button onClick={handleSend}>Send</button>
//       </div>
//     </div>
//   );
// }





// import { useEffect, useRef, useState } from "react";
// import { startChat, sendMessage, getHistory } from "../services/api";
// import "./Chat.css";

// export default function Chat({ onLogout }) {
//   const token = localStorage.getItem("token");

//   const [chatId, setChatId] = useState(null);
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]); // ALWAYS array

//   const startedRef = useRef(false);
//   const sendingRef = useRef(false);

//   // 🔹 Start chat ONCE
//   useEffect(() => {
//     if (startedRef.current) return;
//     startedRef.current = true;

//     async function init() {
//       try {
//         const res = await startChat(token);
//         setChatId(res.chat_id);
//       } catch (err) {
//         console.error("Failed to start chat", err);
//       }
//     }

//     init();
//   }, [token]);

//   // 🔹 Send message safely
//   async function handleSend() {
//     if (!input.trim()) return;
//     if (!chatId) return;              // guard
//     if (sendingRef.current) return;

//     sendingRef.current = true;

//     try {
//       await sendMessage(chatId, input, token);

//       const history = await getHistory(chatId, token);

//       // ✅ SAFE UPDATE
//       setMessages(Array.isArray(history.messages) ? history.messages : []);
//       setInput("");
//     } catch (err) {
//       console.error("Send failed", err);
//     } finally {
//       sendingRef.current = false;
//     }
//   }

//   // function handleKeyDown(e) {
//   //   if (e.key === "Enter") {
//   //     e.preventDefault();
//   //     handleSend();
//   //   }
//   // }

//   function handleLogout() {
//     localStorage.removeItem("token");
//     onLogout();
//   }

//   return (
//     <div className="chat-container">
//       <div className="chat-header">
//         <span>AI Chat Assistant</span>
//         <button className="logout-btn" onClick={handleLogout}>
//           Logout
//         </button>
//       </div>

//       <div className="chat-messages">
//         {Array.isArray(messages) &&
//           messages.map((m, i) => (
//             <div
//               key={i}
//               className={`message ${m.sender === "user" ? "user" : "ai"}`}
//             >
//               {m.text}
//             </div>
//           ))}
//       </div>

//       {/* <div className="chat-input">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type your message..."
//         />
//         <button type="button" onClick={handleSend}>
//           Send
//         </button>
//       </div> */}
//       <form className="chat-input" onSubmit={(e) => {
//         e.preventDefault();
//         handleSend();
//       }}>
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type your message..."
//         />
//         <button type="submit">Send</button>
//       </form>

//     </div>
//   );
// }


// import { useEffect, useRef, useState } from "react";
// import { startChat, sendMessage, getHistory } from "../services/api";
// import "./Chat.css";
// import { getChatSessions, startChat, sendMessage, getHistory } from "../services/api";
// import ChatSidebar from "./ChatSidebar";

// export default function Chat({ onLogout }) {
//   const token = localStorage.getItem("token");

//   const [chatId, setChatId] = useState(null);
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]); // ALWAYS array
//   const [sessions, setSessions] = useState([]);
//   // const [chatId, setChatId] = useState(null);

//   const startedRef = useRef(false);
//   const sendingRef = useRef(false);

//   // 🔹 Start chat ONLY once
//   useEffect(() => {
//     if (startedRef.current) return;
//     startedRef.current = true;

//     async function init() {
//       try {
//         const res = await startChat(token);
//         setChatId(res.chat_id);
//       } catch (err) {
//         console.error("Failed to start chat", err);
//       }
//     }

//     init();
//   }, [token]);

//   // 🔹 Load history ONLY once when chatId is ready
//   useEffect(() => {
//     if (!chatId) return;

//     async function loadHistory() {
//       try {
//         const history = await getHistory(chatId, token);
//         setMessages(Array.isArray(history.messages) ? history.messages : []);
//       } catch (err) {
//         console.error("Failed to load history", err);
//       }
//     }

//     loadHistory();
//   }, [chatId, token]);

//   // 🔹 Send message (NO history fetch here)
//   async function handleSend() {
//     if (!input.trim()) return;
//     if (!chatId) return;
//     if (sendingRef.current) return;

//     sendingRef.current = true;

//     const userMessage = {
//       sender: "user",
//       text: input,
//     };

//     // ✅ Add user message immediately
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");

//     try {
//       const res = await sendMessage(chatId, input, token);

//       // ✅ Append AI response ONCE
//       if (res?.reply) {
//         setMessages((prev) => [
//           ...prev,
//           { sender: "ai", text: res.reply },
//         ]);
//       }
//     } catch (err) {
//       console.error("Send failed", err);
//     } finally {
//       sendingRef.current = false;
//     }
//   }

//   function handleLogout() {
//     localStorage.removeItem("token");
//     onLogout();
//   }

//   return (
//     <div className="chat-container">
//       <div className="chat-header">
//         <span>AI Chat Assistant</span>
//         <button className="logout-btn" onClick={handleLogout}>
//           Logout
//         </button>
//       </div>

//       <div className="chat-messages">
//         {messages.map((m, i) => (
//           <div
//             key={i}
//             className={`message ${m.sender === "user" ? "user" : "ai"}`}
//           >
//             {m.text}
//           </div>
//         ))}
//       </div>

//       {/* ✅ Enter key + Send button */}
//       <form
//         className="chat-input"
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleSend();
//         }}
//       >
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type your message..."
//         />
//         <button type="submit">Send</button>
//       </form>
//     </div>
//   );
// }


import { useEffect, useRef, useState } from "react";
import {
  startChat,
  sendMessage,
  getHistory,
  getChatSessions
} from "../services/api";
import "./Chat.css";
import ChatSidebar from "./ChatSidebar";
import ReactMarkdown from "react-markdown";


export default function Chat({ onLogout }) {
  const token = localStorage.getItem("token");

  const [sessions, setSessions] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const sendingRef = useRef(false);
  const [loading, setLoading] = useState(false);


  /* ---------------- Load sidebar sessions ---------------- */

  useEffect(() => {
    async function loadSessions() {
      try {
        const res = await getChatSessions(token);
        setSessions(res.sessions || []);
      } catch (err) {
        console.error("Failed to load sessions", err);
      }
    }
    loadSessions();
  }, [token]);

  /* ---------------- Select chat & load history ---------------- */

  async function handleSelectChat(id) {
    try {
      setChatId(id);
      const history = await getHistory(id, token);
      setMessages(Array.isArray(history.messages) ? history.messages : []);
    } catch (err) {
      console.error("Failed to load chat history", err);
    }
  }

  /* ---------------- Start new chat ---------------- */

  async function handleNewChat() {
    try {
      const res = await startChat(token);
      setChatId(res.chat_id);
      setMessages([]);
      setInput("");

      const updated = await getChatSessions(token);
      setSessions(updated.sessions || []);
    } catch (err) {
      console.error("Failed to start new chat", err);
    }
  }

  /* ---------------- Send message ---------------- */

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || !chatId || sendingRef.current) return;

    sendingRef.current = true;
    setLoading(true);

    const userText = input;
    setInput("");

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText }
    ]);

    try {
      const res = await sendMessage(chatId, userText, token);
      if (res?.reply) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: res.reply }
        ]);
      }

      // Refresh sidebar titles
      // const updated = await getChatSessions(token);
      // setSessions(updated.sessions || []);
    } catch (err) {
      console.error("Send failed", err);
    } finally {
      sendingRef.current = false;
      setLoading(false);
    }
  }

  /* ---------------- Logout ---------------- */

  function handleLogout() {
    localStorage.removeItem("token");
    onLogout();
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="chat-layout">
      <ChatSidebar
        sessions={sessions}
        activeChatId={chatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />

      <div className="chat-container">
        <div className="chat-header">
          <span>AI Chat Assistant</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {!chatId ? (
          <div className="chat-placeholder">
            <button className="start-chat-btn" onClick={handleNewChat}>Start Chat</button>
          </div>
        ) : (
          <>
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`message ${m.sender}`}
                >
              <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
              ))}
              {loading && (
    <div className="message ai typing">
      <span className="dot">.</span>
      <span className="dot">.</span>
      <span className="dot">.</span>
    </div>
  )}
            </div>

            <form className="chat-input" onSubmit={handleSend}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
              />
              <button type="submit">Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
