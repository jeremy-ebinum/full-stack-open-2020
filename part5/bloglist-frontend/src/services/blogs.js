import axios from "axios";
import testHelper from "../helpers/testHelper";

if (process.env.NODE_ENV === "test") {
  axios.defaults.adapter = require("axios/lib/adapters/http");
  axios.defaults.baseURL = testHelper.host;
}

const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  if (newToken) {
    token = `Bearer ${newToken}`;
  } else {
    token = null;
  }
};

const create = async (newBlog) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.post(baseUrl, newBlog, config);

  return response.data;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);

  return response.data;
};

const update = async (id, updatedBlog) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, config);

  return response.data;
};

const remove = async (id) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.delete(`${baseUrl}/${id}`, config);

  return response.data;
};

export default { setToken, create, getAll, update, remove };
