import { push } from "connected-react-router";
import loginService from "../services/login";
import blogsService from "../services/blogs";
import {
  displayNotification,
  displayApiErrorNotifications,
} from "./notificationReducer";
import { setRequestState } from "./requestReducer";
import { logger } from "../utils";

const generateInitialState = () => {
  const storedUser = localStorage.getItem("authBloglistUser");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    blogsService.setToken(user.token);
    return { user, isAuth: true };
  } else {
    return { user: null, isAuth: false };
  }
};

const authReducer = (state = generateInitialState(), action) => {
  switch (action.type) {
    case "SET_USER":
      return { user: action.user, isAuth: true };
    case "CLEAR_USER":
      return { user: null, isAuth: false };
    default:
      return state;
  }
};

export const login = (user, redirectPath) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setRequestState("login", "LOADING"));
      const authUser = await loginService.login(user);
      dispatch(setRequestState("login", "SUCCESS"));
      blogsService.setToken(authUser.token);
      dispatch({ type: "SET_USER", user: authUser });
      localStorage.setItem("authBloglistUser", JSON.stringify(authUser));
      const loginMessage = `Logged in as ${authUser.username}`;
      dispatch(displayNotification(loginMessage, "info"));
      dispatch(push(redirectPath));
    } catch (e) {
      if (e.response) {
        dispatch(setRequestState("login", "FAILURE"));
        dispatch(displayApiErrorNotifications(e));
      } else {
        logger.error(e);
      }
    }
  };
};

export const logout = () => {
  return (dispatch) => {
    blogsService.setToken(null);
    localStorage.removeItem("authBloglistUser");
    dispatch({ type: "CLEAR_USER" });
    dispatch(displayNotification("Logged out", "info"));
    dispatch(push("/login"));
  };
};

export default authReducer;
