import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import NotificationList from "./NotificationList";
import ModalSpinner from "./ModalSpinner";
import { connect } from "react-redux";
import { login } from "../reducers/authReducer";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons/faEyeSlash";
import { getTestIDs } from "../helpers/testHelper";

export const testIDs = getTestIDs();

const Login = ({ login, isLoggingIn, redirectPath }) => {
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputType = showPassword ? "text" : "password";
  const passwordTogglerIcon = showPassword ? faEyeSlash : faEye;
  const usernameRef = useRef();
  const passwordRef = useRef();

  useLayoutEffect(() => {
    const rootStyle = document.documentElement.style;
    document.title = "Blog List | Login";
    rootStyle.setProperty("--body-bg-color", "var(--primary-color-faded)");
  }, []);

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

      login(user, redirectPath);

      usernameRef.current.value = "";
      passwordRef.current.value = "";
    },
    [login, redirectPath]
  );

  return (
    <div className="o-wrapper js-wrapper">
      <div className="o-container js-container">
        <NotificationList contextClass="inLogin" />

        <form
          className="c-login"
          onSubmit={handleLogin}
          data-testid={testIDs.Login_form}
        >
          <div className="c-login__header">Login to Application</div>
          <div className="c-login__body">
            <div className="c-row">
              <input
                ref={usernameRef}
                className="c-row__input"
                aria-label="username"
                placeholder="Enter Username"
                data-testid={testIDs.Login_username}
              />
            </div>
            <div className="c-row hasAddon">
              <input
                ref={passwordRef}
                className="c-row__input"
                type={passwordInputType}
                aria-label="password"
                placeholder="Enter Password"
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
      </div>
      {isLoggingIn && <ModalSpinner />}
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isLoggingIn: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const isLoggingIn = state.requests.login.isLoading;
  const { state: locationState } = state.router.location;
  let redirectPath;

  if (locationState && locationState.from) {
    redirectPath = locationState.from.pathname;
  } else {
    redirectPath = "/";
  }

  return { isLoggingIn, redirectPath };
};

export default connect(mapStateToProps, { login })(Login);
