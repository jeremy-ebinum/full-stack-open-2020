import React from "react";
import { render, fireEvent } from "@testing-library/react";
import SimpleBlog from "./SimpleBlog";

describe("<SimpleBlog />", () => {
  let component;
  let mockHandler;
  beforeEach(() => {
    mockHandler = jest.fn();
    const blog = { title: "Test Title", author: "Test Author", likes: 10 };

    component = render(<SimpleBlog blog={blog} onClick={mockHandler} />);
  });

  test("renders title, author and likes of blog", () => {
    expect(component.container).toHaveTextContent("Test Title");
    expect(component.container).toHaveTextContent("Test Author");
    expect(component.container).toHaveTextContent("10");
  });

  test("fires event on each click of like button", () => {
    const { getByRole } = component;
    const likeButton = getByRole("button");

    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(mockHandler.mock.calls.length).toBe(2);
  });
});
