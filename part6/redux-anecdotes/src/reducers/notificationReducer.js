import { uid } from "react-uid";

export const initialState = [
  { id: uid({}), message: "Jumping and Playing in the Hay" },
];

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "NEW_NOTIFICATION":
      return state.concat(action.data);
    case "REMOVE_NOTIFICATION":
      const id = action.id;
      return state.filter((notification) => notification.id !== id);
    default:
      return state;
  }
};

export default notificationReducer;
