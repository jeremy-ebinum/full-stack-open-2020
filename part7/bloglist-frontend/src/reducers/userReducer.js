import axios from "axios";

import usersService from "../services/users";
import { setRequestState } from "./requestReducer";
import { displayNotification } from "./notificationReducer";

import { logger } from "../utils";

export const initialState = [];

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "INIT_USERS":
      if (action.data && !Array.isArray(action.data)) {
        throw new Error("Users should be passed as an array");
      }
      return action.data;
    default:
      return state;
  }
};

export const initUsers = () => {
  return async (dispatch, getState) => {
    try {
      const source = await getState().requests.initUsers.source;
      dispatch(setRequestState("initUsers", "LOADING"));
      const users = await usersService.getAll(source.token);

      dispatch(setRequestState("initUsers", "SUCCESS"));
      dispatch({ type: "INIT_USERS", data: users });
    } catch (e) {
      if (!axios.isCancel(e)) {
        console.log(e.message);
        logger.error(e);
        dispatch(setRequestState("initUsers", "FAILURE"));
        dispatch(displayNotification("Oops! Something went wrong", "error"));
      }
    }
  };
};

export default userReducer;
