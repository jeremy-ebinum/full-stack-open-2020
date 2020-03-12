import React, { useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import NavBar from "./NavBar";
import NotFound from "./NotFound";

const User = ({ user, hasLoaded }) => {
  useLayoutEffect(() => {
    const rootStyle = document.documentElement.style;

    rootStyle.setProperty("--body-bg-color", "var(--light-color)");
  }, []);

  return (
    <div className="o-wrapper js-wrapper">
      <NavBar />
      <div className="o-container js-container">
        {hasLoaded && !user && <NotFound />}

        {user && (
          <div className="c-user">
            <h2 className="c-user__heading">
              <FontAwesomeIcon icon={faUser} /> {user.name}
            </h2>
            <div className="c-user__blogs">
              <h3 className="c-user__blogs-heading">Added Blogs</h3>
              {user.blogs.map((blog) => (
                <Link key={blog.id} to={`#`} className="c-blog js-blog asLink">
                  <span className="c-blog__title">{blog.title}</span>
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
