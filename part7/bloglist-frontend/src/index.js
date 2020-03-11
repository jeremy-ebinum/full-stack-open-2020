/* istanbul ignore file */
import React from "react";
import ReactDOM from "react-dom";
import configureStore, { history } from "./configureStore";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";

if (process.env.NODE_ENV === "development") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React);
}

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById("root")
);
