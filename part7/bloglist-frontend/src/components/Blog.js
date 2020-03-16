import React, { useLayoutEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { likeBlog, deleteBlog } from "../reducers/blogReducer";
import { getTestIDs } from "../helpers/testHelper";
import { getTrimmedStr } from "../utils";
import NavBar from "./NavBar";
import NotificationList from "./NotificationList";
import NotFound from "./NotFound";
import Comments from "./Comments";

export const testIDs = getTestIDs();

const Blog = ({ blog, belongsToUser, hasLoaded, likeBlog, deleteBlog }) => {
  useLayoutEffect(() => {
    const rootStyle = document.documentElement.style;
    let blogName;

    if (blog) {
      blogName = getTrimmedStr(blog.title);
    }

    document.title = `Blog List | ${blogName}`;

    rootStyle.setProperty("--body-bg-color", "var(--light-color)");
  }, [blog]);

  const like = () => {
    likeBlog(blog.id);
  };

  const remove = () => {
    deleteBlog(blog.id);
  };

  return (
    <div className="o-wrapper js-wrapper">
      <NavBar />
      <div className="o-container js-container">
        <NotificationList />
        {hasLoaded && !blog && <NotFound />}
        {blog && (
          <div className="c-blog">
            <h2 className="c-blog__heading">
              <span className="c-blog__title">{blog.title}</span>
              <span className="c-blog__author">
                {" — "}
                {blog.author}
              </span>
            </h2>

            <div className="c-blog__details">
              <a
                className="c-blog__url"
                href={blog.url}
                target="_blank"
                rel="noreferrer noopener"
                data-testid={testIDs.Blog_urlAnchor}
              >
                Visit Blog
              </a>

              <div className="c-blog__likes">
                <span
                  className="c-blog__likes-txt"
                  data-testid={testIDs.Blog_likesTxt}
                >
                  {blog.likes}
                  {blog.likes !== 1 ? " Likes" : " Like"}
                </span>
                <div className="c-blog__like-button">
                  <button
                    type="button"
                    onClick={like}
                    className="c-btn c-btn--info"
                    data-testid={testIDs.Blog_likeButton}
                  >
                    Like
                  </button>
                </div>
              </div>

              <div className="c-blog__userinfo">
                <span className="c-blog__user">
                  Added by
                  <FontAwesomeIcon className="c-blog__usericon" icon={faUser} />
                  {belongsToUser ? "You" : blog.user.name}
                </span>

                {belongsToUser && (
                  <div className="c-blog__delete-button">
                    <button
                      type="button"
                      onClick={remove}
                      className="c-btn c-btn--danger"
                      data-testid={testIDs.Blog_deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <Comments id={blog.id} />
          </div>
        )}
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.objectOf(PropTypes.any),
  belongsToUser: PropTypes.bool.isRequired,
  hasLoaded: PropTypes.bool.isRequired,
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
};

Blog.defaultProps = {
  blog: null,
};

const mapStateToProps = (state, ownProps) => {
  const { user } = state.auth;
  const { blogs, requests } = state;

  let belongsToUser = false;

  const id = ownProps.match.params.id;
  const blog = blogs.find((blog) => blog.id === id);

  if (blog) {
    belongsToUser = user.username === blog.user.username;
  }

  const hasLoaded = requests.initBlogs.hasRun;

  return { hasLoaded, belongsToUser, blog };
};

export default connect(mapStateToProps, { likeBlog, deleteBlog })(Blog);
