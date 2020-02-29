import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import {
  CreateAnecdoteButton,
  Form,
  FormRow,
  AnecdoteInput,
  AnecdotesFormContainer,
} from "./StyledComponents";

const AnecdoteForm = ({ createAnecdote }) => {
  const anecdoteInputRef = useRef();
  useEffect(() => {
    anecdoteInputRef.current.focus();

    return () => {};
  }, []);

  const addAnecdote = async (event) => {
    event.preventDefault();
    const content = anecdoteInputRef.current.value;
    createAnecdote(content);
    anecdoteInputRef.current.value = "";
  };

  return (
    <AnecdotesFormContainer column>
      <Form onSubmit={addAnecdote}>
        <FormRow>
          <AnecdoteInput
            ref={anecdoteInputRef}
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

AnecdoteForm.propTypes = {
  createAnecdote: PropTypes.func.isRequired,
};

export default connect(null, { createAnecdote })(AnecdoteForm);
