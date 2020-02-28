import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getCancelTokenSource } from "./helpers/helper";
import anecdotesService from "./services/anecdotes";
import { initializeAnecdotes } from "./reducers/anecdoteReducer";
import { GlobalStyles, Wrapper } from "./components/Styles";
import { MainHeading } from "./components/Styles";
import Notification from "./components/Notification";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Filter from "./components/Filter";

const App = (props) => {
  const { initializeAnecdotes } = props;

  useEffect(() => {
    const source = getCancelTokenSource();
    anecdotesService
      .getAll(source.token)
      .then((anecdotes) => initializeAnecdotes(anecdotes));

    return () => {
      source.cancel();
    };
  }, [initializeAnecdotes]);

  return (
    <>
      <GlobalStyles />
      <Wrapper>
        <MainHeading>Programming Anecdotes</MainHeading>
        <Notification />
        <AnecdoteForm />
        <Filter />
        <AnecdoteList />
      </Wrapper>
    </>
  );
};

export default connect(null, { initializeAnecdotes })(App);
