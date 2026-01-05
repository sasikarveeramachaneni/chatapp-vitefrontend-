// import { useState } from "react";
// import { loginUser, registerUser } from "../services/api";

// export default function Auth({ onAuth }) {
//   const [mode, setMode] = useState("login"); // login | register
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   async function handleSubmit() {
//     if (mode === "register") {
//       const res = await registerUser({ username, email, password });
//       if (res.message) {
//         alert("Registered successfully. Please login.");
//         setMode("login");
//       } else {
//         alert(res.detail || "Registration failed");
//       }
//     } else {
//       const res = await loginUser({ username, password });
//       if (res.access_token) {
//         localStorage.setItem("token", res.access_token);
//         onAuth();
//       } else {
//         alert(res.detail || "Login failed");
//       }
//     }
//   }

//   return (
//     <div style={{ padding: 40 }}>
//       <h2>{mode === "login" ? "Login" : "Register"}</h2>

//       <input
//         placeholder="Username"
//         onChange={(e) => setUsername(e.target.value)}
//       /><br /><br />

//       {mode === "register" && (
//         <>
//           <input
//             placeholder="Email"
//             onChange={(e) => setEmail(e.target.value)}
//           /><br /><br />
//         </>
//       )}

//       <input
//         type="password"
//         placeholder="Password"
//         onChange={(e) => setPassword(e.target.value)}
//       /><br /><br />

//       <button onClick={handleSubmit}>
//         {mode === "login" ? "Login" : "Register"}
//       </button>

//       <br /><br />

//       <button onClick={() => setMode(mode === "login" ? "register" : "login")}>
//         {mode === "login"
//           ? "New user? Register"
//           : "Already have an account? Login"}
//       </button>
//     </div>
//   );
// }


import { useState } from "react";
import { loginUser, registerUser } from "../services/api";
import "./Auth.css";

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    if (mode === "register") {
      const res = await registerUser({ username, email, password });
      if (res.message) {
        alert("Registered successfully. Please login.");
        setMode("login");
      } else {
        alert(res.detail || "Registration failed");
      }
    } else {
      const res = await loginUser({ username, password });
      if (res.access_token) {
        localStorage.setItem("token", res.access_token);
        onAuth();
      } else {
        alert(res.detail || "Login failed");
      }
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{mode === "login" ? "Login" : "Register"}</h2>

        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        {mode === "register" && (
          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {mode === "login" ? "Login" : "Register"}
        </button>

        <button
          className="toggle-btn"
          onClick={() =>
            setMode(mode === "login" ? "register" : "login")
          }
        >
          {mode === "login"
            ? "New user? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
