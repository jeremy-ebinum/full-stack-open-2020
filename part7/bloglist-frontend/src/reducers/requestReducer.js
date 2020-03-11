import { getCancelTokenSource } from "../utils";

const requestStates = { isLoading: false, isError: false };

const loading = { isLoading: true, isError: false };
const success = { isLoading: false, isError: false };
const failure = { isLoading: false, isError: true };

export const newStates = { loading, success, failure };

export const initialState = {
  initBlogs: {
    ...requestStates,
    source: getCancelTokenSource(),
  },
  initUsers: {
    ...requestStates,
    source: getCancelTokenSource(),
  },
  createBlog: {
    ...requestStates,
  },
  likeBlog: {
    ...requestStates,
  },
  deleteBlog: {
    ...requestStates,
  },
  login: {
    ...requestStates,
  },
};

const requests = Object.keys(initialState);
const cancellableRequests = Object.entries(initialState).reduce(
  (acc, [k, v]) => {
    if (v.hasOwnProperty("source")) {
      return acc.concat([k]);
    }

    return acc;
  },
  []
);

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
 * Sets the state of an api request using it's name as key
 *
 * @param {string} name - initBlogs | initUsers | createBlog | likeBlog |
 * deleteBlog | login
 * @param {string} state - LOADING | SUCCESS | FAILURE
 * @throws Will throw error if `name` or `state` isn't one of the specified
 *
 * @return {function} thunk
 */
export const setRequestState = (name, state) => {
  if (!requests.includes(name)) throw new Error("Invalid Request Name");
  const validStates = /LOADING|SUCCESS|FAILURE/i;
  if (!validStates.test(state)) throw new Error("Invalid Request State");

  return (dispatch) => {
    dispatch({ type: state.toUpperCase(), request: name });
  };
};

/**
 * Cancels a request in progress using it's name as key
 *
 * @param {string} name - initBlogs | initUsers
 * @throws Will throw error if `name` isn't one of the specified
 *
 * @return {function} thunk
 */
export const cancelRequest = (name) => {
  if (!cancellableRequests.includes(name))
    throw new Error("Invalid Request Name");

  return async (dispatch, getState) => {
    const request = getState().requests[name];
    if (request.isLoading) {
      request.source.cancel();
    }
  };
};

export default requestReducer;
