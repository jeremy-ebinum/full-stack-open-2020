import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
} from "react";
import { connect } from "react-redux";
import { getTestIDs } from "./helpers/testHelper";
import { logger } from "./utils";
import { useField } from "./hooks";
import UserContext from "./UserContext";
import { displayNotification } from "./reducers/notificationReducer";
import { cancelRequest } from "./reducers/requestReducer";
import { initBlogs } from "./reducers/blogReducer";
import loginService from "./services/login";
import blogsService from "./services/blogs";
import ToTopScroller from "./components/ToTopScroller";
import NavBar from "./components/NavBar";
import NotificationList from "./components/NotificationList";
import Login from "./components/Login";
import ModalSpinner from "./components/ModalSpinner";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";

export const testIDs = getTestIDs();

const App = ({ displayNotification, initBlogs }) => {
  const [user, setUser] = useState(null);
  const [username, resetUsername] = useField({ placeholder: "Enter Username" });
  const [password, resetPassword] = useField({ placeholder: "Enter Password" });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const toTopScrollerRef = useRef();

  // Get persisted logged in user from localStorage
  useEffect(() => {
    const loggedInBloglistUser = localStorage.getItem("loggedInBloglistUser");
    if (loggedInBloglistUser) {
      const storedUser = JSON.parse(loggedInBloglistUser);
      setUser(storedUser);
      blogsService.setToken(storedUser.token);
    }
  }, []);

  // Fetch and Initialize blogs from backend
  useEffect(() => {
    initBlogs();
    return () => {
      cancelRequest("initBlogs");
    };
  }, [initBlogs]);

  // Handle DOM updates depending on if the login or blogs page is shown
  useLayoutEffect(() => {
    const rootStyle = document.documentElement.style;

    const handleScroll = () => {
      const { scrollTop } = document.documentElement;
      const pageHeight = document.documentElement.offsetHeight;
      const percentScrollTop = Math.round((scrollTop / pageHeight) * 100);

      if (!user || !toTopScrollerRef.current) return;

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
        displayNotification(`Logged in as ${authUser.username}`, "info");
      } catch (error) {
        logger.error(error);
      } finally {
        resetUsername();
        resetPassword();
        setIsLoggingIn(false);
      }
    },
    [
      username.value,
      password.value,
      displayNotification,
      resetUsername,
      resetPassword,
    ]
  );

  const logout = useCallback(() => {
    blogsService.setToken(null);
    localStorage.removeItem("loggedInBloglistUser");
    setUser(null);
    displayNotification("Logged out", "info");
  }, [displayNotification]);

  return (
    <div className="o-wrapper js-wrapper">
      {!user && (
        <div className="o-container js-container">
          <NotificationList contextClass="inLogin" />

          <Login username={username} password={password} handleSubmit={login} />

          {isLoggingIn && <ModalSpinner />}
        </div>
      )}

      {user && (
        <div className="o-container js-container">
          <UserContext.Provider value={user}>
            <NavBar handleLogout={logout} />
            <div className="c-blogs" data-testid={testIDs.blogs}>
              <NotificationList contextClass="inBlog" />
              <BlogForm />
              <BlogList />
            </div>
          </UserContext.Provider>

          <ToTopScroller ref={toTopScrollerRef} />
        </div>
      )}
    </div>
  );
};

const mapDispatchToProps = { displayNotification, initBlogs };

export default connect(null, mapDispatchToProps)(App);
