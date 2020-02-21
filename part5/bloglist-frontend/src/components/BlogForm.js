import React from "react";
import PropTypes from "prop-types";
import { useUIDSeed } from "react-uid";
import Input from "./Input";

const BlogForm = ({ values, handleChange, handleSubmit }) => {
  const uidSeed = useUIDSeed();

  return (
    <form className="c-blog-form" onSubmit={handleSubmit}>
      <h2 className="c-blog-form__heading">Add New Blog</h2>
      <div className="c-row c-row--inBlog">
        <label htmlFor={uidSeed("title")} className="c-row__label">
          Title
        </label>
        <Input
          name="title"
          id={uidSeed("title")}
          contextClass="c-row__input--inBlog"
          handleChange={handleChange}
          value={values.blogTitle}
        />
      </div>
      <div className="c-row c-row--inBlog">
        <label htmlFor={uidSeed("author")} className="c-row__label">
          Author
        </label>
        <Input
          name="author"
          id={uidSeed("author")}
          contextClass="c-row__input--inBlog"
          handleChange={handleChange}
          value={values.blogAuthor}
        />
      </div>
      <div className="c-row c-row--inBlog">
        <label htmlFor={uidSeed("url")} className="c-row__label">
          URL
        </label>
        <Input
          id={uidSeed("url")}
          type="url"
          name="url"
          contextClass="c-row__input--inBlog"
          handleChange={handleChange}
          value={values.blogUrl}
        />
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
  values: PropTypes.objectOf(PropTypes.string).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default BlogForm;
