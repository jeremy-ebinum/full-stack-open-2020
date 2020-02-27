import deepFreeze from "deep-freeze";
import filterReducer, { initialState } from "./filterReducer";

describe("filterReducer", () => {
  test("returns it's initial state when initialized with an undefined state", () => {
    const action = {
      type: "DO_NOTHING",
    };

    const newState = filterReducer(undefined, action);
    expect(newState).toEqual(initialState);
  });

  test("SET_FILTER updates the state of filter", () => {
    const newFilter = "test filter";

    const action = {
      type: "SET_FILTER",
      filter: newFilter,
    };

    const state = initialState;
    deepFreeze(state);

    const newState = filterReducer(state, action);

    expect(newState).toBe(newFilter);
  });

  test("CLEAR_FILTER resets filter to initial state", () => {
    const state = "existing filter";

    const action = {
      type: "CLEAR_FILTER",
    };

    deepFreeze(state);

    const newState = filterReducer(state, action);

    expect(newState).toBe(initialState);
  });
});
