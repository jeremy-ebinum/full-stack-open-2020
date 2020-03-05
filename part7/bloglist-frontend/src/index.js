/* istanbul ignore file */
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

if (process.env.NODE_ENV === "development") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React);
}

ReactDOM.render(<App />, document.getElementById("root"));
