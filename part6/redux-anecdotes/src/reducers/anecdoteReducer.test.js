import deepFreeze from "deep-freeze";
import { uid } from "react-uid";
import anecdoteReducer, { initialState } from "./anecdoteReducer";

const anecdotes = [
  {
    content: "If it hurts, do it more often",
    id: "47145",
    votes: 0,
  },
  {
    content: "Adding manpower to a late software project makes it later!",
    id: "21149",
    votes: 0,
  },
];

describe("anecdoteReducer()", () => {
  test("returns it's initial state when initialized with an undefined state", () => {
    const action = {
      type: "DO_NOTHING",
    };

    const newState = anecdoteReducer(undefined, action);
    expect(newState).toEqual(initialState);
  });

  test("INIT_ANECDOTES replaces state with action payload", () => {
    const state = initialState;
    const action = {
      type: "INIT_ANECDOTES",
      data: anecdotes,
    };
    deepFreeze(state);

    const newState = anecdoteReducer(state, action);
    expect(newState).toEqual(anecdotes);
  });

  test("NEW_ANECDOTE purely adds a new anecdote", () => {
    const newAnecdote = { content: "SPAM AND EGGS", id: uid({}), votes: 0 };

    const action = {
      type: "NEW_ANECDOTE",
      data: newAnecdote,
    };
    const state = initialState;

    deepFreeze(state);
    const newState = anecdoteReducer(state, action);
    expect(newState).toContainEqual(newAnecdote);
  });

  test("UPDATE_ANECDOTE updates the state of the given anecdote", () => {
    const state = anecdotes;

    const changedAnecdote = { ...anecdotes[0], votes: anecdotes[0].votes + 1 };

    const action = {
      type: "UPDATE_ANECDOTE",
      data: changedAnecdote,
    };

    deepFreeze(state);
    const newState = anecdoteReducer(state, action);
    expect(newState).toContainEqual({
      ...anecdotes[0],
      votes: anecdotes[0].votes + 1,
    });
  });
});
