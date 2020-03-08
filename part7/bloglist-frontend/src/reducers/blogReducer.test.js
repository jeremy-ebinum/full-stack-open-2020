import deepFreeze from "deep-freeze";
import testHelper from "../helpers/testHelper";
import blogReducer, { initialState } from "./blogReducer";

if (testHelper.blogs.length < 2) throw new Error("Add more helper blogs");

const blogs = testHelper.blogs.slice(0, testHelper.blogs.length - 2);
const newBlog = testHelper.blogs[testHelper.blogs.length - 1];

describe("blogReducer(state, action) a pure function...", () => {
  test("returns it's initial state when initialized with an undefined state", () => {
    const action = {
      type: null,
    };

    const newState = blogReducer(undefined, action);
    expect(newState).toEqual(initialState);
  });

  test("INIT_BLOGS returns state equal to the blogs in action payload", () => {
    const state = initialState;
    const action = {
      type: "INIT_BLOGS",
      data: blogs,
    };
    deepFreeze(state);

    const newState = blogReducer(state, action);
    expect(newState).toEqual(blogs);
  });

  test("NEW_BLOG returns state including the blog in action payload", () => {
    const action = {
      type: "NEW_BLOG",
      data: newBlog,
    };
    const state = initialState;

    deepFreeze(state);
    const newState = blogReducer(state, action);
    expect(newState).toContainEqual(newBlog);
  });

  test("LIKE_BLOG returns state with given blog's likes increased", () => {
    const state = blogs;

    const blogToLike = blogs[0];

    const action = {
      type: "LIKE_BLOG",
      id: blogToLike.id,
    };

    deepFreeze(state);
    const newState = blogReducer(state, action);
    expect(newState).toContainEqual({
      ...blogToLike,
      likes: blogToLike.likes + 1,
    });
  });

  test("DELETE_BLOG returns state excluding the blog in action payload", () => {
    const blogToDelete = blogs[0];

    const action = {
      type: "DELETE_BLOG",
      id: blogToDelete.id,
    };
    const state = blogs;

    deepFreeze(state);
    const newState = blogReducer(state, action);
    expect(newState).not.toContainEqual(blogToDelete);
  });
});
