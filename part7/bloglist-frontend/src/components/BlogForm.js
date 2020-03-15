import React, { useCallback, useRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useUIDSeed } from "react-uid";
import { createBlog } from "../reducers/blogReducer";
import { getTestIDs } from "../helpers/testHelper";
import Toggleable from "./Toggleable";

export const testIDs = getTestIDs();

const BlogForm = ({ createBlog }) => {
  const uidSeed = useUIDSeed();
  const fieldClassName = "c-row__input inBlog";
  const blogFormRef = useRef();
  const titleRef = useRef();
  const authorRef = useRef();
  const urlRef = useRef();

  const resetBlogForm = useCallback(() => {
    titleRef.current.value = "";
    authorRef.current.value = "";
    urlRef.current.value = "";
  }, []);

  const addBlog = useCallback(
    (event) => {
      event.preventDefault();

      const newBlog = {
        title: titleRef.current.value,
        author: authorRef.current.value,
        url: urlRef.current.value,
      };

      const cb = blogFormRef.current.toggleVisibility;

      createBlog(newBlog, cb);
    },
    [createBlog]
  );

  return (
    <Toggleable
      ref={blogFormRef}
      context="inBlogForm"
      cb={resetBlogForm}
      testid={testIDs.BlogForm_toggleable}
    >
      <form
        className="c-blog-form"
        onSubmit={addBlog}
        data-testid={testIDs.BlogForm_form}
      >
        <h2 className="c-blog-form__heading">Add New Blog</h2>
        <div className="c-row inBlog">
          <label htmlFor={uidSeed("title")} className="c-row__label">
            Title
          </label>
          <input
            ref={titleRef}
            className={`${fieldClassName}`}
            id={uidSeed("title")}
            data-testid={testIDs.BlogForm_title}
          />
        </div>
        <div className="c-row inBlog">
          <label htmlFor={uidSeed("author")} className="c-row__label">
            Author
          </label>
          <input
            ref={authorRef}
            id={uidSeed("author")}
            className={`${fieldClassName}`}
            data-testid={testIDs.BlogForm_author}
          />
        </div>
        <div className="c-row inBlog">
          <label htmlFor={uidSeed("url")} className="c-row__label">
            URL
          </label>
          <input
            ref={urlRef}
            id={uidSeed("url")}
            className={`${fieldClassName}`}
            type="url"
            data-testid={testIDs.BlogForm_url}
          />
        </div>

        <div className="c-blog-form__submit">
          <button
            type="submit"
            className="c-btn c-btn--success"
            data-testid={testIDs.BlogForm_submitButton}
          >
            Create
          </button>
        </div>
      </form>
    </Toggleable>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default connect(null, { createBlog })(BlogForm);
