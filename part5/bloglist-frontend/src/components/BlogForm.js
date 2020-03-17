import React, { useState } from "react";
import PropTypes from "prop-types";
import { useUIDSeed } from "react-uid";
import { getTestIDs } from "../helpers/testHelper";

export const testIDs = getTestIDs();

const BlogForm = ({ createBlog }) => {
  const fieldClassName = "c-row__input c-row__input--inBlog";

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleTitleChange = ({ target }) => {
    setTitle(target.value);
  };

  const handleAuthorChange = ({ target }) => {
    setAuthor(target.value);
  };

  const handleUrlChange = ({ target }) => {
    setUrl(target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    createBlog({ title, author, url });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  const uidSeed = useUIDSeed();

  return (
    <form
      className="c-blog-form"
      onSubmit={handleSubmit}
      data-testid={testIDs.BlogForm_form}
    >
      <h2 className="c-blog-form__heading">Add New Blog</h2>
      <div className="c-row c-row--inBlog">
        <label htmlFor={uidSeed("title")} className="c-row__label">
          Title
        </label>
        <input
          id={uidSeed("title")}
          className={fieldClassName}
          onChange={handleTitleChange}
          value={title}
          data-testid={testIDs.BlogForm_title}
        />
      </div>
      <div className="c-row c-row--inBlog">
        <label htmlFor={uidSeed("author")} className="c-row__label">
          Author
        </label>
        <input
          id={uidSeed("author")}
          className={fieldClassName}
          onChange={handleAuthorChange}
          value={author}
          data-testid={testIDs.BlogForm_author}
        />
      </div>
      <div className="c-row c-row--inBlog">
        <label htmlFor={uidSeed("url")} className="c-row__label">
          URL
        </label>
        <input
          id={uidSeed("url")}
          className={fieldClassName}
          type="url"
          onChange={handleUrlChange}
          value={url}
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
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default React.memo(BlogForm);
