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
      id: "9a879e8723091c482b9d9168",
    };

    handleLike = jest.fn().mockName("handleLike");
    handleDelete = jest.fn().mockName("handleDelete");
  });

  afterEach(() => {
    cleanup();
  });

  test("displays only title and author initially", () => {
    const { container, queryByTestId, debug } = render(
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
    debug();
    expect(queryByTestId(testIDs[`Blog_${blog.id}_url`])).toBe(null);
    expect(queryByTestId(testIDs[`Blog_${blog.id}_likesTxt`])).toBe(null);
    expect(queryByTestId(testIDs[`Blog_${blog.id}_user`])).toBe(null);
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
    getByTestId(testIDs[`Blog_${blog.id}_url`]);
    getByTestId(testIDs[`Blog_${blog.id}_likesTxt`]);
    getByTestId(testIDs[`Blog_${blog.id}_user`]);
  });

  test("Like button's handler gets called on each click", () => {
    const { getByText } = render(
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

    const likeButton = getByText(/like/i, { selector: "button" });

    likeButton.click();
    likeButton.click();

    expect(handleLike).toHaveBeenCalledTimes(2);
  });
});
