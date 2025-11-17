import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthPage.module.css";
import LoginForm from "../../components/auth/LoginForm/LoginForm";
import WelcomeContent from "../../components/auth/WelcomeContent/WelcomeContent";
import { request, setAuthHeader } from "../../components/helpers/axios_helper";

export default function AuthPage({ onLogin }) {
  const [componentToShow, setComponentToShow] = useState("welcome");
  const navigate = useNavigate();

  const handleLoginSuccess = (token) => {
    setAuthHeader(token);
    if (typeof onLogin === "function") {
      onLogin();
    }
    navigate("/events");
  };

  const handleLogin = async (e, username, password) => {
    e.preventDefault();
    try {
      const response = await request.post("/login", { login: username, password });
      handleLoginSuccess(response.data.token);
    } catch (err) {
      console.error("Ошибка входа:", err);
      alert(err.response?.data?.message || "Ошибка входа");
      setComponentToShow("welcome");
      throw err;
    }
  };

  const handleRegister = async (e, firstName, lastName, username, password) => {
    e.preventDefault();
    try {
      const response = await request.post("/register", { firstName, lastName, login: username, password });
      handleLoginSuccess(response.data.token);
    } catch (err) {
      console.error("Ошибка регистрации:", err);
      alert(err.response?.data?.message || "Ошибка регистрации");
      setComponentToShow("welcome");
      throw err;
    }
  };

  return (
    <div className={styles.page}>
      {componentToShow === "welcome" && <WelcomeContent onLogin={() => setComponentToShow("login")} />}
      {componentToShow === "login" && <LoginForm onLogin={handleLogin} onRegister={handleRegister} />}
    </div>
  );
}
