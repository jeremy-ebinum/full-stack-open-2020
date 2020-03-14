import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { connect } from "react-redux";
import { cancelRequest } from "./reducers/requestReducer";
import { initBlogs } from "./reducers/blogReducer";
import { initUsers } from "./reducers/userReducer";
import Home from "./components/Home";
import Login from "./components/Login";
import Users from "./components/Users";
import User from "./components/User";
import Blog from "./components/Blog";
import NotFoundPage from "./components/NotFoundPage";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

const App = ({ initBlogs, initUsers, history }) => {
  useEffect(() => {
    initBlogs();
    initUsers();
    return () => {
      cancelRequest("initBlogs");
      cancelRequest("initUsers");
    };
  }, [initBlogs, initUsers]);

  return (
    <ConnectedRouter history={history}>
      <Switch>
        <PrivateRoute path="/" exact component={Home} />
        <PublicRoute restricted path="/login" exact component={Login} />
        <PrivateRoute path="/users" exact component={Users} />
        <PrivateRoute path="/users/:id" component={User} />
        <PrivateRoute path="/blogs/:id" component={Blog} />
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </ConnectedRouter>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { history } = ownProps;

  return { history };
};

App.propTypes = {
  initBlogs: PropTypes.func.isRequired,
  initUsers: PropTypes.func.isRequired,
  history: PropTypes.object,
};

export default connect(mapStateToProps, { initBlogs, initUsers })(App);
