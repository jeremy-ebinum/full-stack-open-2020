import React from "react";
import { createAnecdote } from "./reducers/anecdoteReducer";

const App = (props) => {
  const store = props.store;
  const anecdotes = store.getState();

  const vote = (id) => {
    // console.log("vote", id);
    store.dispatch({ type: "VOTE", id });
  };

  const newAnecdote = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    store.dispatch(createAnecdote(content));
    event.target.anecdote.value = "";
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
      <h2>create new</h2>
      <form onSubmit={newAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default App;
