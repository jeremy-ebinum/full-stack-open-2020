import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const NavBar = props => {
  return (
    <div className="c-navbar">
      <div className="c-navbar__content">
        <span className="c-navbar__brand">{props.brand}</span>
        <div className="c-navbar__actions">
          <div className="c-navbar__userinfo">
            <FontAwesomeIcon className="c-navbar__usericon" icon={faUser} />
            {props.name}
          </div>
          <div className="c-navbar__logout">
            <button
              onClick={props.handleLogout}
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
