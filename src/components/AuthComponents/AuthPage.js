import * as React from 'react';
import { request, setAuthHeader } from '../helpers/axios_helper.js';
import { useNavigate } from 'react-router-dom';

import Buttons from './Buttons';
import LoginForm from './LoginForm';
import WelcomeContent from './WelcomeContent';

export default function AuthPage({ setIsLoggedIn }) { // Принимаем setIsLoggedIn
    const [componentToShow, setComponentToShow] = React.useState("welcome");
    const navigate = useNavigate();

    const login = () => {
        setComponentToShow("login");
    };

    const logout = () => {
        setComponentToShow("welcome");
        setAuthHeader(null);
        setIsLoggedIn(false); // Сбрасываем авторизацию
    };

    const onLogin = (e, username, password) => {
        e.preventDefault();
        request(
            "POST",
            "/login",
            {
                login: username,
                password: password
            }).then((response) => {
                setAuthHeader(response.data.token);
                setIsLoggedIn(true); // Устанавливаем авторизацию
                navigate("/events"); // После логина переходим на EventApp
            }).catch((error) => {
                setAuthHeader(null);
                setComponentToShow("welcome");
            }
        );
    };

    const onRegister = (event, firstName, lastName, username, password) => {
        event.preventDefault();
        request(
            "POST",
            "/register",
            {
                firstName: firstName,
                lastName: lastName,
                login: username,
                password: password
            }).then((response) => {
                setAuthHeader(response.data.token);
                setIsLoggedIn(true); // Устанавливаем авторизацию
                navigate("/events"); // После регистрации переходим на EventApp
            }).catch((error) => {
                setAuthHeader(null);
                setComponentToShow("welcome");
            }
        );
    };

    return (
        <div>
            <Buttons login={login} logout={logout} />
            {componentToShow === "welcome" && <WelcomeContent />}
            {componentToShow === "login" && <LoginForm onLogin={onLogin} onRegister={onRegister} />}
        </div>
    );
}
