import deepFreeze from "deep-freeze";
import anecdoteReducer, { initialState, getId } from "./anecdoteReducer";

describe("anecdoteReducer()", () => {
  test("returns it's initial state when initialized with an undefined state", () => {
    const action = {
      type: "DO_NOTHING",
    };

    const newState = anecdoteReducer(undefined, action);
    expect(newState).toEqual(initialState);
  });

  test("VOTE purely increments votes of the given anecdote", () => {
    const action = {
      type: "VOTE",
      id: initialState[0].id,
    };
    const state = initialState;

    deepFreeze(state);
    const newState = anecdoteReducer(state, action);
    expect(newState).toContainEqual({
      ...initialState[0],
      votes: initialState[0].votes + 1,
    });
  });

  test("NEW_ANECDOTE purely adds a new anecdote", () => {
    const newAnecdote = { content: "SPAM AND EGGS", id: getId(), votes: 0 };

    const action = {
      type: "NEW_ANECDOTE",
      data: newAnecdote,
    };
    const state = initialState;

    deepFreeze(state);
    const newState = anecdoteReducer(state, action);
    expect(newState).toContainEqual(newAnecdote);
  });
});
