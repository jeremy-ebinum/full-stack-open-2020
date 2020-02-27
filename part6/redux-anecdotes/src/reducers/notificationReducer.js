import { uid } from "react-uid";

export const initialState = [];

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

export const newNotification = (className, message) => {
  return {
    type: "NEW_NOTIFICATION",
    data: { id: uid({}), className, message },
  };
};

export const removeNotification = (id) => {
  return {
    type: "REMOVE_NOTIFICATION",
    id,
  };
};

export const queueNotification = (store, className, message) => {
  const action = newNotification(className, message);
  const id = action.data.id;

  store.dispatch(action);

  setTimeout(() => {
    store.dispatch(removeNotification(id));
  }, 5000);
};

export default notificationReducer;
