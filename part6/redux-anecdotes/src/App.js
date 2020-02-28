import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCancelTokenSource } from "./helpers/helper";
import anecdotesService from "./services/anecdotes";
import { initializeAnecdotes } from "./reducers/anecdoteReducer";
import { setInitLoading } from "./reducers/loadingReducer";
import { GlobalStyles, Wrapper } from "./components/Styles";
import { MainHeading } from "./components/Styles";
import ProgressBar from "./components/ProgressBar";
import Notification from "./components/Notification";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import ModalSpinner from "./components/ModalSpinner";
import Filter from "./components/Filter";

const App = ({ isFetchingAnecdotes, initializeAnecdotes, setInitLoading }) => {
  const isMounted = useRef();

  useEffect(() => {
    isMounted.current = true;
    const source = getCancelTokenSource();
    setInitLoading(true);

    const fetchAnecdotes = async () => {
      try {
        const anecdotes = await anecdotesService.getAll(source.token);
        if (isMounted.current) initializeAnecdotes(anecdotes);
      } catch (e) {
        console.error(e.message);
      } finally {
        setInitLoading(false);
      }
    };

    fetchAnecdotes();

    return () => {
      source.cancel();
      setInitLoading(false);
      isMounted.current = false;
    };
  }, [initializeAnecdotes, setInitLoading]);

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
  return { isFetchingAnecdotes: state.loading.isInitLoading };
};

App.propTypes = {
  isFetchingAnecdotes: PropTypes.bool.isRequired,
  initializeAnecdotes: PropTypes.func.isRequired,
  setInitLoading: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
  initializeAnecdotes,
  setInitLoading,
})(App);
