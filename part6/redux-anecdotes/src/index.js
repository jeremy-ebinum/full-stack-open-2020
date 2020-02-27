import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers } from "redux";
import App from "./App";
import anecdoteReducer from "./reducers/anecdoteReducer";
import notificationReducer from "./reducers/notificationReducer";

const reducer = combineReducers({
  anecdotes: anecdoteReducer,
  notifications: notificationReducer,
});

const store = createStore(reducer);

const render = () => {
  ReactDOM.render(<App store={store} />, document.getElementById("root"));
};

render();
store.subscribe(render);
