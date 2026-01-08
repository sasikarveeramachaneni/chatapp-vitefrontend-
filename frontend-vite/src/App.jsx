import { useState } from "react";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";

function App() {
  const [authenticated, setAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  function handleLogout() {
    setAuthenticated(false);
  }

  return authenticated ? (
    <Chat onLogout={handleLogout} />
  ) : (
    <Auth onAuth={() => setAuthenticated(true)} />
  );
}

export default App;
