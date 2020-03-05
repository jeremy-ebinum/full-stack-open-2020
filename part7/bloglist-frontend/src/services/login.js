import axios from "axios";
import testHelper from "../helpers/testHelper";

if (process.env.NODE_ENV === "test") {
  axios.defaults.adapter = require("axios/lib/adapters/http");
  axios.defaults.baseURL = testHelper.host;
}

const baseUrl = "/api/login";

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);

  return response.data;
};

export default { login };
