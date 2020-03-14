import React, { useLayoutEffect } from "react";
import NavBar from "./NavBar";
import NotificationList from "./NotificationList";

const NotFound = () => {
  useLayoutEffect(() => {
    const rootStyle = document.documentElement.style;
    document.title = "Blog List | Not Found";

    rootStyle.setProperty("--body-bg-color", "var(--light-color)");
  }, []);

  return (
    <div className="o-wrapper js-wrapper">
      <NavBar />
      <div className="o-container js-container">
        <NotificationList />
        <div className="c-notfound">
          <h2 className="c-notfound__heading">Not Found</h2>
          <p className="u-lead">
            Sorry, The Page You Are Looking For Does Not Exist
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
