import { getCancelTokenSource } from "../helpers/helper";

const requestStates = { isLoading: false, isCancelled: false, isError: false };

const loading = { isLoading: true, isCancelled: false, isError: false };
const success = { isLoading: false, isCancelled: false, isError: false };
const cancelled = { isLoading: false, isCancelled: true, isError: false };
const failure = { isLoading: false, isCancelled: false, isError: true };

export const newStates = { loading, success, cancelled, failure };

export const initialState = {
  initAnecdotes: {
    ...requestStates,
    source: getCancelTokenSource(),
  },
  createAnecdote: {
    ...requestStates,
    source: getCancelTokenSource(),
  },
  voteForAnecdote: {
    ...requestStates,
    source: getCancelTokenSource(),
  },
};

const requestNames = Object.keys(initialState);

const requestReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        [action.request]: { ...state[action.request], ...loading },
      };
    case "SUCCESS":
      return {
        ...state,
        [action.request]: { ...state[action.request], ...success },
      };
    case "CANCELLED":
      return {
        ...state,
        [action.request]: { ...state[action.request], ...cancelled },
      };
    case "FAILURE":
      return {
        ...state,
        [action.request]: { ...state[action.request], ...failure },
      };
    default:
      return state;
  }
};

/**
 * Sets the state of an api request
 *
 * @param {string} request - initAnecdotes | createAnecdote | voteForAnecdote
 * @param {*} state - LOADING | SUCCESS | CANCELLED | FAILURE
 * @throws Will throw error if request or state isn't one of the specified
 *
 * @return {function} thunk
 */
export const setRequestState = (request, state) => {
  if (!requestNames.includes(request)) throw new Error("Invalid Request Name");
  const validStates = /LOADING|SUCCESS|CANCELLED|FAILURE/i;
  if (!validStates.test(state)) throw new Error("Invalid Request State");

  return (dispatch) => {
    dispatch({ type: state.toUpperCase(), request: request });
  };
};

export default requestReducer;
