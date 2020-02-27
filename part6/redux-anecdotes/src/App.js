import React from "react";
import {
  GlobalStyles,
  Wrapper,
  AnecdotesListContainer,
  AnecdotesFormContainer,
} from "./components/Styles";
import Notification from "./components/Notification";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Filter from "./components/Filter";

const App = ({ store }) => {
  return (
    <>
      <GlobalStyles />
      <Wrapper>
        <Notification />
        <AnecdotesFormContainer column>
          <AnecdoteForm />
        </AnecdotesFormContainer>
        <Filter />
        <AnecdotesListContainer column>
          <AnecdoteList />
        </AnecdotesListContainer>
      </Wrapper>
    </>
  );
};

export default App;
