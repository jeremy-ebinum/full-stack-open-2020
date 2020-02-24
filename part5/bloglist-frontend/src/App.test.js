import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { prettyDOM } from "@testing-library/dom";
import testHelper from "./helpers/testHelper";
import App, { testIDs as appTestIDs } from "./App";
import { testIDs as loginTestIDs } from "./components/Login";
import { testIDs as modalSpinnerTestIDs } from "./components/ModalSpinner";
import { testIDs as blogTestIDs } from "./components/Blog";

let blogs;
beforeAll(() => {
  blogs = testHelper.blogs;
});

describe("<App />", () => {
  describe("When user is not logged in", () => {
    let component;
    beforeEach(() => {
      component = render(<App />);
    });

    test("blogs are not rendered", async () => {
      expect(component.queryByTestId(appTestIDs.blogs)).not.toBeInTheDocument();
      expect(component.container).not.toHaveTextContent(blogs[0].title);
      expect(component.container).not.toHaveTextContent(blogs[0].author);
    });

    test("login form is rendered", async () => {
      const loginForm = await component.findByRole("form");
      const loginButton = component.getByText((content, element) => {
        const isLoginButton =
          element.getAttribute("type") === "submit" &&
          /login|sign in/gi.test(content);

        return isLoginButton;
      });

      expect(loginForm).toContainElement(loginButton);
    });

    test("clicking the password icon toggles password masking", async () => {
      await component.findByRole("form");
      const passwordInput = component.getByLabelText("password");
      const toggleBtn = component.getByTestId(loginTestIDs.toggleShowPassword);

      fireEvent.click(toggleBtn);

      expect(passwordInput.getAttribute("type")).toBe("text");

      fireEvent.click(toggleBtn);

      expect(passwordInput).toHaveAttribute(
        "type",
        expect.stringContaining("password")
      );
    });

    test("a loading modal is shown on submitting the login form", async () => {
      const loginButton = await component.findByText((content, element) => {
        return (
          element.getAttribute("type") === "submit" &&
          /login|sign in/gi.test(content)
        );
      });

      fireEvent.click(loginButton);
      await component.findByTestId(modalSpinnerTestIDs.modalSpinner);
    });
  });

  describe("When user is logged in", () => {
    let component;
    beforeEach(() => {
      const user = testHelper.validLoggedInUser;

      localStorage.setItem("loggedInBloglistUser", JSON.stringify(user));

      component = render(<App />);
    });

    test("blogs are fetched from backend and rendered", async () => {
      const blogNodes = await blogs.reduce(async (acc, blog) => {
        const result = await acc;
        try {
          const blogNode = await component.queryByTestId(
            blogTestIDs[`blog_${blog.id}`]
          );

          if (blogNode) result.push(blogNode);
        } catch (error) {
          console.error(error);
        }

        return result;
      }, []);

      expect(blogNodes.length).toBe(blogs.length);
      expect(component.container).toHaveTextContent(blogs[0].title);
      expect(component.container).toHaveTextContent(blogs[0].author);
    });
  });
});
