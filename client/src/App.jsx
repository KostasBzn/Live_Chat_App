import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import RequireAuth from "./components/auth-protect/RequireAuth";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/chat"
          element={
            <RequireAuth>
              <ChatPage />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}

export default App;
