import * as React from "react";
import classNames from "classnames";
import { Navigate } from "react-router-dom";

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "login",
      firstName: "",
      lastName: "",
      login: "",
      password: "",
      redirect: false,
      error: ""
    };
  }

  onChangeHandler = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, error: "" });
  };

  onSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      const { login, password } = this.state;
      await this.props.onLogin(e, login, password);
      this.setState({ redirect: true });
    } catch (error) {
      this.setState({ error: "Неверный логин или пароль" });
    }
  };

  onSubmitRegister = async (e) => {
    e.preventDefault();
    try {
      const { firstName, lastName, login, password } = this.state;
      await this.props.onRegister(e, firstName, lastName, login, password);
      this.setState({ redirect: true });
    } catch (error) {
      this.setState({ error: "Ошибка регистрации. Возможно, логин уже занят." });
    }
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to="/events" />;
    }

    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg rounded-3">
              <div className="card-body p-4">
                {this.state.error && (
                  <div className="alert alert-danger mb-4">
                    {this.state.error}
                  </div>
                )}

                <ul className="nav nav-pills nav-justified mb-4">
                  <li className="nav-item">
                    <button
                      className={classNames("nav-link", {
                        active: this.state.active === "login",
                      })}
                      onClick={() => this.setState({ active: "login", error: "" })}
                    >
                      Вход
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={classNames("nav-link", {
                        active: this.state.active === "register",
                      })}
                      onClick={() => this.setState({ active: "register", error: "" })}
                    >
                      Регистрация
                    </button>
                  </li>
                </ul>

                {this.state.active === "login" && (
                  <form onSubmit={this.onSubmitLogin}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="loginName">
                        Логин
                      </label>
                      <input
                        type="text"
                        id="loginName"
                        name="login"
                        className="form-control"
                        placeholder="Введите логин"
                        onChange={this.onChangeHandler}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label" htmlFor="loginPassword">
                        Пароль
                      </label>
                      <input
                        type="password"
                        id="loginPassword"
                        name="password"
                        className="form-control"
                        placeholder="Введите пароль"
                        onChange={this.onChangeHandler}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                      Войти
                    </button>
                  </form>
                )}

                {this.state.active === "register" && (
                  <form onSubmit={this.onSubmitRegister}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="firstName">
                        Имя
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="form-control"
                        placeholder="Введите имя"
                        onChange={this.onChangeHandler}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label" htmlFor="lastName">
                        Фамилия
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="form-control"
                        placeholder="Введите фамилию"
                        onChange={this.onChangeHandler}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label" htmlFor="registerLogin">
                        Логин
                      </label>
                      <input
                        type="text"
                        id="registerLogin"
                        name="login"
                        className="form-control"
                        placeholder="Придумайте логин"
                        onChange={this.onChangeHandler}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label" htmlFor="registerPassword">
                        Пароль
                      </label>
                      <input
                        type="password"
                        id="registerPassword"
                        name="password"
                        className="form-control"
                        placeholder="Придумайте пароль"
                        onChange={this.onChangeHandler}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-success w-100">
                      Зарегистрироваться
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}