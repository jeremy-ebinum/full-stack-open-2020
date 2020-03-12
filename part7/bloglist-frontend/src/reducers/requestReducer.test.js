import deepFreeze from "deep-freeze";
import requestReducer, { initialState, newStates } from "./requestReducer";

describe("requestReducer()", () => {
  test("returns it's initial state when initialized with an undefined state", () => {
    const action = { type: null };

    const newState = requestReducer(undefined, action);
    expect(newState).toEqual(initialState);
  });

  test("LOADING action returns the correct state for pending requests", () => {
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

  describe("SUCCESS action", () => {
    test("returns the correct state for init requests", () => {
      const action = {
        type: "SUCCESS",
        request: "initBlogs",
      };

      const state = initialState;
      deepFreeze(state);

      const newState = requestReducer(state, action);
      expect(newState.initBlogs).toEqual({
        ...initialState.initBlogs,
        ...newStates.initSuccess,
      });

      expect(Object.keys(newState).length).toBe(
        Object.keys(initialState).length
      );
    });

    test("returns the correct state for other requests", () => {
      const action = {
        type: "SUCCESS",
        request: "createBlog",
      };

      const state = initialState;
      deepFreeze(state);

      const newState = requestReducer(state, action);
      expect(newState.createBlog).toEqual({
        ...initialState.createBlog,
        ...newStates.success,
      });

      expect(Object.keys(newState).length).toBe(
        Object.keys(initialState).length
      );
    });
  });

  describe("FAILURE action", () => {
    test("returns the correct state for init requests", () => {
      const action = {
        type: "FAILURE",
        request: "initUsers",
      };

      const state = initialState;
      deepFreeze(state);

      const newState = requestReducer(state, action);
      expect(newState.initUsers).toEqual({
        ...initialState.initUsers,
        ...newStates.initFailure,
      });

      expect(Object.keys(newState).length).toBe(
        Object.keys(initialState).length
      );
    });

    test("returns the correct state for other requests", () => {
      const action = {
        type: "FAILURE",
        request: "likeBlog",
      };

      const state = initialState;
      deepFreeze(state);

      const newState = requestReducer(state, action);
      expect(newState.likeBlog).toEqual({
        ...initialState.likeBlog,
        ...newStates.failure,
      });

      expect(Object.keys(newState).length).toBe(
        Object.keys(initialState).length
      );
    });
  });
});
