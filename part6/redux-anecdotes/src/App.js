import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { initializeAnecdotes } from "./reducers/anecdoteReducer";
import { GlobalStyles, Wrapper } from "./components/Styles";
import { MainHeading } from "./components/Styles";
import ProgressBar from "./components/ProgressBar";
import Notification from "./components/Notification";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import ModalSpinner from "./components/ModalSpinner";
import Filter from "./components/Filter";

const App = ({ isFetchingAnecdotes, initializeAnecdotes }) => {
  useEffect(() => {
    initializeAnecdotes();
  }, [initializeAnecdotes]);

  return (
    <>
      <GlobalStyles />
      <ProgressBar />
      <Wrapper>
        <MainHeading>Programming Anecdotes</MainHeading>
        <Notification />
        <AnecdoteForm />
        <Filter />
        <AnecdoteList />
        {isFetchingAnecdotes && <ModalSpinner />}
      </Wrapper>
    </>
  );
};

const mapStateToProps = (state) => {
  return { isFetchingAnecdotes: state.requests.initAnecdotes.isLoading };
};

App.propTypes = {
  isFetchingAnecdotes: PropTypes.bool.isRequired,
  initializeAnecdotes: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
  initializeAnecdotes,
})(App);
