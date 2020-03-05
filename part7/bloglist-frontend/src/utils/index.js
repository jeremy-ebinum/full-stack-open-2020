import axios from "axios";

export const getTrimmedStr = (str) => {
  return str.length > 50 ? str.slice(0, 49) + "..." : str;
};

export const getCancelTokenSource = () => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  return source;
};
