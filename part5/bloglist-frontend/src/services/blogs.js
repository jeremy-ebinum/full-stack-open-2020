import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = newToken => {
  if (newToken) {
    token = `Bearer ${newToken}`;
  } else {
    token = null;
  }
};

const create = async newBlog => {
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

export default { setToken, create, getAll, update };
