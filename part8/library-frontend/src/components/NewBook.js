import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const NewBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuhtor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const submit = async (event) => {
    event.preventDefault();

    console.log("add book...");

    setTitle("");
    setPublished("");
    setAuhtor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <>
      <Helmet>
        <title>GraphQL Library | Add New Book</title>
      </Helmet>
      <Row>
        <Col>
          <form onSubmit={submit}>
            <div>
              title
              <input
                value={title}
                onChange={({ target }) => setTitle(target.value)}
              />
            </div>
            <div>
              author
              <input
                value={author}
                onChange={({ target }) => setAuhtor(target.value)}
              />
            </div>
            <div>
              published
              <input
                type="number"
                value={published}
                onChange={({ target }) => setPublished(target.value)}
              />
            </div>
            <div>
              <input
                value={genre}
                onChange={({ target }) => setGenre(target.value)}
              />
              <button onClick={addGenre} type="button">
                add genre
              </button>
            </div>
            <div>genres: {genres.join(" ")}</div>
            <button type="submit">create book</button>
          </form>
        </Col>
      </Row>
    </>
  );
};

export default NewBook;
