import { uid } from "react-uid";
import { logger } from "../utils";

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
 * @param {string} message - notification message
 * @param {number} timeout - in ms
 * @param {string=} level - success | info | error
 *
 * @return {function} thunk
 */
export const displayNotification = (
  message,
  level = "default",
  timeout = 3000
) => {
  return (dispatch) => {
    const action = newNotification(message, level);
    const id = action.data.id;

    dispatch(action);

    setTimeout(() => {
      dispatch(removeNotification(id));
    }, timeout);
  };
};

export const displayApiErrorNotifications = (error) => {
  return (dispatch) => {
    const statusCode = error.response.status;

    if (statusCode === 404) {
      dispatch(displayNotification("Blog does not exist", "error"));
    } else if (statusCode >= 400 && statusCode < 500) {
      const errorMessages = error.response.data.messages;
      errorMessages.forEach((m) => {
        dispatch(displayNotification(m, "error"));
      });
    } else {
      logger.error(error);
      dispatch(displayNotification("Oops! something went wrong", "error"));
    }
  };
};

export default notificationReducer;
