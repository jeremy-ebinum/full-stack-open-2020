import axios from "axios";
import { push } from "connected-react-router";
import blogsService from "../services/blogs";
import {
  displayNotification,
  displayApiErrorNotifications,
} from "./notificationReducer";
import { setRequestState } from "./requestReducer";
import { logger, getTrimmedStr } from "../utils";

export const initialState = [];

const blogReducer = (state = initialState, action) => {
  switch (action.type) {
    case "INIT_BLOGS":
      if (action.data && !Array.isArray(action.data)) {
        throw new Error("Blogs should be passed as an array");
      }
      return action.data;
    case "NEW_BLOG":
      return state.concat(action.data);
    case "LIKE_BLOG":
      const blogToLike = state.find((blog) => blog.id === action.id);
      const likedBlog = { ...blogToLike, likes: blogToLike.likes + 1 };
      return state.map((blog) => (blog.id === action.id ? likedBlog : blog));
    case "DELETE_BLOG":
      return state.filter((blog) => blog.id !== action.id);
    case "UPDATE_BLOG_COMMENTS":
      const blogToComment = state.find((blog) => blog.id === action.id);
      const commentedBlog = { ...blogToComment, comments: action.comments };
      return state.map((blog) =>
        blog.id === action.id ? commentedBlog : blog
      );
    default:
      return state;
  }
};

export const initBlogs = () => {
  return async (dispatch, getState) => {
    try {
      const source = await getState().requests.initBlogs.source;
      dispatch(setRequestState("initBlogs", "LOADING"));
      const blogs = await blogsService.getAll(source.token);

      dispatch(setRequestState("initBlogs", "SUCCESS"));
      dispatch({ type: "INIT_BLOGS", data: blogs });
    } catch (e) {
      if (!axios.isCancel(e)) {
        logger.error(e);
        dispatch(setRequestState("initBlogs", "FAILURE"));
        dispatch(displayNotification("Oops! Something went wrong", "error"));
      }
    }
  };
};

export const createBlog = (newBlog, cb) => {
  return async (dispatch) => {
    try {
      dispatch(setRequestState("createBlog", "LOADING"));
      const createdBlog = await blogsService.create(newBlog);
      dispatch(setRequestState("createBlog", "SUCCESS"));
      dispatch({ type: "NEW_BLOG", data: createdBlog });
      cb();
      const titleToShow = getTrimmedStr(createdBlog.title);
      const message = `Added "${titleToShow}" by ${createdBlog.author ||
        "Unknown Author"}`;
      dispatch(displayNotification(message, "success", 5000));
    } catch (e) {
      if (e.response) {
        dispatch(setRequestState("createBlog", "FAILURE"));
        dispatch(displayApiErrorNotifications(e));
      } else {
        logger.error(e);
      }
    }
  };
};

export const likeBlog = (id) => {
  return async (dispatch, getState) => {
    const { blogs } = getState();
    const blogToLike = blogs.find((blog) => blog.id === id);

    if (!blogToLike) {
      dispatch(displayNotification("Blog Does Not Exist", "error"));
    } else {
      const likedBlog = {
        ...blogToLike,
        likes: blogToLike.likes + 1,
        user: blogToLike.user.id,
      };

      try {
        dispatch(setRequestState("likeBlog", "LOADING"));
        await blogsService.update(id, likedBlog);
        dispatch(setRequestState("likeBlog", "SUCCESS"));
        dispatch({ type: "LIKE_BLOG", id });
      } catch (e) {
        if (e.response) {
          dispatch(setRequestState("deleteBlog", "FAILURE"));
          dispatch(displayApiErrorNotifications(e));
        } else {
          logger.error(e);
        }
      }
    }
  };
};

export const deleteBlog = (id) => {
  return async (dispatch, getState) => {
    const { blogs } = getState();
    const blogToDelete = blogs.find((blog) => blog.id === id);

    if (!blogToDelete) {
      return dispatch(displayNotification("Blog Does Not Exist", "error"));
    }
    const titleToShow = getTrimmedStr(blogToDelete.title);
    const willDelete = window.confirm(`Delete "${titleToShow}"?`);

    if (!willDelete) return;

    try {
      dispatch(setRequestState("deleteBlog", "LOADING"));
      await blogsService.remove(id);
      dispatch(setRequestState("deleteBlog", "SUCCESS"));
      dispatch({ type: "DELETE_BLOG", id });
      dispatch(displayNotification(`Deleted Blog: "${titleToShow}"`, "info"));
      dispatch(push("/"));
    } catch (e) {
      if (e.response) {
        dispatch(setRequestState("deleteBlog", "FAILURE"));
        dispatch(displayApiErrorNotifications(e));
      } else {
        logger.error(e);
      }
    }
  };
};

export const commentBlog = (id, comment) => {
  return async (dispatch) => {
    try {
      dispatch(setRequestState("commentBlog", "LOADING"));
      const commentedBlog = await blogsService.comment(id, comment);
      const { comments } = commentedBlog;
      dispatch({ type: "UPDATE_BLOG_COMMENTS", id, comments });
      dispatch(setRequestState("commentBlog", "SUCCESS"));
    } catch (e) {
      if (e.response) {
        dispatch(setRequestState("commentBlog", "FAILURE"));
        dispatch(displayApiErrorNotifications(e));
      } else {
        logger.error(e);
      }
    }
  };
};

export default blogReducer;
