import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { getTestIDs } from "../helpers/testHelper";
import UserContext from "../UserContext";

export const testIDs = getTestIDs();

const Blog = ({ blog, handleLike, handleDelete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const user = useContext(UserContext);

  const belongsToUser = blog.user.username === user.username;

  const toggleShowDetails = (event) => {
    setShowDetails((prevState) => !prevState);
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
          <div className="c-blog__show">
            <button
              className="c-btn"
              type="button"
              onClick={toggleShowDetails}
              data-testid={testIDs[`Blog_${blog.id}_viewButton`]}
            >
              View
            </button>
          </div>
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
          data-testid={testIDs[`Blog_${blog.id}_url`]}
        >
          Visit Blog
        </a>

        <div className="c-blog__hide">
          <button
            className="c-btn c-btn--transparent"
            type="button"
            onClick={toggleShowDetails}
            data-testid={testIDs[`Blog_${blog.id}_hideButton`]}
          >
            Hide
          </button>
        </div>

        <div className="c-blog__likes">
          <span
            className="c-blog__likes-txt"
            data-testid={testIDs[`Blog_${blog.id}_likesTxt`]}
          >
            {blog.likes}
            {blog.likes !== 1 ? " Likes" : " Like"}
          </span>
          <div className="c-blog__like-button">
            <button
              type="button"
              onClick={(event) => handleLike(event, blog.id)}
              className="c-btn c-btn--info js-likeButton"
              data-testid={testIDs[`Blog_${blog.id}_likeButton`]}
            >
              Like
            </button>
          </div>
        </div>

        <span
          className="c-blog__user"
          data-testid={testIDs[`Blog_${blog.id}_user`]}
        >
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
              data-testid={testIDs[`Blog_${blog.id}_deleteButton`]}
            >
              Delete
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="c-blog js-blog" data-testid={testIDs[`Blog_${blog.id}`]}>
      {displayBlog()}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.objectOf(PropTypes.any).isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleLike: PropTypes.func.isRequired,
};

export default Blog;
