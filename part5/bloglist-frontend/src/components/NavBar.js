import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const NavBar = ({
  nameOfLoggedInUser,
  brandTitle,
  isLoading,
  handleLogout
}) => {
  const spinnerClass = `c-navbar__spinner ${isLoading ? "" : "isHidden"}`;

  return (
    <div className="c-navbar">
      <div className="c-navbar__content">
        <span className="c-navbar__brand">{brandTitle}</span>
        <div className="c-navbar__actions">
          <div className="c-navbar__userinfo">
            <FontAwesomeIcon className="c-navbar__usericon" icon={faUser} />
            {nameOfLoggedInUser}
            <FontAwesomeIcon
              className={spinnerClass}
              icon={faCircleNotch}
              spin
            />
          </div>
          <div className="c-navbar__logout">
            <button
              onClick={handleLogout}
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

export default NavBar;
