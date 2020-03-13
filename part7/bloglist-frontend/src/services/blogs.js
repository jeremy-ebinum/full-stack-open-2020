import axios from "axios";

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

const getAll = async (cancelToken) => {
  const response = await axios.get(baseUrl, { cancelToken });

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

const comment = async (id, comment) => {
  const config = {
    headers: { Authorization: token, "Content-Type": "text/plain" },
  };
  const response = await axios.post(
    `${baseUrl}/${id}/comments`,
    comment,
    config
  );

  return response.data;
};

export default { setToken, create, getAll, update, remove, comment };
