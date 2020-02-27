import React from "react";
import { voteFor } from "../reducers/anecdoteReducer";
import { Card, Container, Heading, PrimaryButton, Txt } from "./Styles";

const AnecdoteList = ({ store }) => {
  const anecdotes = store.getState().sort((a, b) => b.votes - a.votes);

  const vote = (id) => {
    store.dispatch(voteFor(id));
  };
  return (
    <>
      <Heading>Anecdotes</Heading>
      {anecdotes.map((anecdote) => (
        <Card key={anecdote.id}>
          <Container>
            <Txt>{anecdote.content}</Txt>
          </Container>
          <Container align="center" margin="0.25rem 0">
            <Txt>Has {anecdote.votes} votes</Txt>
            <PrimaryButton margin="0.5rem" onClick={() => vote(anecdote.id)}>
              vote
            </PrimaryButton>
          </Container>
        </Card>
      ))}
    </>
  );
};

export default AnecdoteList;
