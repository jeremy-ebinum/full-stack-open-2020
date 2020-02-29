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

export const newNotification = (message, level) => {
  return {
    type: "NEW_NOTIFICATION",
    data: { id: uid({}), message, level, date: Date.now() },
  };
};

export const removeNotification = (id) => {
  return {
    type: "REMOVE_NOTIFICATION",
    id,
  };
};

/**
 *  Queues a new notification to be removed after the specified timeout
 * @param {string} message
 * @param {number} timeout
 * @param {string=} level - success | info | warning
 *
 * @return {function} thunk
 */
export const displayNotification = (message, timeout, level = "") => {
  return (dispatch) => {
    const action = newNotification(message, level);
    const id = action.data.id;

    dispatch(action);

    setTimeout(() => {
      dispatch(removeNotification(id));
    }, timeout);
  };
};

export default notificationReducer;
