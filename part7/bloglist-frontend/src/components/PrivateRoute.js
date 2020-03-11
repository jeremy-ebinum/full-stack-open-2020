import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, isAuth, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const { isAuth } = state.auth;

  return { isAuth, ...ownProps };
};

export default connect(mapStateToProps)(PrivateRoute);
