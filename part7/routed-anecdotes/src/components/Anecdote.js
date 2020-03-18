import React from "react";

const Anecdote = ({ anecdote, vote }) => (
  <>
    {!anecdote && <p>Anecdote does not exist</p>}

    {anecdote && (
      <div>
        <h2>
          {anecdote.content} by {anecdote.author}
        </h2>
        <p>
          has {anecdote.votes} {anecdote.votes === 1 ? "vote" : "votes"}
          <button style={{ marginLeft: 5 }} onClick={() => vote(anecdote.id)}>
            vote
          </button>
        </p>
        <p>
          for more info see{" "}
          <a href={anecdote.info} target="_blank" rel="noopener noreferrer">
            {anecdote.info}
          </a>
        </p>
      </div>
    )}
  </>
);

export default Anecdote;
