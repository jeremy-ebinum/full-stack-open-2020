import React, { useContext } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { getTestIDs } from "../helpers/testHelper";
import UserContext from "../UserContext";

export const testIDs = getTestIDs();

const NavBar = ({ isLoading, handleLogout }) => {
  const user = useContext(UserContext);

  return (
    <div className="c-navbar">
      <div className="c-navbar__content">
        <span className="c-navbar__brand">Blog List</span>
        <div className="c-navbar__actions">
          <div className="c-navbar__userinfo">
            <FontAwesomeIcon className="c-navbar__usericon" icon={faUser} />
            {user.name}
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

NavBar.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const loadingStates = Object.entries(state.requests).map((entry) => {
    return { ...entry[1], requestName: entry[0] };
  });

  const isLoading = loadingStates.some((l) => l.isLoading);

  return { isLoading, handleLogout: ownProps.handleLogout };
};

export default connect(mapStateToProps)(NavBar);
