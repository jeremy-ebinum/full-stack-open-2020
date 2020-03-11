import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import notificationReducer from "./notificationReducer";
import requestReducer from "./requestReducer";
import blogReducer from "./blogReducer";
import authReducer from "./authReducer";
import userReducer from "./userReducer";

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    notifications: notificationReducer,
    requests: requestReducer,
    blogs: blogReducer,
    users: userReducer,
    auth: authReducer,
  });

export default createRootReducer;
