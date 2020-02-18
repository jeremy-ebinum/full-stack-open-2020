import React, { useState, useEffect, useRef } from "react";
import uniqueRandom from "unique-random";
import loginService from "./services/login";
import blogsService from "./services/blogs";
import Toggleable from "./components/Toggleable";
import NavBar from "./components/NavBar";
import AlertList from "./components/AlertList";
import Login from "./components/Login";
import ModalSpinner from "./components/ModalSpinner";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";

const random = uniqueRandom(1, 10000);

function App() {
  const [alerts, setAlerts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const blogFormRef = useRef();
  const [fetchError, setFetchError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Add new alerts to the alerts state
   *
   * @param {Object[]} newAlerts - An array of alerts to be transformed
   * @param {string} newAlerts[].type - "info" or "error" or "success"
   * @param {string} newAlerts[].message - The alert message
   */
  const queueAlerts = newAlerts => {
    // Remove the current alert being queued
    const timeoutFunc = id => {
      setAlerts(currentAlerts => currentAlerts.filter(a => a.id !== id));
    };

    const alertsWithTimeout = newAlerts.map(a => {
      return {
        ...a,
        id: `${a.type}-${random()}`,
        timeoutFunc: timeoutFunc
      };
    });

    setAlerts(alerts.concat(...alertsWithTimeout));
  };

  useEffect(() => {
    const setInitialBlogs = async () => {
      setFetchError(null);
      setIsLoading(true);

      try {
        const initialBlogs = await blogsService.getAll();
        setBlogs(initialBlogs);
      } catch (error) {
        if (error.response.status >= 400 && error.response.status < 500) {
          setFetchError(error.response.data);
        } else {
          setFetchError({ message: "Oops! Something went wrong" });
        }
      } finally {
        setIsLoading(false);
      }
    };

    setInitialBlogs();
  }, []);

  if (fetchError) {
    queueAlerts([{ type: "error", message: fetchError.message }]);
    setFetchError(null);
  }

  useEffect(() => {
    const loggedInBloglistUser = localStorage.getItem("loggedInBloglistUser");
    if (loggedInBloglistUser) {
      const user = JSON.parse(loggedInBloglistUser);
      setUser(user);
      blogsService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    const rootStyle = document.documentElement.style;
    if (user) {
      rootStyle.setProperty("--body-bg-color", "var(--light-color)");
    } else {
      rootStyle.setProperty("--body-bg-color", "var(--primary-color-faded)");
    }
  }, [user]);

  const handleLoginErrors = error => {
    if (error.response.status >= 400 && error.response.status < 500) {
      const errorMessage = error.response.data.message;
      queueAlerts([{ type: "error", message: `${errorMessage}` }]);
    } else {
      queueAlerts([{ type: "error", message: "Oops! Something went wrong" }]);
    }
  };

  const handleLogin = async event => {
    event.preventDefault();
    setIsLoggingIn(true);

    try {
      const user = await loginService.login({
        username,
        password
      });

      blogsService.setToken(user.token);
      setUser(user);
      localStorage.setItem("loggedInBloglistUser", JSON.stringify(user));
      queueAlerts([{ type: "info", message: `Logged in as ${username}` }]);
    } catch (error) {
      handleLoginErrors(error);
    } finally {
      setIsLoggingIn(false);
      setUsername("");
      setPassword("");
    }
  };

  const handleLogout = () => {
    blogsService.setToken(null);
    setUser(null);
    localStorage.removeItem("loggedInBloglistUser");
    resetBlogForm();
    queueAlerts([{ type: "info", message: "Logged out" }]);
  };

  const loginProps = {
    showPassword,
    passwordType: `${showPassword ? "text" : "password"}`,
    usernameValue: username,
    passwordValue: password,
    handleUsernameChange: ({ target }) => setUsername(target.value),
    handlePasswordChange: ({ target }) => setPassword(target.value),
    handlePasswordTogglerClick: () => setShowPassword(!showPassword),
    handleSubmit: event => handleLogin(event)
  };

  const resetBlogForm = () => {
    setBlogTitle("");
    setBlogAuthor("");
    setBlogUrl("");
  };

  const handleAddBlogErrors = error => {
    const statusCode = error.response.status;

    if (statusCode >= 400 && statusCode < 500) {
      const errorMessages = error.response.data.messages;
      const alerts = errorMessages.map(m => {
        return {
          type: "error",
          message: m
        };
      });
      queueAlerts(alerts);
    } else {
      queueAlerts([{ type: "error", message: "Oops! something went wrong" }]);
    }
  };

  const addBlog = async event => {
    event.preventDefault();
    const newBlog = { title: blogTitle, author: blogAuthor, url: blogUrl };
    setIsLoading(true);

    try {
      const returnedBlog = await blogsService.create(newBlog);
      blogFormRef.current.toggleVisibility();
      setIsLoading(false);
      setBlogs(blogs.concat(returnedBlog));
      resetBlogForm();
      const title = returnedBlog.title;
      const titleToShow = title.length > 45 ? title.slice(0, 44) + "… " : title;
      queueAlerts([
        {
          type: "success",
          message: `Added ${titleToShow} by ${returnedBlog.author ||
            "unknown author"}`
        }
      ]);
    } catch (error) {
      setIsLoading(false);
      handleAddBlogErrors(error);
    }
  };

  const blogFormProps = {
    titleValue: blogTitle,
    authorValue: blogAuthor,
    urlValue: blogUrl,
    handleTitleChange: ({ target }) => setBlogTitle(target.value),
    handleAuthorChange: ({ target }) => setBlogAuthor(target.value),
    handleUrlChange: ({ target }) => setBlogUrl(target.value),
    handleSubmit: event => addBlog(event)
  };

  const blogForm = () => (
    <Toggleable
      ref={blogFormRef}
      showContextClass="c-toggleable__show--inBlogForm"
      showButtonClass="c-btn c-btn--success"
      showButtonLabel="+ Blog"
      hideContextClass="c-toggleable__hide--inBlogForm"
    >
      <BlogForm {...blogFormProps} />
    </Toggleable>
  );

  return (
    <div className="o-container js-container">
      {!user && (
        <>
          <AlertList contextClass={"c-alert--inLogin"} alerts={alerts} />
          <Login {...loginProps} />
        </>
      )}

      {user && (
        <>
          <NavBar
            handleLogout={() => handleLogout()}
            brandTitle="Blog List"
            nameOfLoggedInUser={`${user.name}`}
            isLoading={isLoading}
          />
          <div className="c-blogs">
            <AlertList contextClass={"c-alert--inBlog"} alerts={alerts} />
            {blogForm()}
            <BlogList
              blogs={blogs.filter(blog => blog.user.username === user.username)}
              isLoading={isLoading}
            />
          </div>
        </>
      )}

      {isLoggingIn && <ModalSpinner />}
    </div>
  );
}

export default App;
