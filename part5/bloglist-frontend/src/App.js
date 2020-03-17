import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
} from "react";
import { useUIDSeed } from "react-uid";
import { getTestIDs } from "./helpers/testHelper";
import { useField } from "./hooks";
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

export const testIDs = getTestIDs();

function App() {
  const [alerts, setAlerts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, resetUsername] = useField({ placeholder: "Enter Username" });
  const [password, resetPassword] = useField({ placeholder: "Enter Password" });

  // const [hasFetchedBlogs, setHasFetchedBlogs] = useState(false);
  const [fetchState, setFetchState] = useState({
    error: null,
    hasRun: false,
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleableBlogFormRef = useRef();
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

      setAlerts((prevAlerts) => prevAlerts.concat(...alertsWithTimeout));
    },
    [uidSeed]
  );

  // Get persisted logged in user from localStorage
  useLayoutEffect(() => {
    const loggedInBloglistUser = localStorage.getItem("loggedInBloglistUser");
    if (loggedInBloglistUser) {
      const storedUser = JSON.parse(loggedInBloglistUser);
      setUser(storedUser);
      blogsService.setToken(storedUser.token);
    }
  }, []);

  // Fetch blogs from backend on initial app load
  useEffect(() => {
    const setInitialBlogs = async () => {
      // setFetchError(null);
      setIsLoading(true);

      try {
        const initialBlogs = await blogsService.getAll();
        setBlogs(initialBlogs);
        setFetchState({ error: null, hasRun: true });
      } catch (error) {
        if (error.response.status >= 400 && error.response.status < 500) {
          setFetchState({ error: error.response.data, hasRun: true });
        } else {
          setFetchState({
            error: { message: "Oops! Something went wrong" },
            hasRun: true,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      setInitialBlogs();
    }
  }, [user]);

  if (fetchState.error) {
    queueAlerts([{ type: "error", message: fetchState.error.message }]);
    setFetchState((prevState) => {
      return { ...prevState, error: null };
    });
  }

  // Handle DOM updates depending on if the login or blogs page is shown
  useLayoutEffect(() => {
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

    if (user) {
      rootStyle.setProperty("--body-bg-color", "var(--light-color)");
      window.addEventListener("scroll", handleScroll);
    } else {
      rootStyle.setProperty("--body-bg-color", "var(--primary-color-faded)");
    }
  }, [user]);

  const handleApiErrors = useCallback(
    (error, id) => {
      const statusCode = error.response.status;

      if (!statusCode) {
        return queueAlerts([
          { type: "error", message: "Oops! something went wrong" },
        ]);
      }

      if (statusCode === 404) {
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
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
    [queueAlerts]
  );

  const login = useCallback(
    async (event) => {
      event.preventDefault();
      setIsLoggingIn(true);

      try {
        const authUser = await loginService.login({
          username: username.value,
          password: password.value,
        });

        blogsService.setToken(authUser.token);
        setUser(authUser);
        localStorage.setItem("loggedInBloglistUser", JSON.stringify(authUser));
        queueAlerts([
          { type: "info", message: `Logged in as ${authUser.username}` },
        ]);
      } catch (error) {
        handleApiErrors(error);
      } finally {
        resetUsername();
        resetPassword();
        setIsLoggingIn(false);
      }
    },
    [
      username.value,
      password.value,
      queueAlerts,
      handleApiErrors,
      resetUsername,
      resetPassword,
    ]
  );

  const logout = useCallback(() => {
    blogsService.setToken(null);
    localStorage.removeItem("loggedInBloglistUser");
    setUser(null);
    queueAlerts([{ type: "info", message: "Logged out" }]);
  }, [queueAlerts]);

  const createBlog = useCallback(
    async (newBlog) => {
      setIsLoading(true);

      try {
        const returnedBlog = await blogsService.create(newBlog);
        setBlogs((prevBlogs) => prevBlogs.concat(returnedBlog));
        toggleableBlogFormRef.current.toggleVisibility();
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
    [queueAlerts, handleApiErrors]
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
        queueAlerts([
          { type: "info", message: `Deleted Blog: ${titleToShow}` },
        ]);
      } catch (error) {
        handleApiErrors(error, id);
      } finally {
        setIsLoading(false);
      }
    },
    [blogs, handleApiErrors, queueAlerts]
  );

  const ShowBlogFormBtn = () => (
    <>
      <button
        type="button"
        className="c-btn c-btn--success"
        onClick={() => toggleableBlogFormRef.current.toggleVisibility()}
        data-testid={testIDs.App_showBlogFormBtn}
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
        onClick={() => toggleableBlogFormRef.current.toggleVisibility()}
        data-testid={testIDs.App_hideBlogFormBtn}
      >
        Hide
      </button>
    </>
  );

  const blogForm = () => (
    <Toggleable
      ref={toggleableBlogFormRef}
      contextClass="inBlogForm"
      buttons={{ show: <ShowBlogFormBtn />, hide: <HideBlogFormBtn /> }}
      testid={testIDs.App_toggleableBlogForm}
    >
      <BlogForm createBlog={createBlog} />
    </Toggleable>
  );

  const blogsSortedByLikesDesc = [...blogs].sort((currBlog, nextBlog) => {
    return nextBlog.likes - currBlog.likes;
  });

  return (
    <div className="o-wrapper js-wrapper">
      {!user && (
        <div className="o-container js-container">
          <AlertList contextClass="c-alert--inLogin" alerts={alerts} />

          <Login username={username} password={password} handleSubmit={login} />

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
            <div className="c-blogs" data-testid={testIDs.App_blogs}>
              <AlertList contextClass="c-alert--inBlog" alerts={alerts} />
              {blogForm()}
              <BlogList
                blogs={blogsSortedByLikesDesc}
                fetchHasRun={fetchState.hasRun}
                handleLike={likeBlog}
                handleDelete={deleteBlog}
              />
            </div>
          </UserContext.Provider>

          <ToTopScroller ref={toTopScrollerRef} />
        </div>
      )}
    </div>
  );
}

export default App;
