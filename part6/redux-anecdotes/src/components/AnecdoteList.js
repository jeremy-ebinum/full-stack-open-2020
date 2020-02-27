import React from "react";
import { connect } from "react-redux";
import { getTrimmedStr } from "../helpers/helper";
import { queueNotification } from "../reducers/notificationReducer";
import { voteFor } from "../reducers/anecdoteReducer";
import { Card, Container, Heading, PrimaryButton, Txt } from "./Styles";

const AnecdoteList = (props) => {
  const vote = (id) => {
    const content = props.anecdotesToShow.find((a) => a.id === id).content;
    props.dispatch(voteFor(id));
    const contentToShow = getTrimmedStr(content);
    const message = `You voted for "${contentToShow}"`;
    queueNotification(props.dispatch, message, "info");
  };

  return (
    <>
      <Heading>Anecdotes</Heading>
      {props.anecdotesToShow.map((anecdote) => (
        <Card key={anecdote.id}>
          <Container>
            <Txt>{anecdote.content}</Txt>
          </Container>
          <Container align="center" margin="0.25rem 0">
            <Txt>Has {anecdote.votes} votes</Txt>
            <PrimaryButton
              type="button"
              margin="0.5rem"
              onClick={() => vote(anecdote.id)}
            >
              vote
            </PrimaryButton>
          </Container>
        </Card>
      ))}
    </>
  );
};

const mapStateToProps = (state) => {
  const { anecdotes, filter } = state;
  const anecdotesByVotesDesc = anecdotes.sort((a, b) => b.votes - a.votes);
  const anecdotesToShow = anecdotesByVotesDesc.filter((a) => {
    if (filter === "") return true;
    return a.content.toLowerCase().includes(filter.toLowerCase());
  });

  return { anecdotesToShow };
};

export default connect(mapStateToProps)(AnecdoteList);
