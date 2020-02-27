import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import { getTrimmedStr } from "../helpers/helper";
import { createAnecdote } from "../reducers/anecdoteReducer";
import { queueNotification } from "../reducers/notificationReducer";
import {
  Heading,
  CreateAnecdoteButton,
  Form,
  FormRow,
  AnecdoteInput,
} from "./Styles";

const AnecdoteForm = (props) => {
  const ref = useRef();

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <>
      <Heading>Add New Anecdote</Heading>
      <Form onSubmit={props.newAnecdote}>
        <FormRow>
          <AnecdoteInput
            ref={ref}
            as="textarea"
            aria-label="Enter new anecdote"
            name="anecdote"
            placeholder="Everything is easy unless you need to do it yourself..."
          />
        </FormRow>
        <CreateAnecdoteButton type="submit">create</CreateAnecdoteButton>
      </Form>
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  const newAnecdote = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    let message;

    if (content.length < 2) {
      message = "Content is too short";
      return queueNotification(dispatch, message, "info");
    }

    dispatch(createAnecdote(content));
    event.target.anecdote.value = "";
    const contentToShow = getTrimmedStr(content);
    message = `You added "${contentToShow}"`;
    queueNotification(dispatch, message, "success");
  };

  return { newAnecdote };
};

export default connect(null, mapDispatchToProps)(AnecdoteForm);
