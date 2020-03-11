import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { cancelRequest } from "./reducers/requestReducer";
import { initBlogs } from "./reducers/blogReducer";
import Home from "./components/Home";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

const App = ({ initBlogs }) => {
  useEffect(() => {
    initBlogs();
    return () => {
      cancelRequest("initBlogs");
    };
  }, [initBlogs]);

  return (
    <Router>
      <Switch>
        <PrivateRoute component={Home} path="/" exact />
        <PublicRoute component={Login} restricted={true} />
      </Switch>
    </Router>
  );
};

const mapStateToProps = (state) => {
  const isAuth = state.auth.isAuth;

  return { isAuth };
};

App.propTypes = {
  initBlogs: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { initBlogs })(App);
