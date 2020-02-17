import React, { useState, useEffect } from "react";
import uniqueRandom from "unique-random";
import loginService from "./services/login";
import blogsService from "./services/blogs";
import NavBar from "./components/NavBar";
import AlertList from "./components/AlertList";
import Login from "./components/Login";
import ModalSpinner from "./components/ModalSpinner";
import BlogList from "./components/BlogList";

const random = uniqueRandom(1, 10000);

function App() {
  const [alerts, setAlerts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModalSpinner, setShowModalSpinner] = useState(false);
  const [showNavbarSpinner, setShowNavbarSpinner] = useState(false);

  useEffect(() => {
    const setInitialBlogs = async () => {
      setShowNavbarSpinner(true);
      const initialBlogs = await blogsService.getAll();
      setBlogs(initialBlogs);
      setShowNavbarSpinner(false);
    };

    setInitialBlogs();
  }, []);

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

  const handleLogin = async event => {
    event.preventDefault();
    setShowModalSpinner(true);

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
      const errorMessage = error.response.data.error.message;
      queueAlerts([{ type: "error", message: `${errorMessage}` }]);
    } finally {
      setShowModalSpinner(false);
      setUsername("");
      setPassword("");
    }
  };

  const handleLogout = event => {
    blogsService.setToken(null);
    setUser(null);
    localStorage.removeItem("loggedInBloglistUser");
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

  let blogsToShow;
  if (user) {
    blogsToShow = blogs.filter(blog => blog.user.username === user.username);
  } else {
    blogsToShow = [];
  }

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
            handleLogout={event => handleLogout(event)}
            brandTitle="Blog List"
            nameOfLoggedInUser={`${user.name}`}
            showSpinner={showNavbarSpinner}
          />
          <div className="c-blogs">
            <AlertList contextClass={"c-alert--inBlog"} alerts={alerts} />
            <BlogList blogs={blogsToShow} />
          </div>
        </>
      )}

      {showModalSpinner && <ModalSpinner />}
    </div>
  );
}

export default App;
