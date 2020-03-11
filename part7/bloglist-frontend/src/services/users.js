import axios from "axios";

const baseUrl = "/api/users";

const getAll = async (cancelToken) => {
  const response = await axios.get(baseUrl, { cancelToken });

  return response.data;
};

export default { getAll };
