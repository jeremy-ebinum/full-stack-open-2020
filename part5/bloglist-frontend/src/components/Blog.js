import React from "react";

const Blog = ({ blog }) => (
  <div className="c-blog">
    <a
      className="c-blog__link"
      href={blog.url}
      target="_blank"
      rel="noreferrer noopener"
    >
      {blog.title}
    </a>
    <span className="c-blog__author">by {blog.author}</span>
  </div>
);

export default Blog;
