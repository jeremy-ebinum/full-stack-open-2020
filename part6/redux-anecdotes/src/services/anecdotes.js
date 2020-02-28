import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async (cancelToken) => {
  const response = await axios.get(baseUrl, { cancelToken });
  return response.data;
};

const create = async (content) => {
  const newAnecdote = { content, votes: 0 };
  const response = await axios.post(baseUrl, newAnecdote);
  return response.data;
};

export default { create, getAll };
