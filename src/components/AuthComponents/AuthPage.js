import * as React from "react";
import { request, setAuthHeader } from "../helpers/axios_helper";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import WelcomeContent from "./WelcomeContent";

export default function AuthPage({ onLogin }) {
  const [componentToShow, setComponentToShow] = React.useState("welcome");
  const navigate = useNavigate();

  const handleLoginSuccess = (token) => {
    setAuthHeader(token);
    onLogin(); 
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
      console.error("Ошибка входа:", err);
      alert(err.response?.data?.message || "Ошибка входа");
      setComponentToShow("welcome");
    }
  };

  const handleRegister = async (e, firstName, lastName, username, password) => {
    e.preventDefault();
    try {
      const response = await request.post("/register", {
        firstName,
        lastName,
        login: username,
        password,
      });
      handleLoginSuccess(response.data.token);
    } catch (err) {
      console.error("Ошибка регистрации:", err);
      alert(err.response?.data?.message || "Ошибка регистрации");
      setComponentToShow("welcome");
    }
  };

  return (
    <div className="auth-page">
      {componentToShow === "welcome" && (
        <WelcomeContent onLogin={() => setComponentToShow("login")} />
      )}
      {componentToShow === "login" && (
        <LoginForm onLogin={handleLogin} onRegister={handleRegister} />
      )}
    </div>
  );
}