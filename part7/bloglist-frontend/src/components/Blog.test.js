import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { render, fireEvent, cleanup } from "@testing-library/react";
import UserContext from "../UserContext";
import Blog from "./Blog";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("<Blog />", () => {
  let user;
  let userRegExp;
  let blog;
  let store;

  beforeEach(() => {
    store = mockStore();

    user = { username: "username", name: "John Doe" };

    blog = {
      title: "Test Title",
      author: "Test Author",
      url: "http://testsite.com",
      likes: 99,
      user: { username: "username", name: "John Doe" },
    };

    userRegExp = new RegExp(`You|${blog.user.name}|${blog.user.username}`);
  });

  afterEach(() => {
    cleanup();
  });

  test("displays only title and author initially", () => {
    const component = render(
      <Provider store={store}>
        <UserContext.Provider value={user}>
          <Blog blog={blog}></Blog>
        </UserContext.Provider>
      </Provider>
    );

    expect(component.container).toHaveTextContent(blog.title);
    expect(component.container).toHaveTextContent(blog.author);
    expect(component.container).not.toHaveTextContent("Visit Blog");
    expect(component.container).not.toHaveTextContent(`${blog.likes}`);
    expect(component.container).not.toHaveTextContent(userRegExp);
  });

  test("displays full details when clicked", () => {
    const component = render(
      <Provider store={store}>
        <UserContext.Provider value={user}>
          <Blog blog={blog}></Blog>
        </UserContext.Provider>
      </Provider>
    );

    const { getByRole } = component;
    const blogContainer = getByRole("button");

    fireEvent.click(blogContainer);

    expect(component.container).toHaveTextContent(blog.title);
    expect(component.container).toHaveTextContent(blog.author);
    expect(component.container).toHaveTextContent("Visit Blog");
    expect(component.container).toHaveTextContent(`${blog.likes}`);
    expect(component.container).toHaveTextContent(userRegExp);
  });
});
