import React, { useState, useEffect, useRef } from "react";
import uniqueRandom from "unique-random";
import UserContext from "./UserContext";
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
  const [fetchError, setFetchError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasScrollTop, setHasScrollTop] = useState(false);
  const blogFormRef = useRef();

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

  // Fetch blogs from backend on initial app load
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

  // Get persisted logged in user from localStorage
  useEffect(() => {
    const loggedInBloglistUser = localStorage.getItem("loggedInBloglistUser");
    if (loggedInBloglistUser) {
      const user = JSON.parse(loggedInBloglistUser);
      setUser(user);
      blogsService.setToken(user.token);
    }
  }, []);

  // Handle DOM updates depending on if the login or blogs page is shown
  useEffect(() => {
    const rootStyle = document.documentElement.style;

    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const pageHeight = document.documentElement.offsetHeight;
      const percentScrollTop = Math.round((scrollTop / pageHeight) * 100);

      if (!user) return;

      if (percentScrollTop > 10) {
        setHasScrollTop(true);
      } else {
        setHasScrollTop(false);
      }
    };

    if (user) {
      rootStyle.setProperty("--body-bg-color", "var(--light-color)");
      window.addEventListener("scroll", handleScroll);
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

  const login = async event => {
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

  const logout = () => {
    blogsService.setToken(null);
    setUser(null);
    localStorage.removeItem("loggedInBloglistUser");
    resetBlogForm();
    queueAlerts([{ type: "info", message: "Logged out" }]);
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

  const handleLikeBlogErrors = (error, id) => {
    const statusCode = error.response.status;

    if (statusCode === 404) {
      setBlogs(blogs.filter(blog => blog.id !== id));
      return queueAlerts([{ type: "error", message: "Blog does not exist" }]);
    } else if (error.response.status >= 400 && error.response.status < 500) {
      const errorMessage = error.response.data.message;
      queueAlerts([{ type: "error", message: `${errorMessage}` }]);
    } else {
      queueAlerts([{ type: "error", message: "Oops! something went wrong" }]);
    }
  };

  const likeBlog = async (event, id) => {
    const blog = blogs.find(blog => blog.id === id);

    if (!blog) {
      return queueAlerts([{ type: "error", message: "Blog does not exist" }]);
    }

    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id };
    setIsLoading(true);

    try {
      const returnedBlog = await blogsService.update(id, updatedBlog);
      setBlogs(blogs.map(blog => (blog.id !== id ? blog : returnedBlog)));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      handleLikeBlogErrors(error, id);
    }
  };

  const handleDeleteBlogErrors = (error, id) => {
    const statusCode = error.response.status;

    if (statusCode === 404) {
      setBlogs(blogs.filter(blog => blog.id !== id));
      return queueAlerts([{ type: "error", message: "Blog does not exist" }]);
    } else {
      queueAlerts([{ type: "error", message: "Oops! something went wrong" }]);
    }
  };

  const deleteBlog = async (event, id, title) => {
    const titleToShow = title.length > 45 ? title.slice(0, 44) + "… " : title;
    const willDelete = window.confirm(`Delete ${titleToShow}?`);

    if (!willDelete) return;

    try {
      setIsLoading(true);
      await blogsService.remove(id);
      setBlogs(blogs.filter(blog => blog.id !== id));
      setIsLoading(false);
      queueAlerts([{ type: "info", message: `Deleted Blog: ${titleToShow}` }]);
    } catch (error) {
      setIsLoading(false);
      handleDeleteBlogErrors(error, id);
    }
  };

  const loginProps = {
    showPassword,
    passwordType: `${showPassword ? "text" : "password"}`,
    usernameValue: username,
    passwordValue: password,
    handleUsernameChange: ({ target }) => setUsername(target.value),
    handlePasswordChange: ({ target }) => setPassword(target.value),
    handlePasswordTogglerClick: () => setShowPassword(!showPassword),
    handleSubmit: event => login(event)
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

  const blogsSortedByLikesDesc = [...blogs].sort((currBlog, nextBlog) => {
    return nextBlog.likes - currBlog.likes;
  });

  const scrollToTop = () => {
    document.documentElement.scrollTop = 0;
  };

  return (
    <>
      {!user && (
        <div className="o-container js-container">
          <AlertList contextClass={"c-alert--inLogin"} alerts={alerts} />
          <Login {...loginProps} />

          {isLoggingIn && <ModalSpinner />}
        </div>
      )}

      {user && (
        <div className="o-container js-container">
          <UserContext.Provider value={user}>
            <NavBar
              handleLogout={() => logout()}
              brandTitle="Blog List"
              isLoading={isLoading}
            />
            <div className="c-blogs">
              <AlertList contextClass={"c-alert--inBlog"} alerts={alerts} />
              {blogForm()}
              <BlogList
                blogs={blogsSortedByLikesDesc}
                isLoading={isLoading}
                handleLike={likeBlog}
                handleDelete={deleteBlog}
              />
            </div>
            {hasScrollTop && (
              <div className="c-to-top">
                <button
                  onClick={() => scrollToTop()}
                  className="c-btn c-btn--transparent"
                >
                  Back To Top
                </button>
              </div>
            )}
          </UserContext.Provider>
        </div>
      )}
    </>
  );
}

export default App;
