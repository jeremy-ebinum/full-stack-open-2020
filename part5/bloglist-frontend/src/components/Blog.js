import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { getTestIDs } from "../helpers/testHelper";
import UserContext from "../UserContext";

export const testIDs = getTestIDs();

const Blog = ({ blog, handleLike, handleDelete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const user = useContext(UserContext);

  const belongsToUser = blog.user.username === user.username;

  const toggleShowDetails = (event) => {
    const isBlogLink = event.target.classList.contains("js-blogLink");
    const isLikeButton = event.target.classList.contains("js-likeButton");
    const isDeleteButton = event.target.classList.contains("js-deleteButton");

    if (isBlogLink || isLikeButton || isDeleteButton) return;
    setShowDetails(!showDetails);
  };

  const focusBlog = (event) => {
    if (event.keyCode === 13 || event.keyCode === 32) {
      event.target.click();
    }
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
              onClick={(event) => handleLike(event, blog.id)}
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
              onClick={(event) => handleDelete(event, blog.id, blog.title)}
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
      onKeyDown={(event) => focusBlog(event)}
      onClick={(event) => toggleShowDetails(event)}
      className="c-blog js-blog"
      data-testid={testIDs[`blog_${blog.id}`]}
    >
      {displayBlog()}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object])
  ).isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleLike: PropTypes.func.isRequired,
};

export default Blog;
