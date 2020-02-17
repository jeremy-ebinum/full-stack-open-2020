import axios from "axios";
const baseUrl = "/api/blogs";

// eslint-disable-next-line no-unused-vars
let token = null;

const setToken = newToken => {
  if (newToken) {
    token = `Bearer ${newToken}`;
  } else {
    token = null;
  }
};

const getAll = async () => {
  const response = await axios.get(baseUrl);

  return response.data;
};

export default { getAll, setToken };
