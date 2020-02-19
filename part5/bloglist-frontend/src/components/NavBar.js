import React, { useContext } from "react";
import UserContext from "../UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const NavBar = ({ brandTitle, isLoading, handleLogout }) => {
  const user = useContext(UserContext);
  const spinnerClass = `c-navbar__spinner ${isLoading ? "" : "isHidden"}`;

  return (
    <div className="c-navbar">
      <div className="c-navbar__content">
        <span className="c-navbar__brand">{brandTitle}</span>
        <div className="c-navbar__actions">
          <div className="c-navbar__userinfo">
            <FontAwesomeIcon className="c-navbar__usericon" icon={faUser} />
            {user.name}
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
