import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { voteForAnecdote } from "../reducers/anecdoteReducer";
import {
  Card,
  Container,
  PrimaryButton,
  Txt,
  AnecdotesListContainer,
} from "./StyledComponents";

const AnecdoteList = ({ anecdotesToShow, voteForAnecdote }) => {
  const vote = (id) => {
    voteForAnecdote(id);
  };

  return (
    <AnecdotesListContainer>
      {anecdotesToShow.map((anecdote) => (
        <Card key={anecdote.id}>
          <Container>
            <Txt>{anecdote.content}</Txt>
          </Container>
          <Container align="center" margin="0.25rem 0">
            <Txt weight={700}>Has {anecdote.votes} votes</Txt>
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
    </AnecdotesListContainer>
  );
};

const mapStateToProps = (state) => {
  const { anecdotes, filter } = state;
  const anecdotesByVotesDesc = [...anecdotes].sort((a, b) => b.votes - a.votes);
  const anecdotesToShow = anecdotesByVotesDesc.filter((a) => {
    if (filter === "") return true;
    return a.content.toLowerCase().includes(filter.toLowerCase());
  });

  return { anecdotesToShow };
};

AnecdoteList.propTypes = {
  anecdotesToShow: PropTypes.arrayOf(PropTypes.object).isRequired,
  voteForAnecdote: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { voteForAnecdote })(AnecdoteList);
