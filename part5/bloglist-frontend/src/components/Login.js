import React, { useState } from "react";
import PropTypes from "prop-types";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "./Input";
import InputAddon from "./InputAddon";

const Login = ({ values, handleChange, handleSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form className="c-login" onSubmit={handleSubmit}>
      <div className="c-login__header">Login to Application</div>
      <div className="c-login__body">
        <div className="c-row">
          <Input
            name="username"
            handleChange={handleChange}
            value={values.username}
            placeholder="Enter Username"
          />
        </div>
        <div className="c-row c-row--hasAddon">
          <Input
            name="password"
            type={`${showPassword ? "text" : "password"}`}
            handleChange={handleChange}
            value={values.password}
            placeholder="Enter Password"
          />
          <InputAddon type="append">
            <button
              type="button"
              onClick={toggleShowPassword}
              className="c-btn c-btn--noBg c-btn--fitContent"
            >
              <FontAwesomeIcon
                className="c-input-addon__icon"
                icon={showPassword ? faEyeSlash : faEye}
              />
            </button>
          </InputAddon>
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

Login.propTypes = {
  values: PropTypes.objectOf(PropTypes.string).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default Login;
