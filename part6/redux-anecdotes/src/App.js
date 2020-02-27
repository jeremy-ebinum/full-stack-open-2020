import React from "react";
import { GlobalStyles, Wrapper } from "./components/Styles";
import { MainHeading } from "./components/Styles";
import Notification from "./components/Notification";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Filter from "./components/Filter";

const App = () => {
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

export default App;
