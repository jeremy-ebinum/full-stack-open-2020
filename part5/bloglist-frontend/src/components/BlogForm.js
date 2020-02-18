import React from "react";
import Input from "./Input";

const BlogForm = props => {
  return (
    <form className="c-blog-form" onSubmit={props.handleSubmit}>
      <h2 className="c-blog-form__heading">Add New Blog</h2>
      <div className="c-row c-row--inBlog">
        <label htmlFor="blog-title" className="c-row__label">
          Title
        </label>
        <Input
          id="blog-title"
          contextClass="c-row__input--inBlog"
          handleChange={props.handleTitleChange}
          value={props.titleValue}
        />
      </div>
      <div className="c-row c-row--inBlog">
        <label htmlFor="blog-author" className="c-row__label">
          Author
        </label>
        <Input
          id="blog-author"
          contextClass="c-row__input--inBlog"
          handleChange={props.handleAuthorChange}
          value={props.authorValue}
        />
      </div>
      <div className="c-row c-row--inBlog">
        <label htmlFor="blog-url" className="c-row__label">
          URL
        </label>
        <Input
          type="url"
          id="blog-url"
          contextClass="c-row__input--inBlog"
          handleChange={props.handleUrlChange}
          value={props.urlValue}
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

export default BlogForm;
