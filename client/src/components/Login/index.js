import "./index.css";
import { Component } from "react";
import Cookies from "js-cookie";
import { Redirect } from "react-router-dom";

class Login extends Component {
  state = { username: "", password: "", errMsg: "", showPassword: false };

  onUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  togglePasswordView = () => {
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  };

  onLogin = async (event) => {
    event.preventDefault();

    const { username, password } = this.state;
    const url = "/user";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    };

    const response = await fetch(url, options);
    let data;
    if (response.ok === true) {
      data = await response.json();
      this.onLoginSuccess(data);
    } else {
      data = await response.json();
      this.onLoginFailure(data);
    }
  };

  onLoginSuccess = (data) => {
    const jwtToken = data.jwt_token;
    Cookies.set("jwt_token", jwtToken, { expires: 30 });

    const { history } = this.props;
    history.replace("/");
  };

  onLoginFailure = async (data) => {
    this.setState({ errMsg: data.error_msg });
  };

  render() {
    const jwtToken = Cookies.get("jwt_token");
    if (jwtToken !== undefined) {
      return <Redirect to="/" />;
    }
    const { username, password, errMsg, showPassword } = this.state;
    const passwordInputType = showPassword ? "text" : "password";
    return (
      <div className="Login-container">
        <form className="login-form" onSubmit={this.onLogin}>
          <div className="logo-container">
            <img
              src="https://www.kratin.co.in/images/kratin01.png"
              alt="website logo"
              className="login-logo"
            />
            <h1 className="logo-heading">GlucoCare</h1>
          </div>

          <label htmlFor="username" className="login-form-label">
            USERNAME
          </label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={this.onUsernameChange}
            className="login-form-input"
          />
          <label htmlFor="password" className="login-form-label">
            PASSWORD
          </label>
          <input
            id="password"
            type={passwordInputType}
            placeholder="Password"
            value={password}
            onChange={this.onPasswordChange}
            className="login-form-input"
          />
          <div>
            <input
              type="checkbox"
              id="checkbox"
              onChange={this.togglePasswordView}
              className="checkbox"
            />
            <label htmlFor="checkbox" className="checkbox-label">
              Show Password
            </label>
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
          {errMsg !== "" ? <p className="errMsg">*{errMsg}</p> : null}
        </form>
      </div>
    );
  }
}
export default Login;
