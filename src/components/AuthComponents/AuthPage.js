import * as React from "react";
import { request, setAuthHeader } from "../helpers/axios_helper.js";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import WelcomeContent from "./WelcomeContent";

export default function AuthPage({ setIsLoggedIn }) {
  const [componentToShow, setComponentToShow] = React.useState("welcome");
  const navigate = useNavigate();

  const login = () => {
    setComponentToShow("login");
  };

  const logout = () => {
    setComponentToShow("welcome");
    setAuthHeader(null);
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const onLogin = (e, username, password) => {
    e.preventDefault();
    request("POST", "/login", {
      login: username,
      password: password,
    })
      .then((response) => {
        setAuthHeader(response.data.token);
        setIsLoggedIn(true);
        navigate("/events");
      })
      .catch(() => {
        setAuthHeader(null);
        setComponentToShow("welcome");
      });
  };

  const onRegister = (event, firstName, lastName, username, password) => {
    event.preventDefault();
    request("POST", "/register", {
      firstName: firstName,
      lastName: lastName,
      login: username,
      password: password,
    })
      .then((response) => {
        setAuthHeader(response.data.token);
        setIsLoggedIn(true);
        navigate("/events");
      })
      .catch(() => {
        setAuthHeader(null);
        setComponentToShow("welcome");
      });
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
        {componentToShow === "login" && <LoginForm onLogin={onLogin} onRegister={onRegister} />}
      </div>
    </div>
  );
}
