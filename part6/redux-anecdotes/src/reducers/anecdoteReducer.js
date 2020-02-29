import { getTrimmedStr } from "../helpers/helper";
import anecdotesService from "../services/anecdotes";
import { setRequestState } from "./requestReducer";
import { queueNotification } from "./notificationReducer";

export const initialState = [];

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "INIT_ANECDOTES":
      return action.data || state;
    case "NEW_ANECDOTE":
      return state.concat(action.data);
    case "VOTE":
      const id = action.id;
      const anecdoteToChange = state.find((a) => a.id === id);
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      };

      return state.map((a) => (a.id === id ? changedAnecdote : a));
    default:
      return state;
  }
};

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    try {
      dispatch(setRequestState("initAnecdotes", "LOADING"));
      const anecdotes = await anecdotesService.getAll();
      dispatch(setRequestState("initAnecdotes", "SUCCESS"));
      dispatch({ type: "INIT_ANECDOTES", data: anecdotes });
    } catch (e) {
      dispatch(setRequestState("initAnecdotes", "FAILURE"));
      console.log(e.message);
    }
  };
};

export const createAnecdote = (content) => {
  if (content.length < 8) {
    return queueNotification("Content is too short", 3000, "warning");
  }
  return async (dispatch) => {
    try {
      dispatch(setRequestState("newAnecdote", "LOADING"));
      const newAnecdote = await anecdotesService.create(content);
      dispatch({ type: "NEW_ANECDOTE", data: newAnecdote });
      dispatch(setRequestState("newAnecdote", "SUCCESS"));
      const message = `You added "${getTrimmedStr(content)}"`;
      dispatch(queueNotification(message, 5000, "success"));
    } catch (error) {
      dispatch(setRequestState("newAnecdote", "FAILURE"));
    }
  };
};

export const voteFor = (id) => {
  return (dispatch) => {
    dispatch({ type: "VOTE", id });
  };
};

export default reducer;
