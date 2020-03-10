import React from "react";
import { connect } from "react-redux";
import { logout } from "../reducers/authReducer";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { getTestIDs } from "../helpers/testHelper";

export const testIDs = getTestIDs();

const NavBar = ({ auth, isLoading, logout }) => {
  let userGreeting;

  if (auth.isAuth) {
    userGreeting = auth.user.name || auth.user.username;
  } else {
    userGreeting = "";
  }

  return (
    <div className="c-navbar">
      <div className="c-navbar__content">
        <span className="c-navbar__brand">Blog List</span>
        <div className="c-navbar__actions">
          <div className="c-navbar__userinfo">
            <FontAwesomeIcon className="c-navbar__usericon" icon={faUser} />
            {userGreeting}
            {isLoading && (
              <>
                <FontAwesomeIcon
                  data-testid={testIDs.spinnerIcon}
                  className="c-navbar__spinner"
                  icon={faCircleNotch}
                  spin
                />
              </>
            )}
          </div>
          <div className="c-navbar__logout">
            <button
              type="button"
              onClick={logout}
              className="c-btn c-btn--light-outline"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

NavBar.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { auth, requests } = state;

  const loadingStates = Object.entries(requests).map((entry) => {
    return { ...entry[1], requestName: entry[0] };
  });

  const isLoading = loadingStates.some((l) => l.isLoading);

  return { auth, isLoading };
};

export default connect(mapStateToProps, { logout })(NavBar);
