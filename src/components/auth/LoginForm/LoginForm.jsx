// components/auth/LoginForm/LoginForm.jsx
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import classNames from "classnames";
import styles from "./LoginForm.module.css";

export default function LoginForm({ onLogin, onRegister }) {
  const [active, setActive] = useState("login");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    login: "",
    password: ""
  });
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setError("");
  };

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      await onLogin(e, form.login, form.password);
      setRedirect(true);
    } catch (err) {
      setError("Неверный логин или пароль");
    }
  };

  const onSubmitRegister = async (e) => {
    e.preventDefault();
    try {
      await onRegister(e, form.firstName, form.lastName, form.login, form.password);
      setRedirect(true);
    } catch (err) {
      setError("Ошибка регистрации. Возможно, логин уже занят.");
    }
  };

  if (redirect) {
    return <Navigate to="/events" replace />;
  }

  return (
    <div className={styles.wrapper}>
     <div className={styles.card}>
        {error && <div className={styles.error}>{error}</div>}

        <ul className={styles.pills}>
          <li>
            <button
              type="button"
              className={classNames(styles.pill, { [styles.activePill]: active === "login" })}
              onClick={() => { setActive("login"); setError(""); }}
            >
              Вход
            </button>
          </li>
          <li>
            <button
              type="button"
              className={classNames(styles.pill, { [styles.activePill]: active === "register" })}
              onClick={() => { setActive("register"); setError(""); }}
            >
              Регистрация
            </button>
          </li>
        </ul>

        {active === "login" && (
          <form onSubmit={onSubmitLogin} className={styles.form}>
            <label className={styles.label} htmlFor="loginName">Логин</label>
            <input
              id="loginName"
              name="login"
              value={form.login}
              onChange={onChangeHandler}
              className={styles.input}
              placeholder="Введите логин"
              required
            />

            <label className={styles.label} htmlFor="loginPassword">Пароль</label>
            <input
              id="loginPassword"
              name="password"
              type="password"
              value={form.password}
              onChange={onChangeHandler}
              className={styles.input}
              placeholder="Введите пароль"
              required
            />

            <button type="submit" className={styles.primaryBtn}>Войти</button>
          </form>
        )}

        {active === "register" && (
          <form onSubmit={onSubmitRegister} className={styles.form}>
            <label className={styles.label} htmlFor="firstName">Имя</label>
            <input
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={onChangeHandler}
              className={styles.input}
              placeholder="Введите имя"
              required
            />

            <label className={styles.label} htmlFor="lastName">Фамилия</label>
            <input
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={onChangeHandler}
              className={styles.input}
              placeholder="Введите фамилию"
              required
            />

            <label className={styles.label} htmlFor="registerLogin">Логин</label>
            <input
              id="registerLogin"
              name="login"
              value={form.login}
              onChange={onChangeHandler}
              className={styles.input}
              placeholder="Придумайте логин"
              required
            />

            <label className={styles.label} htmlFor="registerPassword">Пароль</label>
            <input
              id="registerPassword"
              name="password"
              type="password"
              value={form.password}
              onChange={onChangeHandler}
              className={styles.input}
              placeholder="Придумайте пароль"
              required
            />

            <button type="submit" className={styles.successBtn}>Зарегистрироваться</button>
          </form>
        )}
      </div>
    </div>
  );
}
