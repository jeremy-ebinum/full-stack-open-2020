/* istanbul ignore file */
import axios from "axios";

export const getTrimmedStr = (str) => {
  return str.length > 50 ? str.slice(0, 49) + "..." : str;
};

export const getCancelTokenSource = () => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  return source;
};

export const logger = {
  info: function(...params) {
    if (process.env.NODE_ENV !== "test") {
      console.log(...params);
    }
  },

  error: function(...params) {
    console.error(...params);
  },

  test: function(...params) {
    if (process.env.NODE_ENV === "test") {
      console.log(...params);
    }
  },
};
