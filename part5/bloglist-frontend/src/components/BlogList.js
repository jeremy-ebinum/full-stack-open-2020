import React from "react";
import PropTypes from "prop-types";
import Blog from "./Blog";

const BlogList = ({ blogs, isLoading, handleLike, handleDelete }) => {
  return (
    <div className="c-blogs__list">
      <h2 className="c-blogs__heading">Blogs</h2>

      {!isLoading && !blogs.length && (
        <p className="u-lead">No Blogs have been added yet</p>
      )}

      {blogs.map((blog) => {
        return (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        );
      })}
    </div>
  );
};

BlogList.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

const shouldNotUpdate = (prevProps, nextProps) => {
  const sameLoadingStatus = prevProps.isLoading === nextProps.isLoading;
  const sameBlogs = prevProps.blogs.length === nextProps.blogs.length;

  if (sameBlogs && sameLoadingStatus) {
    return true;
  }

  return false;
};

export default React.memo(BlogList, shouldNotUpdate);
