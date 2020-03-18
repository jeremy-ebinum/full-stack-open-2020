import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../reducers/authReducer";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import { getTestIDs } from "../helpers/testHelper";

export const testIDs = getTestIDs();

const NavBar = ({ auth, isLoading, logout }) => {
  let userGreeting;

  return (
    <div className="c-navbar">
      <div className="c-navbar__content">
        <span className="c-navbar__brand">Blog List</span>
        <div className="c-navbar__routes">
          <Link
            to="/"
            className="c-navbar__link"
            data-testid={testIDs.NavBar_blogsLink}
          >
            Blogs
          </Link>
          <Link
            to="/users"
            className="c-navbar__link"
            data-testid={testIDs.NavBar_usersLink}
          >
            Users
          </Link>
        </div>
        <div className="c-navbar__actions">
          <div className="c-navbar__userinfo">
            {auth.isAuth && (
              <>
                <FontAwesomeIcon className="c-navbar__usericon" icon={faUser} />
                {auth.user.name || auth.user.username}
              </>
            )}
            {isLoading && (
              <>
                <FontAwesomeIcon
                  data-testid={testIDs.Navbar_spinner}
                  className="c-navbar__spinner"
                  icon={faCircleNotch}
                  spin
                />
              </>
            )}
          </div>

          {auth.isAuth && (
            <div className="c-navbar__logout">
              <button
                type="button"
                onClick={logout}
                className="c-btn c-btn--light-outline"
                data-testid={testIDs.NavBar_logoutBtn}
              >
                Logout
              </button>
            </div>
          )}
          {!auth.isAuth && (
            <div className="c-navbar__login">
              <Link
                to="/login"
                className="c-btn c-btn--flex c-btn--light-outline"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

NavBar.propTypes = {
  auth: PropTypes.objectOf(PropTypes.any).isRequired,
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
