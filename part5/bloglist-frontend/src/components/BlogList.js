import React from "react";
import Blog from "./Blog";

const BlogList = ({ blogs, isLoading, handleLike, handleDelete }) => {
  return (
    <div className="c-blogs__list">
      <h2 className="c-blogs__heading">Blogs</h2>

      {!isLoading && !blogs.length && (
        <p className="u-lead">No Blogs have been added yet</p>
      )}

      {blogs.map(blog => {
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

export default BlogList;
