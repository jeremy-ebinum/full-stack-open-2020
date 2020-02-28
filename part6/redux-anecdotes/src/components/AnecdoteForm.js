import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getTrimmedStr } from "../helpers/helper";
import { setAddLoading } from "../reducers/loadingReducer";
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
  const anecdoteInputRef = useRef();
  const isMounted = useRef();

  useEffect(() => {
    isMounted.current = true;
    anecdoteInputRef.current.focus();

    return () => {
      dispatch(setAddLoading(false));
      isMounted.current = false;
    };
  }, [dispatch]);

  const addAnecdote = async (event) => {
    event.preventDefault();
    const content = anecdoteInputRef.current.value;
    let message;
    try {
      if (content.length < 2) {
        message = "Content is too short";
        return queueNotification(dispatch, message, "warning");
      }
      dispatch(setAddLoading(true));
      const newAnecdote = await anecdotesService.create(content);
      anecdoteInputRef.current.value = "";
      if (isMounted.current) {
        dispatch(createAnecdote(newAnecdote));
        message = `You added "${getTrimmedStr(content)}"`;
        queueNotification(dispatch, message, "success");
      }
    } catch (e) {
      console.error(e.message);
    } finally {
      dispatch(setAddLoading(false));
    }
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
  dispatch: PropTypes.func.isRequired,
};

export default connect()(AnecdoteForm);
