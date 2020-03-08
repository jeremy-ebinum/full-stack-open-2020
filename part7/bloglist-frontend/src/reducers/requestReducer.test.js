import deepFreeze from "deep-freeze";
import requestReducer, { initialState, newStates } from "./requestReducer";

describe("requestReducer()", () => {
  test("returns it's initial state when initialized with an undefined state", () => {
    const action = { type: null };

    const newState = requestReducer(undefined, action);
    expect(newState).toEqual(initialState);
  });

  test("LOADING sets the state for pending requests", () => {
    const action = {
      type: "LOADING",
      request: "initBlogs",
    };

    const state = initialState;
    deepFreeze(state);

    const newState = requestReducer(state, action);
    expect(newState.initBlogs).toEqual({
      ...initialState.initBlogs,
      ...newStates.loading,
    });

    expect(Object.keys(newState).length).toBe(Object.keys(initialState).length);
  });

  test("SUCCESS sets the state for successful requests", () => {
    const action = {
      type: "LOADING",
      request: "initBlogs",
    };

    const state = initialState;
    deepFreeze(state);

    const newState = requestReducer(state, action);
    expect(newState.initBlogs).toEqual({
      ...initialState.initBlogs,
      ...newStates.loading,
    });

    expect(Object.keys(newState).length).toBe(Object.keys(initialState).length);
  });

  test("FAILURE sets the state for failed requests", () => {
    const action = {
      type: "FAILURE",
      request: "initBlogs",
    };

    const state = initialState;
    deepFreeze(state);

    const newState = requestReducer(state, action);
    expect(newState.initBlogs).toEqual({
      ...initialState.initBlogs,
      ...newStates.failure,
    });

    expect(Object.keys(newState).length).toBe(Object.keys(initialState).length);
  });
});
