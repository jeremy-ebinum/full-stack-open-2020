import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async (cancelToken) => {
  try {
    const response = await axios.get(baseUrl, { cancelToken });
    return response.data;
  } catch (e) {
    if (axios.isCancel(e)) {
      console.log("Request Cancelled:", e.message);
    } else {
      console.error(e);
    }
  }
};

const create = async (content, cancelToken) => {
  try {
    const newAnecdote = { content, votes: 0 };
    const response = await axios.post(baseUrl, newAnecdote, { cancelToken });
    return response.data;
  } catch (e) {
    if (axios.isCancel(e)) {
      console.log("Request Cancelled:", e.message);
    } else {
      console.error(e);
    }
  }
};

export default { create, getAll };
