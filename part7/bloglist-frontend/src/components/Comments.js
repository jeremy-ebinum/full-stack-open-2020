import React, { useRef, useCallback } from "react";
import { connect } from "react-redux";
import { uid } from "react-uid";
import { commentBlog } from "../reducers/blogReducer";
import { getTestIDs } from "../helpers/testHelper";

export const testIDs = getTestIDs();

const Comments = ({ id, comments, commentBlog }) => {
  const commentRef = useRef();
  const fieldClassName = "c-row__input inBlog asTextarea";

  const addComment = useCallback(
    (event) => {
      event.preventDefault();
      const comment = commentRef.current.value;
      commentBlog(id, comment);
      commentRef.current.value = "";
    },
    [id, commentBlog]
  );

  return (
    <div className="c-comments">
      <h2 className="c-comments__heading">Add A Comment</h2>
      <form className="c-comments__form" data-testid={testIDs.Comments_form}>
        <div className="c-row inBlog">
          <textarea
            ref={commentRef}
            className={`${fieldClassName}`}
            aria-label="comment"
            data-testid={testIDs.Comments_input}
          />
        </div>

        <div className="c-comments__submit">
          <button
            type="submit"
            className="c-btn c-btn--success"
            onClick={addComment}
            data-testid={testIDs.Comments_submitButton}
          >
            Add Comment
          </button>
        </div>
      </form>

      <div className="c-comments__list" data-testid={testIDs.Comments_list}>
        {comments.map((comment) => (
          <p className="c-comments__comment" key={comment.id}>
            {comment.message}
          </p>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps;

  let comments = [];
  const blog = state.blogs.find((blog) => blog.id === id);

  if (blog) {
    comments = blog.comments.map((comment) => {
      return { id: uid({}), message: comment };
    });
  }

  return { id, comments };
};

export default connect(mapStateToProps, { commentBlog })(Comments);
