import React from "react";
import { render, waitForElement } from "@testing-library/react";
import blogsService from "./services/blogs";
import App from "./App";

describe("<App />", () => {
  let blogs;
  beforeEach(async () => {
    blogs = await blogsService.getAll();
  });

  describe("When user not logged in", () => {
    let component;
    beforeEach(() => {
      component = render(<App />);
      component.rerender(<App />);
    });

    test("it renders login form", async () => {
      await waitForElement(() =>
        component.getByText((content, element) => {
          const isLoginButton =
            element.getAttribute("type") === "submit" &&
            /login|sign in/gi.test(content);

          return isLoginButton;
        })
      );
    });

    test("it doesn't render blogs", async () => {
      expect(
        component.queryByTestId("blogs-container")
      ).not.toBeInTheDocument();
      expect(component.container).not.toHaveTextContent(blogs[0].title);
      expect(component.container).not.toHaveTextContent(blogs[0].author);
    });
  });

  describe("When user logged in", () => {
    let component;
    beforeEach(() => {
      const user = {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJuYW1lIiwiaWQiOiI1ZTQ3ZTViZGRkMWRmOTEyNjA0MjBkYzMiLCJpYXQiOjE1ODIzOTcwNzZ9.r81M5sJz6xjW3GpTOjfysJDvFelra_oFdDuqKrZ4zxw",
        username: "username",
        name: "Uchiha Madara",
      };

      localStorage.setItem("loggedInBloglistUser", JSON.stringify(user));

      component = render(<App />);
      component.rerender(<App />);
    });

    test("it fetches and renders blogs", async () => {
      const blogNodes = await component.findAllByTestId("blog");

      expect(blogNodes.length).toBe(blogs.length);
      expect(component.container).toHaveTextContent(blogs[0].title);
      expect(component.container).toHaveTextContent(blogs[0].author);
    });
  });
});
