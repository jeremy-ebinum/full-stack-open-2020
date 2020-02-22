import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import UserContext from "../UserContext";
import Blog from "./Blog";

describe("<Blog />", () => {
  let user;
  let userRegExp;
  let blog;
  let handleLike;
  let handleDelete;

  beforeEach(() => {
    user = { username: "username", name: "John Doe" };

    blog = {
      title: "Test Title",
      author: "Test Author",
      url: "http://testsite.com",
      likes: 99,
      user: { username: "username", name: "John Doe" },
    };

    userRegExp = new RegExp(`You|${blog.user.name}|${blog.user.username}`);
    handleLike = jest.fn();
    handleDelete = jest.fn();
  });

  afterEach(() => {
    cleanup();
  });

  test("displays only title and author initially", () => {
    const component = render(
      <UserContext.Provider value={user}>
        <Blog
          blog={blog}
          handleLike={handleLike}
          handleDelete={handleDelete}
        ></Blog>
      </UserContext.Provider>
    );

    expect(component.container).toHaveTextContent(blog.title);
    expect(component.container).toHaveTextContent(blog.author);
    expect(component.container).not.toHaveTextContent("Visit Blog");
    expect(component.container).not.toHaveTextContent(`${blog.likes}`);
    expect(component.container).not.toHaveTextContent(userRegExp);
  });

  test("displays full details when clicked", () => {
    const component = render(
      <UserContext.Provider value={user}>
        <Blog
          blog={blog}
          handleLike={handleLike}
          handleDelete={handleDelete}
        ></Blog>
      </UserContext.Provider>
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
