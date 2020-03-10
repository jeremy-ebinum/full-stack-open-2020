import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import notificationReducer from "./reducers/notificationReducer";
import requestReducer from "./reducers/requestReducer";
import blogReducer from "./reducers/blogReducer";
import authReducer from "./reducers/authReducer";

export const reducers = combineReducers({
  notifications: notificationReducer,
  requests: requestReducer,
  blogs: blogReducer,
  auth: authReducer,
});

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
