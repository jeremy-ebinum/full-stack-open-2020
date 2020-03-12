import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ isAuth, ...routeProps }) => {
  return (
    <>
      {!isAuth && (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: routeProps.location },
          }}
        />
      )}

      {isAuth && <Route {...routeProps} />}
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { isAuth } = state.auth;

  return { isAuth, ...ownProps };
};

export default connect(mapStateToProps)(PrivateRoute);
