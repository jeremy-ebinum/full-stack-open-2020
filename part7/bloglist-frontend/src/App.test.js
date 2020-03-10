import React from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { reducers } from "./store";
import {
  render as rtlRender,
  within,
  fireEvent,
  cleanup,
  wait,
  waitForElement,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import testHelper, { routes } from "./helpers/testHelper";
import _times from "lodash/times";
import App, { testIDs as appTestIDs } from "./App";
import { testIDs as loginTestIDs } from "./components/Login";
import { testIDs as modalSpinnerTestIDs } from "./components/ModalSpinner";
import { testIDs as navbarTestIDs } from "./components/NavBar";
import { testIDs as blogTestIDs } from "./components/Blog";

const axios = require("axios");
const AxiosMockAdapter = require("axios-mock-adapter");

let blogs;
let validNewBlog;
let addedBlog;
let blogsPath;
let loginPath;
let validLoggedInUser;
let validLoggedInUserId;
let username;
let password;

beforeAll(() => {
  const getRandomHex = () => Math.floor(Math.random() * 0xf) + 1;
  const blogId = _times(24, () => getRandomHex().toString(16)).join("");

  validLoggedInUser = testHelper.validLoggedInUser;
  blogs = testHelper.blogs;
  validNewBlog = testHelper.validNewBlog;
  validLoggedInUserId = testHelper.validLoggedInUserId;

  addedBlog = {
    ...validNewBlog,
    likes: 0,
    user: {
      username: validLoggedInUser.username,
      name: validLoggedInUser.name,
      id: validLoggedInUserId,
    },
    id: blogId,
  };

  blogsPath = routes.blogsPath;
  loginPath = routes.loginPath;
  username = "username";
  password = "password";
});

const render = (ui, options = {}) => {
  const store = createStore(reducers, applyMiddleware(thunk));

  const Providers = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  return rtlRender(ui, { wrapper: Providers, ...options });
};

describe("<App />", () => {
  describe("When user is not logged in", () => {
    let mockAxios;
    beforeAll(() => {
      mockAxios = new AxiosMockAdapter(axios);
    });

    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      cleanup();
      mockAxios.reset();
    });

    test("blogs are not rendered", async () => {
      mockAxios.onGet(blogsPath).reply(200, blogs);
      const { container, queryByTestId } = render(<App />);

      expect(queryByTestId(appTestIDs.blogs)).not.toBeInTheDocument();
      expect(container).not.toHaveTextContent(blogs[0].title);
      expect(container).not.toHaveTextContent(blogs[0].author);
    });

    test("login form is rendered", async () => {
      mockAxios.onGet(blogsPath).reply(200, blogs);
      const { findByRole, getByText } = render(<App />);
      const loginForm = await findByRole("form");
      const loginBtn = getByText(/login|sign in/i, {
        selector: "*[type='submit']",
      });

      expect(loginForm).toContainElement(loginBtn);
    });

    test("clicking the password icon toggles password masking", async () => {
      mockAxios.onGet(blogsPath).reply(200, blogs);
      const { findByRole, getByLabelText, getByTestId } = render(<App />);
      await findByRole("form");
      const passwordInput = getByLabelText("password");
      const toggleBtn = getByTestId(loginTestIDs.toggleShowPassword);

      fireEvent.click(toggleBtn);

      expect(passwordInput.getAttribute("type")).toBe("text");

      fireEvent.click(toggleBtn);

      expect(passwordInput.getAttribute("type")).toBe("password");
    });

    test("a valid user can be logged in", async () => {
      mockAxios
        .onGet(blogsPath)
        .reply(200, blogs)
        .onPost(loginPath)
        .reply(200, validLoggedInUser);

      const { getByText, getByLabelText, getByTestId, findByText } = render(
        <App />
      );

      const loginBtn = await getByText(/login|sign(.*)?/i, {
        selector: "*[type='submit']",
      });

      const usernameInput = getByLabelText("username");
      const passwordInput = getByLabelText("password");

      fireEvent.change(usernameInput, {
        target: { value: username },
      });

      fireEvent.change(passwordInput, {
        target: { value: password },
      });

      expect(usernameInput).toHaveValue(username);
      expect(passwordInput).toHaveValue(password);

      fireEvent.click(loginBtn);

      const names = `(${validLoggedInUser.username}|${validLoggedInUser.name})`;
      const notificationRegex = new RegExp(`logged|signed (.*)?${names}`, "i");

      await waitForElementToBeRemoved(() => [
        getByTestId(modalSpinnerTestIDs.modalSpinner),
      ]);

      const loginNotification = await findByText(notificationRegex);
      jest.advanceTimersByTime(5000);
      expect(loginNotification).not.toBeInTheDocument();
    });
  });

  describe("When user is logged in", () => {
    let mockAxios;
    beforeAll(() => {
      mockAxios = new AxiosMockAdapter(axios, { delayResponse: 1000 });
    });

    beforeEach(() => {
      const user = validLoggedInUser;
      localStorage.setItem("authBloglistUser", JSON.stringify(user));
      jest.useFakeTimers();
    });

    afterEach(() => {
      cleanup();
      mockAxios.reset();
    });

    afterAll(() => {
      localStorage.clear();
    });

    test("blogs are fetched from backend and rendered", async () => {
      mockAxios.onGet(blogsPath).reply(200, blogs);
      const { getByText, findByTestId } = render(<App />);

      const navbarSpinner = await findByTestId(navbarTestIDs.spinnerIcon);
      jest.advanceTimersByTime(1000);

      const blogNodes = await waitForElement(() =>
        blogs.reduce((elementsToWaitFor, blog) => {
          elementsToWaitFor.push(getByText(blog.title));

          return elementsToWaitFor;
        }, [])
      );

      expect(blogNodes.length).toBe(blogs.length);
      expect(navbarSpinner).not.toBeInTheDocument();
      expect(getByText(blogs[0].title)).toBeInTheDocument();
    });

    test("clicking the logout button logs out the user", async () => {
      mockAxios.onGet(blogsPath).reply(200, blogs);

      const { findByText, findByRole, findByTestId } = render(<App />);

      const navbarSpinner = await findByTestId(navbarTestIDs.spinnerIcon);
      jest.advanceTimersByTime(1000);

      const blog = await findByText(blogs[0].title);

      expect(navbarSpinner).not.toBeInTheDocument();

      const logoutBtn = await findByText(/logout|sign out/i, {
        selector: "button",
      });

      fireEvent.click(logoutBtn);

      expect(localStorage.getItem("authBloglistUser")).toBe(null);

      const loginForm = await findByRole("form");
      const loginBtn = await findByText(/login|sign in/i, {
        selector: "*[type='submit']",
      });

      expect(loginForm).toContainElement(loginBtn);
      expect(blog).not.toBeInTheDocument();
    });

    test("a form for new blogs can be toggled with buttons", async () => {
      mockAxios.onGet(blogsPath).reply(200, blogs);

      const { getByText, getByRole, getByLabelText } = render(<App />);

      const showBlogFormBtn = getByText(/blog/i, { selector: "button" });

      fireEvent.click(showBlogFormBtn);
      const blogForm = getByRole("form");
      const authorInput = getByLabelText(/Author/i);
      const hideBlogFormBtn = getByText(/cancel/i, { selector: "button" });
      expect(blogForm).toContainElement(authorInput);
      expect(blogForm).toBeVisible();

      fireEvent.click(hideBlogFormBtn);
      expect(blogForm).not.toBeVisible();
    });

    test("new blogs can be added", async () => {
      mockAxios
        .onGet(blogsPath)
        .reply(200, blogs)
        .onPost(blogsPath)
        .reply(201, addedBlog);

      const { getByText, getByLabelText, findByText, findByTestId } = render(
        <App />
      );

      await findByTestId(navbarTestIDs.spinnerIcon);
      jest.advanceTimersByTime(1000);
      await findByText(blogs[0].title);

      const showBlogFormBtn = getByText(/blog/i, { selector: "button" });

      fireEvent.click(showBlogFormBtn);

      const titleInput = getByLabelText(/Title/i);
      const authorInput = getByLabelText(/Author/i);
      const urlInput = getByLabelText(/URL/i);
      const addBtn = getByText(/create|submit|add/i, {
        selector: "*[type='submit']",
      });

      fireEvent.change(titleInput, {
        target: { value: validNewBlog.title },
      });

      fireEvent.change(authorInput, {
        target: { value: validNewBlog.author },
      });

      fireEvent.change(urlInput, {
        target: { value: validNewBlog.url },
      });

      expect(titleInput).toHaveValue(validNewBlog.title);
      expect(authorInput).toHaveValue(validNewBlog.author);
      expect(urlInput).toHaveValue(validNewBlog.url);

      fireEvent.click(addBtn);

      await findByTestId(navbarTestIDs.spinnerIcon);
      jest.advanceTimersByTime(1000);
      await findByText(validNewBlog.title);
    });

    test("liking a blog increases it's displayed likes", async () => {
      const likeBlogPath = `${blogsPath}/${blogs[0].id}`;
      mockAxios
        .onGet(blogsPath)
        .reply(200, blogs)
        .onPut(likeBlogPath)
        .reply((config) => {
          const likedBlog = JSON.parse(config.data);
          const data = { ...likedBlog, user: blogs[0].user };

          return [200, data];
        });

      const { findByTestId } = render(<App />);

      await findByTestId(navbarTestIDs.spinnerIcon);
      jest.advanceTimersByTime(1000);

      const blogToLike = await findByTestId(blogTestIDs[`blog_${blogs[0].id}`]);
      fireEvent.click(blogToLike);

      const likeBtn = within(blogToLike).getByText(/like/i, {
        selector: "button",
      });

      fireEvent.click(likeBtn);

      await findByTestId(navbarTestIDs.spinnerIcon);
      jest.advanceTimersByTime(1000);

      const likedBlog = await findByTestId(blogTestIDs[`blog_${blogs[0].id}`]);
      const likesRegex = new RegExp(`(\\d+)\\s*like(s)?`, "i");
      const likesTxt = within(likedBlog).getByText(likesRegex);
      const moreLikes = new RegExp(`${blogs[0].likes + 1}\\s*like(s)?`, "i");
      expect(likesTxt).toHaveTextContent(moreLikes);
    });

    test("deleting a blog removes it from the page", async () => {
      const deleteBlogPath = `${blogsPath}/${blogs[0].id}`;

      mockAxios
        .onGet(blogsPath)
        .reply(200, blogs)
        .onDelete(deleteBlogPath)
        .reply(204);

      const { findByTestId } = render(<App />);
      await findByTestId(navbarTestIDs.spinnerIcon);
      jest.advanceTimersByTime(1000);

      const blogToDelete = await findByTestId(
        blogTestIDs[`blog_${blogs[0].id}`]
      );

      fireEvent.click(blogToDelete);

      const deleteBtn = within(blogToDelete).getByText(/delete|remove/i, {
        selector: "button",
      });

      fireEvent.click(deleteBtn);

      await findByTestId(navbarTestIDs.spinnerIcon);
      jest.advanceTimersByTime(1000);

      await wait(() => expect(blogToDelete).not.toBeInTheDocument());
    });
  });
});
