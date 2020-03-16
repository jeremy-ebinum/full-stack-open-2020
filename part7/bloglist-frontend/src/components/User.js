import React, { useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import NavBar from "./NavBar";
import NotificationList from "./NotificationList";
import NotFound from "./NotFound";

const User = ({ user, hasLoaded }) => {
  useLayoutEffect(() => {
    const rootStyle = document.documentElement.style;
    let profileName;

    if (user) {
      profileName = user.name || user.username;
    } else {
      profileName = "User";
    }
    document.title = `Blog List | ${profileName}`;
    rootStyle.setProperty("--body-bg-color", "var(--light-color)");
  }, [user]);

  return (
    <div className="o-wrapper js-wrapper">
      <NavBar />
      <div className="o-container js-container">
        <NotificationList />
        {hasLoaded && !user && <NotFound />}

        {user && (
          <div className="c-user">
            <h2 className="c-user__heading">
              <FontAwesomeIcon icon={faUser} /> {user.name}
            </h2>
            <div className="c-user__blogs">
              <h3 className="c-user__blogs-heading">Added Blogs</h3>
              {!user.blogs.length && (
                <p className="u-lead">This user has not created any blogs</p>
              )}
              {user.blogs.map((blog) => (
                <Link
                  key={blog.id}
                  to={`/blogs/${blog.id}`}
                  className="c-blog-link"
                >
                  {blog.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const { users, requests } = state;

  const user = users.find((user) => user.id === id);
  const hasLoaded = requests.initUsers.hasRun;

  return { user, hasLoaded };
};

User.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
  hasLoaded: PropTypes.bool.isRequired,
};

User.defaultProps = {
  user: null,
};

export default connect(mapStateToProps)(User);
