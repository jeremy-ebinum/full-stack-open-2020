import React, { useState, useRef, useCallback } from "react";
import ModalSpinner from "./ModalSpinner";
import { connect } from "react-redux";
import { login } from "../reducers/authReducer";
import PropTypes from "prop-types";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getTestIDs } from "../helpers/testHelper";

export const testIDs = getTestIDs();

const Login = ({ login, isLoggingIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputType = showPassword ? "text" : "password";
  const passwordTogglerIcon = showPassword ? faEyeSlash : faEye;
  const usernameRef = useRef();
  const passwordRef = useRef();

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prevState) => !prevState);
  }, []);

  const handleLogin = useCallback(
    (event) => {
      event.preventDefault();
      const user = {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      };

      login(user);

      usernameRef.current.value = "";
      passwordRef.current.value = "";
    },
    [login]
  );

  return (
    <>
      <form className="c-login" onSubmit={handleLogin}>
        <div className="c-login__header">Login to Application</div>
        <div className="c-login__body">
          <div className="c-row">
            <input
              ref={usernameRef}
              className="c-row__input"
              aria-label="username"
              placeholder="Enter Username"
            />
          </div>
          <div className="c-row c-row--hasAddon">
            <input
              ref={passwordRef}
              className="c-row__input"
              type={passwordInputType}
              aria-label="password"
              placeholder="Enter Password"
            />
            <div className="c-input-addon c-input-addon--append">
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
            </div>
          </div>
          <div className="c-login__button">
            <button type="submit" className="c-btn c-btn--primary">
              Login
            </button>
          </div>
        </div>
      </form>
      {isLoggingIn && <ModalSpinner />}
    </>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const isLoggingIn = state.requests.login.isLoading;

  return { isLoggingIn };
};

export default connect(mapStateToProps, { login })(Login);
