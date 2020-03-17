import React from "react";
import PropTypes from "prop-types";
import Blog from "./Blog";
import { getTestIDs } from "../helpers/testHelper";

export const testIDs = getTestIDs();

const BlogList = ({ fetchHasRun, blogs, handleLike, handleDelete }) => {
  return (
    <div className="c-blogs__list" data-testid={testIDs.BlogList_container}>
      <h2 className="c-blogs__heading">Blogs</h2>

      {fetchHasRun && !blogs.length && (
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
  fetchHasRun: PropTypes.bool.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default React.memo(BlogList);
