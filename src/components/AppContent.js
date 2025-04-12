import * as React from "react";
import { request, setAuthHeader } from "./helpers/axios_helper.js";
import Buttons from "./AuthComponents/Buttons.js";
import AuthContent from "./AuthComponents/AuthContent.js";
import LoginForm from "./AuthComponents/LoginForm.js";
import WelcomeContent from "./AuthComponents/WelcomeContent.js";

export default class AppContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            componentToShow: "welcome"
        };
    }

    login = () => {
        this.setState({ componentToShow: "login" });
    };

    logout = () => {
        this.setState({ componentToShow: "welcome" });
        setAuthHeader(null);
        this.props.setIsLoggedIn(false); // Сбрасываем авторизацию в App.js
    };

    onLogin = (e, username, password) => {
        e.preventDefault();
        request("POST", "/login", { login: username, password: password })
            .then((response) => {
                setAuthHeader(response.data.token);
                this.props.setIsLoggedIn(true); // Теперь App.js переключится на EventHeader + EventApp
            })
            .catch((error) => {
                setAuthHeader(null);
                this.setState({ componentToShow: "welcome" });
            });
    };

    onRegister = (event, firstName, lastName, username, password) => {
        event.preventDefault();
        request("POST", "/register", {
            firstName: firstName,
            lastName: lastName,
            login: username,
            password: password
        })
            .then((response) => {
                setAuthHeader(response.data.token);
                this.props.setIsLoggedIn(true); // Тоже обновляем состояние в App.js
            })
            .catch((error) => {
                setAuthHeader(null);
                this.setState({ componentToShow: "welcome" });
            });
    };

    render() {
        return (
            <>
                <Buttons login={this.login} logout={this.logout} />

                {this.state.componentToShow === "welcome" && <WelcomeContent />}
                {this.state.componentToShow === "login" && (
                    <LoginForm onLogin={this.onLogin} onRegister={this.onRegister} />
                )}
                {this.state.componentToShow === "messages" && <AuthContent />}
            </>
        );
    }
}
