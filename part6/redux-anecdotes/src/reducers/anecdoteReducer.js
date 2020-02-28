export const initialState = [];

const reducer = (state = initialState, action) => {
  // console.log("state now: ", state);
  // console.log("action", action);

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

export const initializeAnecdotes = (data) => {
  return {
    type: "INIT_ANECDOTES",
    data,
  };
};

export const createAnecdote = (data) => {
  return {
    type: "NEW_ANECDOTE",
    data,
  };
};

export const voteFor = (id) => ({ type: "VOTE", id });

export default reducer;
