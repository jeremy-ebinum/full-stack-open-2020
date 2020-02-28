import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import { getTrimmedStr, getCancelTokenSource } from "../helpers/helper";
import anecdotesService from "../services/anecdotes";
import { createAnecdote } from "../reducers/anecdoteReducer";
import { queueNotification } from "../reducers/notificationReducer";
import {
  CreateAnecdoteButton,
  Form,
  FormRow,
  AnecdoteInput,
  AnecdotesFormContainer,
} from "./Styles";

const AnecdoteForm = ({ dispatch }) => {
  const ref = useRef();

  useEffect(() => {
    ref.current.focus();
  }, []);

  const addAnecdote = async (event) => {
    event.preventDefault();
    const content = ref.current.value;
    let message;
    try {
      if (content.length < 2) {
        message = "Content is too short";
        return queueNotification(dispatch, message, "warning");
      }
      const source = getCancelTokenSource();
      const newAnecdote = await anecdotesService.create(content, source.token);
      dispatch(createAnecdote(newAnecdote));
      ref.current.value = "";
      const contentToShow = getTrimmedStr(content);
      message = `You added "${contentToShow}"`;
      queueNotification(dispatch, message, "success");
    } catch (e) {
      console.error(e.message);
    }
  };

  return (
    <AnecdotesFormContainer column>
      <Form onSubmit={addAnecdote}>
        <FormRow>
          <AnecdoteInput
            ref={ref}
            as="textarea"
            aria-label="Enter new anecdote"
            name="anecdote"
            placeholder="Everything is easy unless you need to do it yourself..."
          />
        </FormRow>
        <CreateAnecdoteButton type="submit">ADD ANECDOTE</CreateAnecdoteButton>
      </Form>
    </AnecdotesFormContainer>
  );
};

export default connect()(AnecdoteForm);
