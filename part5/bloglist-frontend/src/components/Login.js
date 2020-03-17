import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getTestIDs } from "../helpers/testHelper";

export const testIDs = getTestIDs();

const Login = ({ username, password, handleSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputType = showPassword ? "text" : "password";
  const passwordTogglerIcon = showPassword ? faEyeSlash : faEye;

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prevState) => !prevState);
  }, []);

  return (
    <form
      className="c-login"
      onSubmit={handleSubmit}
      data-testid={testIDs.Login_form}
    >
      <div className="c-login__header">Login to Application</div>
      <div className="c-login__body">
        <div className="c-row">
          <input
            {...username}
            aria-label="username"
            data-testid={testIDs.Login_username}
          />
        </div>
        <div className="c-row c-row--hasAddon">
          <input
            {...password}
            type={passwordInputType}
            aria-label="password"
            data-testid={testIDs.Login_password}
          />
          <div className="c-input-addon c-input-addon--append">
            <button
              type="button"
              onClick={toggleShowPassword}
              className="c-btn c-btn--noBg c-btn--fitContent"
              data-testid={testIDs.Login_toggleShowPassword}
            >
              <FontAwesomeIcon
                className="c-input-addon__icon"
                icon={passwordTogglerIcon}
              />
            </button>
          </div>
        </div>
        <div className="c-login__button">
          <button
            type="submit"
            className="c-btn c-btn--primary"
            data-testid={testIDs.Login_submitButton}
          >
            Login
          </button>
        </div>
      </div>
    </form>
  );
};

Login.propTypes = {
  username: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.func])
  ).isRequired,
  password: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.func])
  ).isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

const shouldNotUpdate = (prevProps, nextProps) => {
  const sameUsername = prevProps.username.value === nextProps.username.value;
  const samePassword = prevProps.password.value === nextProps.password.value;

  if (sameUsername && samePassword) {
    return true;
  }
  return false;
};
export default React.memo(Login, shouldNotUpdate);
