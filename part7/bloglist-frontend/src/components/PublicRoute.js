import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ isAuth, restricted, ...routeProps }) => {
  return (
    <>
      {isAuth && restricted ? <Redirect to="/" /> : <Route {...routeProps} />}
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { isAuth } = state.auth;

  return { isAuth, ...ownProps };
};

export default connect(mapStateToProps)(PublicRoute);
