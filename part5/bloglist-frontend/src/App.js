import React, { useState, useEffect, useCallback, useRef } from "react";
import { useUIDSeed } from "react-uid";
import UserContext from "./UserContext";
import loginService from "./services/login";
import blogsService from "./services/blogs";
import Toggleable from "./components/Toggleable";
import ToTopScroller from "./components/ToTopScroller";
import NavBar from "./components/NavBar";
import AlertList from "./components/AlertList";
import Login from "./components/Login";
import ModalSpinner from "./components/ModalSpinner";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";

function App() {
  const [alerts, setAlerts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const blogFormRef = useRef();
  const toTopScrollerRef = useRef();
  const uidSeed = useUIDSeed();

  /**
   * Add new alerts to the alerts state
   *
   * @param {Object[]} newAlerts - An array of alerts to be transformed
   * @param {string} newAlerts[].type - "info" or "error" or "success"
   * @param {string} newAlerts[].message - The alert message
   */
  const queueAlerts = useCallback(
    (newAlerts) => {
      // Remove the current alert being queued
      const timeoutFunc = (id) => {
        setAlerts((currentAlerts) => currentAlerts.filter((a) => a.id !== id));
      };

      const alertsWithTimeout = newAlerts.map((a) => {
        return {
          ...a,
          id: `alert-${a.type}-${uidSeed(a)}`,
          timeoutFunc,
        };
      });

      setAlerts(alerts.concat(...alertsWithTimeout));
    },
    [alerts, uidSeed]
  );

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
      const storedUser = JSON.parse(loggedInBloglistUser);
      setUser(storedUser);
      blogsService.setToken(storedUser.token);
    }
  }, []);

  // Handle DOM updates depending on if the login or blogs page is shown
  useEffect(() => {
    const rootStyle = document.documentElement.style;

    const handleScroll = () => {
      const { scrollTop } = document.documentElement;
      const pageHeight = document.documentElement.offsetHeight;
      const percentScrollTop = Math.round((scrollTop / pageHeight) * 100);

      if (!user) return;

      if (percentScrollTop > 10) {
        toTopScrollerRef.current.show();
      } else {
        toTopScrollerRef.current.hide();
      }
    };

    const handleBlogToggleConflicts = (event) => {
      if (!event.target.classList.contains("js-blog")) return;

      if (event.keyCode === 32) {
        event.preventDefault();
      }
    };

    if (user) {
      rootStyle.setProperty("--body-bg-color", "var(--light-color)");
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("keydown", handleBlogToggleConflicts);
    } else {
      rootStyle.setProperty("--body-bg-color", "var(--primary-color-faded)");
    }

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleBlogToggleConflicts);
  }, [user]);

  const handleApiErrors = useCallback(
    (error, id) => {
      const statusCode = error.response.status;

      if (statusCode === 404) {
        setBlogs(blogs.filter((blog) => blog.id !== id));
        return queueAlerts([{ type: "error", message: "Blog does not exist" }]);
      }

      if (statusCode >= 400 && statusCode < 500) {
        const errorMessages = error.response.data.messages;
        const errorAlerts = errorMessages.map((m) => ({
          type: "error",
          message: m,
        }));
        return queueAlerts(errorAlerts);
      }

      return queueAlerts([
        { type: "error", message: "Oops! something went wrong" },
      ]);
    },
    [blogs, queueAlerts]
  );

  const login = useCallback(
    async (event) => {
      event.preventDefault();
      setIsLoggingIn(true);

      try {
        const authUser = await loginService.login({
          username,
          password,
        });

        blogsService.setToken(authUser.token);
        setUser(authUser);
        localStorage.setItem("loggedInBloglistUser", JSON.stringify(authUser));
        queueAlerts([{ type: "info", message: `Logged in as ${username}` }]);
      } catch (error) {
        handleApiErrors(error);
      } finally {
        setIsLoggingIn(false);
        setUsername("");
        setPassword("");
      }
    },
    [username, password, handleApiErrors, queueAlerts]
  );

  const resetBlogForm = () => {
    setBlogTitle("");
    setBlogAuthor("");
    setBlogUrl("");
  };

  const logout = useCallback(() => {
    blogsService.setToken(null);
    localStorage.removeItem("loggedInBloglistUser");
    setUser(null);
    resetBlogForm();
    queueAlerts([{ type: "info", message: "Logged out" }]);
  }, [queueAlerts]);

  const addBlog = useCallback(
    async (event) => {
      event.preventDefault();
      const newBlog = { title: blogTitle, author: blogAuthor, url: blogUrl };
      setIsLoading(true);

      try {
        const returnedBlog = await blogsService.create(newBlog);
        blogFormRef.current.toggleVisibility();
        setBlogs(blogs.concat(returnedBlog));
        resetBlogForm();
        const { title } = returnedBlog;
        const titleToShow =
          title.length > 45 ? `${title.slice(0, 44)}… ` : title;
        queueAlerts([
          {
            type: "success",
            message: `Added ${titleToShow} by ${returnedBlog.author ||
              "unknown author"}`,
          },
        ]);
      } catch (error) {
        handleApiErrors(error);
      } finally {
        setIsLoading(false);
      }
    },
    [blogAuthor, blogTitle, blogUrl, blogs, handleApiErrors, queueAlerts]
  );

  const likeBlog = useCallback(
    async (event, id) => {
      const blogToLike = blogs.find((blog) => blog.id === id);

      if (!blogToLike) {
        queueAlerts([{ type: "error", message: "Blog does not exist" }]);
      } else {
        const updatedBlog = {
          ...blogToLike,
          likes: blogToLike.likes + 1,
          user: blogToLike.user.id,
        };

        setIsLoading(true);

        try {
          const returnedBlog = await blogsService.update(id, updatedBlog);
          setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)));
          setIsLoading(false);
        } catch (error) {
          handleApiErrors(error, id);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [blogs, handleApiErrors, queueAlerts]
  );

  const deleteBlog = useCallback(
    async (event, id, title) => {
      const titleToShow = title.length > 45 ? `${title.slice(0, 44)}… ` : title;
      const willDelete = window.confirm(`Delete ${titleToShow}?`);

      if (!willDelete) return;
      setIsLoading(true);

      try {
        await blogsService.remove(id);
        setBlogs(blogs.filter((blog) => blog.id !== id));
        setIsLoading(false);
        queueAlerts([
          { type: "info", message: `Deleted Blog: ${titleToShow}` },
        ]);
      } catch (error) {
        setIsLoading(false);
        handleApiErrors(error, id);
      } finally {
        setIsLoading(true);
      }
    },
    [blogs, handleApiErrors, queueAlerts]
  );

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    const changeFuncs = {
      username: () => setUsername(value),
      password: () => setPassword(value),
      title: () => setBlogTitle(value),
      author: () => setBlogAuthor(value),
      url: () => setBlogUrl(value),
    };

    const hasHandler = Object.keys(changeFuncs).includes(name);

    if (!hasHandler) {
      throw new Error("Invalid Input Change Handler");
    } else {
      changeFuncs[name]();
    }
  }, []);

  const ShowBlogFormBtn = () => (
    <>
      <button
        type="button"
        className="c-btn c-btn--success"
        onClick={() => blogFormRef.current.toggleVisibility()}
      >
        + Blog
      </button>
    </>
  );

  const HideBlogFormBtn = () => (
    <>
      <button
        type="button"
        className="c-btn"
        onClick={() => blogFormRef.current.toggleVisibility()}
      >
        Cancel
      </button>
    </>
  );

  const blogForm = () => (
    <Toggleable
      ref={blogFormRef}
      cb={resetBlogForm}
      contextClass="inBlogForm"
      buttons={{ show: <ShowBlogFormBtn />, hide: <HideBlogFormBtn /> }}
    >
      <BlogForm
        values={{ blogTitle, blogAuthor, blogUrl }}
        handleChange={handleChange}
        handleSubmit={addBlog}
      />
    </Toggleable>
  );

  const blogsSortedByLikesDesc = [...blogs].sort((currBlog, nextBlog) => {
    return nextBlog.likes - currBlog.likes;
  });

  return (
    <>
      {!user && (
        <div className="o-container js-container">
          <AlertList contextClass="c-alert--inLogin" alerts={alerts} />

          <Login
            values={{ username, password }}
            handleChange={handleChange}
            handleSubmit={login}
          />

          {isLoggingIn && <ModalSpinner />}
        </div>
      )}

      {user && (
        <div className="o-container js-container">
          <UserContext.Provider value={user}>
            <NavBar
              handleLogout={logout}
              brandTitle="Blog List"
              isLoading={isLoading}
            />
            <div className="c-blogs">
              <AlertList contextClass="c-alert--inBlog" alerts={alerts} />
              {blogForm()}
              <BlogList
                blogs={blogsSortedByLikesDesc}
                isLoading={isLoading}
                handleLike={likeBlog}
                handleDelete={deleteBlog}
              />
            </div>
          </UserContext.Provider>

          <ToTopScroller ref={toTopScrollerRef} />
        </div>
      )}
    </>
  );
}

App.whyDidYouRender = true;

export default App;
