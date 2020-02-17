import React from "react";
import Blog from "./Blog";

const BlogList = props => {
  const blogs = props.blogs.map(blog => {
    return <Blog key={blog.id} blog={blog} />;
  });

  return (
    <div className="c-blogs__list">
      <h1 className="c-blogs__heading">Blogs</h1>
      {!blogs.length && <p className="u-lead">No Blogs have been added yet</p>}
      {blogs}
    </div>
  );
};

export default BlogList;
