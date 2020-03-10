import React, { useEffect, useLayoutEffect, useRef } from "react";
import { connect } from "react-redux";
import { getTestIDs } from "./helpers/testHelper";
import { cancelRequest } from "./reducers/requestReducer";
import { initBlogs } from "./reducers/blogReducer";
import ToTopScroller from "./components/ToTopScroller";
import NavBar from "./components/NavBar";
import NotificationList from "./components/NotificationList";
import Login from "./components/Login";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";

export const testIDs = getTestIDs();

const App = ({ isAuth, initBlogs }) => {
  const toTopScrollerRef = useRef();

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

      if (!isAuth || !toTopScrollerRef.current) return;

      if (percentScrollTop > 10) {
        toTopScrollerRef.current.show();
      } else {
        toTopScrollerRef.current.hide();
      }
    };

    if (isAuth) {
      rootStyle.setProperty("--body-bg-color", "var(--light-color)");
      window.addEventListener("scroll", handleScroll);
    } else {
      rootStyle.setProperty("--body-bg-color", "var(--primary-color-faded)");
    }
  }, [isAuth]);

  return (
    <div className="o-wrapper js-wrapper">
      {!isAuth && (
        <div className="o-container js-container">
          <NotificationList contextClass="inLogin" />
          <Login />
        </div>
      )}

      {isAuth && (
        <div className="o-container js-container">
          <NavBar />
          <div className="c-blogs" data-testid={testIDs.blogs}>
            <NotificationList contextClass="inBlog" />
            <BlogForm />
            <BlogList />
          </div>

          <ToTopScroller ref={toTopScrollerRef} />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  const isAuth = state.auth.isAuth;

  return { isAuth };
};

export default connect(mapStateToProps, { initBlogs })(App);
