import React from "react";
import PropTypes from "prop-types";
import { useUIDSeed } from "react-uid";

const BlogForm = ({ title, author, url, handleSubmit }) => {
  const uidSeed = useUIDSeed();

  return (
    <form className="c-blog-form" onSubmit={handleSubmit}>
      <h2 className="c-blog-form__heading">Add New Blog</h2>
      <div className="c-row c-row--inBlog">
        <label htmlFor={uidSeed("title")} className="c-row__label">
          Title
        </label>
        <input {...title} id={uidSeed("title")} />
      </div>
      <div className="c-row c-row--inBlog">
        <label htmlFor={uidSeed("author")} className="c-row__label">
          Author
        </label>
        <input {...author} id={uidSeed("author")} />
      </div>
      <div className="c-row c-row--inBlog">
        <label htmlFor={uidSeed("url")} className="c-row__label">
          URL
        </label>
        <input {...url} id={uidSeed("url")} />
      </div>

      <div className="c-blog-form__submit">
        <button type="submit" className="c-btn c-btn--success">
          Create
        </button>
      </div>
    </form>
  );
};

BlogForm.propTypes = {
  title: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.func])
  ).isRequired,
  author: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.func])
  ).isRequired,
  url: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.func])
  ).isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

const shouldNotUpdate = (prevProps, nextProps) => {
  const sameTitle = prevProps.title.value === nextProps.title.value;
  const sameAuthor = prevProps.author.value === nextProps.author.value;
  const sameUrl = prevProps.url.value === nextProps.url.value;

  if (sameTitle && sameAuthor && sameUrl) {
    return true;
  }

  return false;
};

export default React.memo(BlogForm, shouldNotUpdate);
