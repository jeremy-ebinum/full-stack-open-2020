import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getTestIDs } from "../helpers/testHelper";
import PropTypes from "prop-types";

export const testIDs = getTestIDs();

const BlogList = ({ hasLoaded, blogsToShow }) => {
  return (
    <div className="c-blogs__list" data-testid={testIDs.BlogList_container}>
      <h2 className="c-blogs__heading">Blogs</h2>

      {hasLoaded && !blogsToShow.length && (
        <p className="u-lead">No Blogs have been added yet</p>
      )}

      {blogsToShow.map((blog) => (
        <Link
          key={blog.id}
          to={`/blogs/${blog.id}`}
          className="c-blog-link"
          data-testid={testIDs[`BlogList_blogLink_${blog.id}`]}
        >
          {blog.title}
        </Link>
      ))}
    </div>
  );
};

BlogList.propTypes = {
  hasLoaded: PropTypes.bool.isRequired,
  blogsToShow: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = (state) => {
  const { blogs } = state;

  const blogsSortedByLikesDesc = [...blogs].sort((currBlog, nextBlog) => {
    return nextBlog.likes - currBlog.likes;
  });

  const hasLoaded = state.requests.initBlogs.hasRun;

  return {
    hasLoaded,
    blogsToShow: blogsSortedByLikesDesc,
  };
};

const areStatePropsEqual = (next, prev) => {
  const sameLoading = prev.hasLoaded === next.hasLoaded;

  const sameBlogsLength = prev.blogsToShow.length === next.blogsToShow.length;

  const hasUpdatedBlogs = prev.blogsToShow.some((blog, index) => {
    if (sameBlogsLength) {
      return blog.likes !== next.blogsToShow[index].likes;
    } else {
      return true;
    }
  });

  return sameLoading && sameBlogsLength && !hasUpdatedBlogs;
};

const options = {
  pure: true,
  areStatePropsEqual,
};

export default connect(mapStateToProps, null, null, options)(BlogList);
