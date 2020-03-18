import React, { useState } from "react";
import { Route } from "react-router-dom";

import Menu from "./components/Menu";
import AnecdoteList from "./components/AnecdoteList";
import Anecdote from "./components/Anecdote";
import CreateNew from "./components/CreateNew";
import About from "./components/About";
import Footer from "./components/Footer";

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: "If it hurts, do it more often",
      author: "Jez Humble",
      info: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
      votes: 0,
      id: "1",
    },
    {
      content: "Premature optimization is the root of all evil",
      author: "Donald Knuth",
      info: "http://wiki.c2.com/?PrematureOptimization",
      votes: 0,
      id: "2",
    },
  ]);

  const [notification, setNotification] = useState("");

  const addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0);
    setAnecdotes(anecdotes.concat(anecdote));
    const contentToShow =
      anecdote.content.length > 45
        ? anecdote.content.slice(0, 44) + "..."
        : anecdote.content;
    setNotification(`Added "${contentToShow}"`);
    setTimeout(() => {
      setNotification("");
    }, 10000);
  };

  const anecdoteById = (id) => anecdotes.find((a) => a.id === id);

  const vote = (id) => {
    const anecdote = anecdoteById(id);

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1,
    };

    setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)));
  };

  return (
    <div>
      <>
        <h1>Software anecdotes</h1>
        <Menu />
        <div>{notification}</div>
        <Route
          exact
          path="/"
          render={() => <AnecdoteList anecdotes={anecdotes} />}
        />
        <Route
          exact
          path="/anecdotes/:id"
          render={({ match }) => {
            const anecdote = anecdoteById(match.params.id);
            return anecdote ? (
              <Anecdote anecdote={anecdoteById(match.params.id)} vote={vote} />
            ) : (
              <p>Anecdote Not Found</p>
            );
          }}
        ></Route>
        <Route
          exact
          path="/create"
          render={() => <CreateNew addNew={addNew} />}
        />
        <Route exact path="/about" render={() => <About />} />
      </>
      <Footer />
    </div>
  );
};

export default App;
