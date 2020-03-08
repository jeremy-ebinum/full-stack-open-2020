import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import notificationReducer from "./reducers/notificationReducer";
import requestReducer from "./reducers/requestReducer";
import blogReducer from "./reducers/blogReducer";

const reducer = combineReducers({
  notifications: notificationReducer,
  requests: requestReducer,
  blogs: blogReducer,
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
