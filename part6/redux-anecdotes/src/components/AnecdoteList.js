import React from "react";
import { getTrimmedStr } from "../helpers/helper";
import { queueNotification } from "../reducers/notificationReducer";
import { voteFor } from "../reducers/anecdoteReducer";
import { Card, Container, Heading, PrimaryButton, Txt } from "./Styles";

const AnecdoteList = ({ store }) => {
  const { anecdotes, filter } = store.getState();
  const anecdotesByVotesDesc = anecdotes.sort((a, b) => b.votes - a.votes);
  const anecdotesToShow = anecdotesByVotesDesc.filter((a) => {
    if (filter === "") return true;
    return a.content.toLowerCase().includes(filter.toLowerCase());
  });

  const vote = (anecdote) => {
    const id = anecdote.id;
    store.dispatch(voteFor(id));
    const contentToShow = getTrimmedStr(anecdote.content);
    const message = `You voted for "${contentToShow}"`;
    queueNotification(store, "info", message);
  };
  return (
    <>
      <Heading>Anecdotes</Heading>
      {anecdotesToShow.map((anecdote) => (
        <Card key={anecdote.id}>
          <Container>
            <Txt>{anecdote.content}</Txt>
          </Container>
          <Container align="center" margin="0.25rem 0">
            <Txt>Has {anecdote.votes} votes</Txt>
            <PrimaryButton
              type="button"
              margin="0.5rem"
              onClick={() => vote(anecdote)}
            >
              vote
            </PrimaryButton>
          </Container>
        </Card>
      ))}
    </>
  );
};

export default AnecdoteList;
