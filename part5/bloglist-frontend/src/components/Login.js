import React, { useState, useCallback } from "react";
import { useUID } from "react-uid";
import PropTypes from "prop-types";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getTestIDs } from "../helpers/testHelper";
import Input from "./Input";
import InputAddon from "./InputAddon";
import { Fragment } from "react";

export const testIDs = getTestIDs();

const Login = ({ values, handleChange, handleSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputType = showPassword ? "text" : "password";
  const passwordTogglerIcon = showPassword ? faEyeSlash : faEye;
  const passwordTogglerKey = useUID();
  const { username, password } = values;

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prevState) => !prevState);
  }, []);

  return (
    <form className="c-login" onSubmit={handleSubmit}>
      <div className="c-login__header">Login to Application</div>
      <div className="c-login__body">
        <div className="c-row">
          <Input
            name="username"
            handleChange={handleChange}
            value={username}
            ariaLabel="username"
            placeholder="Enter Username"
          />
        </div>
        <div className="c-row c-row--hasAddon">
          <Input
            name="password"
            type={passwordInputType}
            handleChange={handleChange}
            value={password}
            ariaLabel="password"
            placeholder="Enter Password"
          />
          <InputAddon type="append">
            <Fragment key={passwordTogglerKey}>
              <button
                type="button"
                onClick={toggleShowPassword}
                className="c-btn c-btn--noBg c-btn--fitContent"
                data-testid={testIDs.toggleShowPassword}
              >
                <FontAwesomeIcon
                  className="c-input-addon__icon"
                  icon={passwordTogglerIcon}
                />
              </button>
            </Fragment>
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

const shouldNotUpdate = (prevProps, nextProps) => {
  const sameUsername = prevProps.values.username === nextProps.values.username;
  const samePassword = prevProps.values.password === nextProps.values.password;

  if (sameUsername && samePassword) {
    return true;
  }
  return false;
};
export default React.memo(Login, shouldNotUpdate);
