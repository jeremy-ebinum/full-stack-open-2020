import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { likeBlog, deleteBlog } from "../reducers/blogReducer";
import { getTestIDs } from "../helpers/testHelper";

export const testIDs = getTestIDs();

const Blog = ({ blog, user, likeBlog, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const belongsToUser = blog.user.username === user.username;

  const toggleShowDetails = (event) => {
    const isBlogLink = event.target.classList.contains("js-blogLink");
    const isLikeButton = event.target.classList.contains("js-likeButton");
    const isDeleteButton = event.target.classList.contains("js-deleteButton");

    if (isBlogLink || isLikeButton || isDeleteButton) return;
    setShowDetails((prevState) => !prevState);
  };

  const focusBlog = (event) => {
    if (event.keyCode === 13 || event.keyCode === 32) {
      event.preventDefault();
      event.target.click();
    }
  };

  const like = () => {
    likeBlog(blog.id);
  };

  const remove = () => {
    deleteBlog(blog.id);
  };

  const displayBlog = () => {
    if (!showDetails) {
      return (
        <>
          <span className="c-blog__title">{blog.title}</span>
          <span className="c-blog__author">
            {" — "}
            {blog.author}
          </span>
          <FontAwesomeIcon className="c-blog__expandicon" icon={faAngleDown} />
        </>
      );
    }

    return (
      <>
        <span className="c-blog__title">{blog.title}</span>

        <span className="c-blog__author">
          {" — "}
          {blog.author}
        </span>

        <a
          className="c-blog__link js-blogLink"
          href={blog.url}
          target="_blank"
          rel="noreferrer noopener"
        >
          Visit Blog
        </a>

        <div className="c-blog__likes">
          <span className="c-blog__likes-txt">
            {blog.likes}
            {blog.likes !== 1 ? " Likes" : " Like"}
          </span>
          <div className="c-blog__like-button">
            <button
              type="button"
              onClick={like}
              className="c-btn c-btn--info js-likeButton"
            >
              Like
            </button>
          </div>
        </div>

        <span className="c-blog__user">
          Added by:
          <FontAwesomeIcon className="c-blog__usericon" icon={faUser} />
          {belongsToUser ? "You" : blog.user.name}
        </span>

        {belongsToUser && (
          <div className="c-blog__delete-button">
            <button
              type="button"
              onClick={remove}
              className="c-btn c-btn--danger js-deleteButton"
            >
              Delete
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div
      role="button"
      aria-expanded={showDetails ? "true" : "false"}
      tabIndex={0}
      onKeyDown={focusBlog}
      onClick={toggleShowDetails}
      className="c-blog js-blog"
      data-testid={testIDs[`blog_${blog.id}`]}
    >
      {displayBlog()}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any),
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
};

Blog.defaultProps = {
  user: null,
};

const mapStateToProps = (state) => {
  const { user } = state.auth;

  return { user };
};

export default connect(mapStateToProps, { likeBlog, deleteBlog })(Blog);
