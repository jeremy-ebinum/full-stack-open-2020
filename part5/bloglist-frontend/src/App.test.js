import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  act,
  waitForElement,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { prettyDOM } from "@testing-library/dom";
import testHelper from "./helpers/testHelper";
import nock from "nock";
import App, { testIDs as appTestIDs } from "./App";
import { testIDs as loginTestIDs } from "./components/Login";
import { testIDs as modalSpinnerTestIDs } from "./components/ModalSpinner";
import { testIDs as navbarTestIDs } from "./components/NavBar";

jest.useFakeTimers();

let blogs;
beforeAll(() => {
  blogs = testHelper.blogs;
});

describe("<App />", () => {
  describe("When user is not logged in", () => {
    afterEach(() => {
      cleanup();
    });

    test("blogs are not rendered", async () => {
      const { container, queryByTestId } = render(<App />);
      expect(queryByTestId(appTestIDs.blogs)).not.toBeInTheDocument();
      expect(container).not.toHaveTextContent(blogs[0].title);
      expect(container).not.toHaveTextContent(blogs[0].author);
    });

    test("login form is rendered", async () => {
      const { findByRole, getByText } = render(<App />);
      const loginForm = await findByRole("form");
      const loginBtn = getByText(/login|sign in/i, {
        selector: "*[type='submit']",
      });

      expect(loginForm).toContainElement(loginBtn);
    });

    test("clicking the password icon toggles password masking", async () => {
      const component = render(<App />);
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
      nock(testHelper.host)
        .persist()
        .get(testHelper.blogsPath)
        .reply(200, testHelper.blogs)
        .post(testHelper.loginPath)
        .reply(200, testHelper.validLoggedInUser);

      const { findByText, getByTestId } = render(<App />);
      const loginBtn = await findByText(/login|sign in/i, {
        selector: "*[type='submit']",
      });

      await act(async () => {
        fireEvent.click(loginBtn);
      });

      await waitForElementToBeRemoved(() => [
        getByTestId(modalSpinnerTestIDs.modalSpinner),
      ]);
    });
  });

  describe("When user is logged in", () => {
    beforeEach(() => {
      const user = testHelper.validLoggedInUser;
      localStorage.setItem("loggedInBloglistUser", JSON.stringify(user));
    });

    afterEach(() => {
      cleanup();
    });

    test("blogs are fetched from backend and rendered", async () => {
      nock(testHelper.host)
        .persist()
        .get(testHelper.blogsPath)
        .reply(200, testHelper.blogs);

      const { getByText } = render(<App />);

      const blogNodes = await waitForElement(() =>
        blogs.reduce((elementsToWaitFor, blog) => {
          elementsToWaitFor.push(getByText(blog.title));

          return elementsToWaitFor;
        }, [])
      );

      expect(blogNodes.length).toBe(blogs.length);
    });

    test("clicking the logout button logs out the user", async () => {
      nock(testHelper.host)
        .persist()
        .get(testHelper.blogsPath)
        .reply(200, testHelper.blogs);

      const { findByText, getByTestId, queryByText } = render(<App />);

      const logoutBtn = await findByText(/logout|sign out/i, {
        selector: "button",
      });

      await waitForElementToBeRemoved(() =>
        getByTestId(navbarTestIDs.spinnerIcon)
      );

      expect(queryByText(blogs[0].title)).toBeInTheDocument();

      fireEvent.click(logoutBtn);
      expect(localStorage.getItem("loggedInBloglistUser")).toBe(null);
      expect(queryByText(blogs[0].title)).toBe(null);
    });
  });
});
