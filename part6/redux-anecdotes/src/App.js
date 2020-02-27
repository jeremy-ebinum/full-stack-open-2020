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

const App = ({ store }) => {
  return (
    <>
      <GlobalStyles />
      <Wrapper>
        <Notification store={store} />
        <AnecdotesFormContainer column>
          <AnecdoteForm store={store} />
        </AnecdotesFormContainer>
        <AnecdotesListContainer column>
          <AnecdoteList store={store} />
        </AnecdotesListContainer>
      </Wrapper>
    </>
  );
};

export default App;
