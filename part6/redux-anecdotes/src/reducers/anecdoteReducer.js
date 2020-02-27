import { uid } from "react-uid";

const anecdotesAtStart = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: uid({}),
    votes: 0,
  };
};

export const initialState = anecdotesAtStart.map(asObject);

const reducer = (state = initialState, action) => {
  // console.log("state now: ", state);
  // console.log("action", action);

  switch (action.type) {
    case "VOTE":
      const id = action.id;
      const anecdoteToChange = state.find((a) => a.id === id);
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      };

      return state.map((a) => (a.id === id ? changedAnecdote : a));

    case "NEW_ANECDOTE":
      return state.concat(action.data);
    default:
      return state;
  }
};

export const createAnecdote = (content) => {
  return {
    type: "NEW_ANECDOTE",
    data: {
      content: content,
      id: uid({}),
      votes: 0,
    },
  };
};

export const voteFor = (id) => ({ type: "VOTE", id });

export default reducer;
