import React, { useRef, useEffect } from "react";
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

const AnecdoteForm = ({ store }) => {
  const ref = useRef();

  const newAnecdote = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    store.dispatch(createAnecdote(content));
    event.target.anecdote.value = "";
    const contentToShow = getTrimmedStr(content);
    const message = `You added "${contentToShow}"`;
    queueNotification(store, "success", message);
  };

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <>
      <Heading>Add New Anecdote</Heading>
      <Form onSubmit={newAnecdote}>
        <FormRow>
          <AnecdoteInput
            ref={ref}
            as="textarea"
            aria-label="Enter new anecdote"
            name="anecdote"
            placeholder="Everything is easy unless you need to do it yourself..."
            minLength="10"
          />
        </FormRow>
        <CreateAnecdoteButton type="submit">create</CreateAnecdoteButton>
      </Form>
    </>
  );
};

export default AnecdoteForm;
