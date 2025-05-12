import * as React from "react";

export default function WelcomeContent({ onLogin }) {
  return (
    <div className="auth-container">
      <h2>Добро пожаловать!</h2>
      <p className="lead">Зарегистрируйтесь или войдите, чтобы получить доступ ко всем возможностям.</p>
      <button className="btn-primary mt-3" onClick={onLogin}>
        Зарегистрироваться / Войти
      </button>
    </div>
  );
}