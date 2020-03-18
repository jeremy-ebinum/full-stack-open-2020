import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useField } from "../hooks";

const CreateNew = ({ addNew }) => {
  const [content, resetContent] = useField();
  const [author, resetAuthor] = useField();
  const [info, resetInfo] = useField({ type: "url" });

  const history = useHistory();

  const resetForm = useCallback(() => {
    resetContent();
    resetAuthor();
    resetInfo();
  }, [resetContent, resetAuthor, resetInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    });
    resetForm();
    history.push("/");
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={resetForm}>
          reset
        </button>
      </form>
    </div>
  );
};

export default CreateNew;
