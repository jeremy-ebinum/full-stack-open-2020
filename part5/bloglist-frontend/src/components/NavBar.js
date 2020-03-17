import React, { useContext } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { getTestIDs } from "../helpers/testHelper";
import UserContext from "../UserContext";

export const testIDs = getTestIDs();

const NavBar = ({ brandTitle, isLoading, handleLogout }) => {
  const user = useContext(UserContext);

  return (
    <div className="c-navbar">
      <div className="c-navbar__content">
        <span className="c-navbar__brand">{brandTitle}</span>
        <div className="c-navbar__actions">
          <div className="c-navbar__userinfo">
            <FontAwesomeIcon className="c-navbar__usericon" icon={faUser} />
            {user.name}
            {isLoading && (
              <FontAwesomeIcon
                data-testid={testIDs.NavBar_spinner}
                className="c-navbar__spinner"
                icon={faCircleNotch}
                spin
              />
            )}
          </div>
          <div className="c-navbar__logout">
            <button
              type="button"
              onClick={handleLogout}
              className="c-btn c-btn--light-outline"
              data-testid={testIDs.NavBar_logoutBtn}
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
  brandTitle: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default React.memo(NavBar);
