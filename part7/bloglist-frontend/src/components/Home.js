import React, { useLayoutEffect } from "react";
import NavBar from "./NavBar";
import NotificationList from "./NotificationList";
import BlogForm from "./BlogForm";
import BlogList from "./BlogList";
import ToTopScroller from "./ToTopScroller";
import { getTestIDs } from "../helpers/testHelper";

export const testIDs = getTestIDs();

const Home = () => {
  useLayoutEffect(() => {
    const rootStyle = document.documentElement.style;
    document.title = "Blog List | Home";

    rootStyle.setProperty("--body-bg-color", "var(--light-color)");
  }, []);

  return (
    <div className="o-wrapper js-wrapper">
      <NavBar />
      <div className="o-container js-container">
        <div className="c-blogs" data-testid={testIDs.Home_blogs}>
          <NotificationList />
          <BlogForm />
          <BlogList />
        </div>

        <ToTopScroller />
      </div>
    </div>
  );
};

export default Home;
