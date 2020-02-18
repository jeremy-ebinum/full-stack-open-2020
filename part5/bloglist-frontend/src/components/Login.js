import React from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Input from "./Input";
import InputAddon from "./InputAddon";

const Login = props => {
  let icon;
  if (props.showPassword) {
    icon = faEyeSlash;
  } else {
    icon = faEye;
  }

  return (
    <form className="c-login" onSubmit={props.handleSubmit}>
      <div className="c-login__header">Login to Application</div>
      <div className="c-login__body">
        <div className="c-row">
          <Input
            handleChange={props.handleUsernameChange}
            value={props.usernameValue}
            placeholder="Enter Username"
          />
        </div>
        <div className="c-row c-row--hasAddon">
          <Input
            type={props.passwordType}
            handleChange={props.handlePasswordChange}
            value={props.passwordValue}
            placeholder="Enter Password"
          />
          <InputAddon
            type="toggler"
            icon={icon}
            clickHandler={props.handlePasswordTogglerClick}
          />
        </div>
        <div className="c-login__button">
          <button type="submit" className="c-btn c-btn--primary">
            Login
          </button>
        </div>
      </div>
    </form>
  );
};

export default Login;
