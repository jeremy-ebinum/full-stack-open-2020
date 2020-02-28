import React, { useEffect } from "react";
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

const App = (props) => {
  const { isFetchingAnecdotes, initializeAnecdotes, setInitLoading } = props;

  useEffect(() => {
    let isCancelled = false;
    const source = getCancelTokenSource();

    const fetchAnecdotes = async () => {
      if (isCancelled) return;
      try {
        setInitLoading(true);
        const anecdotes = await anecdotesService.getAll(source.token);
        initializeAnecdotes(anecdotes);
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
      isCancelled = true;
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

export default connect(mapStateToProps, {
  initializeAnecdotes,
  setInitLoading,
})(App);
