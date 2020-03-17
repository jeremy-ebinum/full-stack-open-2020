import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import UserContext from "../UserContext";
import Blog, { testIDs } from "./Blog";

describe("<Blog />", () => {
  let user;
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

    handleLike = jest.fn();
    handleDelete = jest.fn();
  });

  afterEach(() => {
    cleanup();
  });

  test("displays only title and author initially", () => {
    const { container, queryByTestId } = render(
      <UserContext.Provider value={user}>
        <Blog
          blog={blog}
          handleLike={handleLike}
          handleDelete={handleDelete}
        ></Blog>
      </UserContext.Provider>
    );

    expect(container).toHaveTextContent(blog.title);
    expect(container).toHaveTextContent(blog.author);
    expect(queryByTestId(testIDs.Blog_url)).toBe(null);
    expect(queryByTestId(testIDs.Blog_likesTxt)).toBe(null);
    expect(queryByTestId(testIDs.Blog_user)).toBe(null);
  });

  test("displays full details when clicked", () => {
    const { getByText, getByTestId, container } = render(
      <UserContext.Provider value={user}>
        <Blog
          blog={blog}
          handleLike={handleLike}
          handleDelete={handleDelete}
        ></Blog>
      </UserContext.Provider>
    );

    const showButton = getByText(/show|view/i, {
      selector: "button",
    });

    fireEvent.click(showButton);

    expect(container).toHaveTextContent(blog.title);
    expect(container).toHaveTextContent(blog.author);
    getByTestId(testIDs.Blog_url);
    getByTestId(testIDs.Blog_likesTxt);
    getByTestId(testIDs.Blog_user);
  });
});
