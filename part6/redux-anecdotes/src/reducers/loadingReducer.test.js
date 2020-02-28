import deepFreeze from "deep-freeze";
import loadingReducer, { initialState } from "./loadingReducer";

describe("loadingReducer()", () => {
  test("returns it's initial state when initialized with an undefined state", () => {
    const action = { type: null };

    const newState = loadingReducer(undefined, action);
    expect(newState).toEqual(initialState);
  });

  test("SET_INIT_LOADING sets loading for initializing anecdotes", () => {
    const action = {
      type: "SET_INIT_LOADING",
      value: !initialState.isInitLoading,
    };

    const state = initialState;
    deepFreeze(state);

    const newState = loadingReducer(state, action);
    expect(newState.isInitLoading).toBe(!initialState.isInitLoading);
  });

  test("SET_ADD_LOADING sets loading for adding new anecdotes", () => {
    const action = {
      type: "SET_ADD_LOADING",
      value: !initialState.isAddLoading,
    };
    const state = initialState;
    deepFreeze(state);

    const newState = loadingReducer(state, action);
    expect(newState.isAddLoading).toBe(!initialState.isAddLoading);
  });
});
