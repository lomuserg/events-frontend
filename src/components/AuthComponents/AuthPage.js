import * as React from "react";
import { request, setAuthHeader } from "../helpers/axios_helper";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import WelcomeContent from "./WelcomeContent";

export default function AuthPage({ onLogin }) {
  const [componentToShow, setComponentToShow] = React.useState("welcome");
  const navigate = useNavigate();

  const login = () => setComponentToShow("login");
  const logout = () => {
    setComponentToShow("welcome");
    setAuthHeader(null);
    navigate("/");
  };

  const handleLoginSuccess = (token) => {
    setAuthHeader(token);
    onLogin(); // Вызываем колбэк из App.js для обновления состояния
    navigate("/events");
  };

  const handleLogin = async (e, username, password) => {
    e.preventDefault();
    try {
      const response = await request.post("/login", {
        login: username,
        password: password,
      });
      handleLoginSuccess(response.data.token);
    } catch (err) {
      console.error("Login failed:", err);
      setComponentToShow("welcome");
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const onRegister = async (event, firstName, lastName, username, password) => {
    event.preventDefault();
    try {
      const response = await request.post("/register", {
        firstName: firstName,
        lastName: lastName,
        login: username,
        password: password,
      });
      handleLoginSuccess(response.data.token);
    } catch (err) {
      console.error("Registration failed:", err);
      setComponentToShow("welcome");
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <button className="btn btn-primary" onClick={login}>
          Login
        </button>
        <button className="btn btn-dark" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="content">
        {componentToShow === "welcome" && <WelcomeContent />}
        {componentToShow === "login" && (
          <LoginForm onLogin={handleLogin} onRegister={onRegister} />
        )}
      </div>
    </div>
  );
}
