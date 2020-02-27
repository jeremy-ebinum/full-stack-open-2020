import { uid } from "react-uid";
import deepFreeze from "deep-freeze";
import notificationReducer, { initialState } from "./notificationReducer";

describe("notificationReducer()", () => {
  test("returns it's initial state when initialized with an undefined state", () => {
    const action = {
      type: "DO_NOTHING",
    };

    const newState = notificationReducer(undefined, action);
    expect(newState).toEqual(initialState);
  });

  test("NEW_NOTIFICATION adds a new notification", () => {
    const newNotification = { id: uid({}), message: "Test Message" };

    const action = {
      type: "NEW_NOTIFICATION",
      data: newNotification,
    };

    const state = initialState;
    deepFreeze(state);

    const newState = notificationReducer(state, action);
    expect(newState).toContainEqual(newNotification);
  });

  test("REMOVE_NOTIFICATION removes notification with id", () => {
    const existingNotification = { id: uid({}), message: "Existing Message" };
    const state = initialState.concat(existingNotification);

    const action = {
      type: "REMOVE_NOTIFICATION",
      id: existingNotification.id,
    };

    deepFreeze(state);
    const newState = notificationReducer(state, action);
    expect(newState).not.toContainEqual(existingNotification);
  });
});
