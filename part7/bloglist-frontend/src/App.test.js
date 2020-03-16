import React from "react";
import { Provider } from "react-redux";
import { createMemoryHistory } from "history";
import configureStore from "./configureStore";
import {
  render as rtlRender,
  fireEvent,
  cleanup,
  wait,
  waitForElement,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import testHelper, { routes } from "./helpers/testHelper";
import _times from "lodash.times";
import App from "./App";
import { testIDs as homeTestIDs } from "./components/Home";
import { testIDs as loginTestIDs } from "./components/Login";
import { testIDs as modalSpinnerTestIDs } from "./components/ModalSpinner";
import { testIDs as navbarTestIDs } from "./components/NavBar";

const axios = require("axios");
const AxiosMockAdapter = require("axios-mock-adapter");

let blogs;
let users;
let validNewBlog;
let addedBlog;
let validLoggedInUser;
let validLoggedInUserId;
let username;
let password;

beforeAll(() => {
  const getRandomHex = () => Math.floor(Math.random() * 0xf) + 1;
  const blogId = _times(24, () => getRandomHex().toString(16)).join("");

  validLoggedInUser = testHelper.validLoggedInUser;
  blogs = testHelper.blogs;
  users = testHelper.users;
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

  username = "username";
  password = "password";
});

const renderApp = (route = "/", preloadedState = {}, options = {}) => {
  const store = configureStore(preloadedState);
  const history = createMemoryHistory({ initialEntries: [route] });

  const Providers = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  return rtlRender(<App history={history} />, {
    wrapper: Providers,
    ...options,
  });
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
      mockAxios
        .onGet(routes.blogsPath)
        .reply(200, blogs)
        .onGet(routes.usersPath)
        .reply(200, users);

      const { container, queryByTestId } = renderApp();

      expect(queryByTestId(homeTestIDs.Home_blogs)).not.toBeInTheDocument();
      expect(container).not.toHaveTextContent(blogs[0].title);
      expect(container).not.toHaveTextContent(blogs[0].author);
    });

    test("login form is rendered", async () => {
      mockAxios
        .onGet(routes.blogsPath)
        .reply(200, blogs)
        .onGet(routes.usersPath)
        .reply(200, users);
      const { findByRole, getByText } = renderApp();
      const loginForm = await findByRole("form");
      const loginBtn = getByText(/login|sign in/i, {
        selector: "*[type='submit']",
      });

      expect(loginForm).toContainElement(loginBtn);
    });

    test("clicking the password icon toggles password masking", async () => {
      mockAxios
        .onGet(routes.blogsPath)
        .reply(200, blogs)
        .onGet(routes.usersPath)
        .reply(200, users);
      const { findByRole, getByLabelText, getByTestId } = renderApp();
      await findByRole("form");
      const passwordInput = getByLabelText("password");
      const toggleBtn = getByTestId(loginTestIDs.Login_toggleShowPassword);

      fireEvent.click(toggleBtn);

      expect(passwordInput.getAttribute("type")).toBe("text");

      fireEvent.click(toggleBtn);

      expect(passwordInput.getAttribute("type")).toBe("password");
    });

    test("a valid user can be logged in", async () => {
      mockAxios
        .onGet(routes.blogsPath)
        .reply(200, blogs)
        .onGet(routes.usersPath)
        .reply(200, users)
        .onPost(routes.loginPath)
        .reply(200, validLoggedInUser);

      const {
        getByText,
        getByLabelText,
        getByTestId,
        findByText,
      } = renderApp();

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
        getByTestId(modalSpinnerTestIDs.ModalSpinner_modal),
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
      mockAxios
        .onGet(routes.blogsPath)
        .reply(200, blogs)
        .onGet(routes.usersPath)
        .reply(200, users);

      const { getByText, findByTestId } = renderApp();

      const navbarSpinner = await findByTestId(navbarTestIDs.Navbar_spinner);
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
      mockAxios
        .onGet(routes.blogsPath)
        .reply(200, blogs)
        .onGet(routes.usersPath)
        .reply(200, users);

      const { findByText, findByRole, findByTestId } = renderApp();

      const navbarSpinner = await findByTestId(navbarTestIDs.Navbar_spinner);
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
      mockAxios
        .onGet(routes.blogsPath)
        .reply(200, blogs)
        .onGet(routes.usersPath)
        .reply(200, users);

      const { getByText, getByRole, getByLabelText } = renderApp();

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
        .onGet(routes.blogsPath)
        .reply(200, blogs)
        .onGet(routes.usersPath)
        .reply(200, users)
        .onPost(routes.blogsPath)
        .reply(201, addedBlog);

      const {
        getByText,
        getByLabelText,
        findByText,
        findByTestId,
      } = renderApp();

      await findByTestId(navbarTestIDs.Navbar_spinner);
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

      await findByTestId(navbarTestIDs.Navbar_spinner);
      jest.advanceTimersByTime(1000);
      await findByText(validNewBlog.title);
    });

    test("liking a blog increases it's displayed likes", async () => {
      const likeBlogPath = `${routes.blogsPath}/${blogs[0].id}`;
      mockAxios
        .onGet(routes.blogsPath)
        .reply(200, blogs)
        .onGet(routes.usersPath)
        .reply(200, users)
        .onPut(likeBlogPath)
        .reply((config) => {
          const likedBlog = JSON.parse(config.data);
          const data = { ...likedBlog, user: blogs[0].user };

          return [200, data];
        });

      const route = `/blogs/${blogs[0].id}`;
      const { getByText, findByText, findByTestId } = renderApp(route);

      await findByTestId(navbarTestIDs.Navbar_spinner);
      jest.advanceTimersByTime(1000);

      await findByText(blogs[0].title);

      const likeBtn = getByText(/like/i, { selector: "button" });

      fireEvent.click(likeBtn);

      await findByTestId(navbarTestIDs.Navbar_spinner);
      jest.advanceTimersByTime(1000);
      await findByText(blogs[0].title);

      const likesRegex = new RegExp(`(\\d+)\\s*like(s)?`, "i");
      const likesTxt = getByText(likesRegex);
      const moreLikes = new RegExp(`${blogs[0].likes + 1}\\s*like(s)?`, "i");
      expect(likesTxt).toHaveTextContent(moreLikes);
    });

    test("deleting a blog removes it from the page", async () => {
      const deleteBlogPath = `${routes.blogsPath}/${blogs[0].id}`;

      mockAxios
        .onGet(routes.blogsPath)
        .reply(200, blogs)
        .onGet(routes.usersPath)
        .reply(200, users)
        .onDelete(deleteBlogPath)
        .reply(204);

      const route = `/blogs/${blogs[0].id}`;
      const { getByText, queryByText, findByText, findByTestId } = renderApp(
        route
      );

      await findByTestId(navbarTestIDs.Navbar_spinner);
      jest.advanceTimersByTime(1000);

      await findByText(blogs[0].title);

      const deleteBtn = getByText(/delete|remove/i, {
        selector: "button",
      });

      fireEvent.click(deleteBtn);

      await findByTestId(navbarTestIDs.Navbar_spinner);
      jest.advanceTimersByTime(1000);
      await wait(() => expect(queryByText(blogs[0].title)).toBe(null));
    });
  });
});
