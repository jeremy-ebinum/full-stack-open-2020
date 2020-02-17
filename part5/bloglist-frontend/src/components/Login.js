import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const InputAddon = props => {
  return (
    <div
      role="button"
      onClick={props.handleAddonClick}
      className="c-input-addon c-input-addon--isToggler"
    >
      <FontAwesomeIcon className="c-input-addon__icon" icon={props.icon} />
    </div>
  );
};

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
          <input
            className="c-row__input"
            onChange={props.handleUsernameChange}
            value={props.usernameValue}
            placeholder="Enter Username"
          />
        </div>
        <div className="c-row c-row--hasAddon">
          <input
            type={props.passwordType}
            className="c-row__input"
            onChange={props.handlePasswordChange}
            value={props.passwordValue}
            placeholder="Enter Password"
          />
          <InputAddon
            handleAddonClick={props.handlePasswordTogglerClick}
            icon={icon}
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
