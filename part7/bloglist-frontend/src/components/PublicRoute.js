import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ component: Component, isAuth, restricted, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth && restricted ? (
          <Redirect to="/" exact />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const { isAuth } = state.auth;

  return { isAuth, ...ownProps };
};

export default connect(mapStateToProps)(PublicRoute);
