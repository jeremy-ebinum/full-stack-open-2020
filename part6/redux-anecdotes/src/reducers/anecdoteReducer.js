import { getTrimmedStr } from "../helpers/helper";
import anecdotesService from "../services/anecdotes";
import { setRequestState } from "./requestReducer";
import { displayNotification } from "./notificationReducer";

export const initialState = [];

const anecdoteReducer = (state = initialState, action) => {
  switch (action.type) {
    case "INIT_ANECDOTES":
      return action.data || state;
    case "NEW_ANECDOTE":
      return state.concat(action.data);
    case "UPDATE_ANECDOTE":
      const id = action.data.id;
      return state.map((a) => (a.id === id ? action.data : a));
    default:
      return state;
  }
};

export const initAnecdotes = () => {
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
    return displayNotification("Content is too short", 3000, "warning");
  }
  return async (dispatch) => {
    try {
      dispatch(setRequestState("createAnecdote", "LOADING"));
      const newAnecdote = await anecdotesService.create(content);
      dispatch({ type: "NEW_ANECDOTE", data: newAnecdote });
      dispatch(setRequestState("createAnecdote", "SUCCESS"));
      const message = `You added "${getTrimmedStr(content)}"`;
      dispatch(displayNotification(message, 5000, "success"));
    } catch (error) {
      dispatch(setRequestState("createAnecdote", "FAILURE"));
    }
  };
};

export const voteForAnecdote = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setRequestState("voteForAnecdote", "LOADING"));
      const anecdoteToChange = getState().anecdotes.find((a) => a.id === id);
      const votedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      };
      const updatedAnecdote = await anecdotesService.update(id, votedAnecdote);
      dispatch(setRequestState("voteForAnecdote", "SUCCESS"));
      dispatch({ type: "UPDATE_ANECDOTE", data: updatedAnecdote });
      const contentToShow = getTrimmedStr(updatedAnecdote.content);
      const message = `You voted for "${contentToShow}"`;
      dispatch(displayNotification(message, 2000, "info"));
    } catch (e) {
      dispatch(setRequestState("voteForAnecdote", "FAILURE"));
    }
  };
};

export default anecdoteReducer;
