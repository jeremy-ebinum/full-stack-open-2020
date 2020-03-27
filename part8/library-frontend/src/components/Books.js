import React, { useState, useCallback, useEffect } from "react";
import { useLazyQuery, useSubscription } from "@apollo/client";
import { useUIDSeed } from "react-uid";
import { Helmet } from "react-helmet-async";
import Select from "react-select";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

import { GET_ALL_BOOKS, ON_BOOK_ADDED } from "../graphql/queries";
import useBookGenres from "../hooks/useBookGenres";
import LinkedNavBar from "./LinkedNavBar";
import Notifications from "./Notifications";
import BooksTable from "./BooksTable";
import NoResource from "./NoResource";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [hasNoBooks, setHasNoBooks] = useState(false);
  const [genre, setGenre] = useState(null);
  const { genres, hasGenres } = useBookGenres();
  const [getAllBooks, getAllBooksResults] = useLazyQuery(GET_ALL_BOOKS);
  const uidSeed = useUIDSeed();

  useSubscription(ON_BOOK_ADDED, {
    onSubscriptionData: () => {
      getAllBooks();
    },
  });

  useEffect(() => {
    getAllBooks({ variables: { genre } });
  }, [genre, getAllBooks]);

  useEffect(() => {
    const { called, data, networkStatus } = getAllBooksResults;
    if (called && networkStatus > 6) {
      const books = data ? data.allBooks : [];
      setHasNoBooks(books.length === 0);
      setBooks(books);
    }
  }, [getAllBooksResults]);

  const generateOptions = useCallback(() => {
    const defaultOption = [{ value: 0, label: "all" }];

    let options = defaultOption;

    if (hasGenres) {
      const genreOptions = genres.map((g, idx) => {
        return { value: idx + 1, label: g };
      });
      options = defaultOption.concat(genreOptions);
    }

    return options;
  }, [genres, hasGenres]);

  const filterByGenre = useCallback((option, action) => {
    const genre = option.label === "all" ? null : option.label;
    setGenre(genre);
  }, []);

  return (
    <>
      <Helmet>
        <title>GraphQL Library | Books</title>
      </Helmet>
      <LinkedNavBar />
      <Notifications />
      <Container>
        <Row className="my-4">
          <Col>
            <h1 className="d-inline h2 mr-2">Books</h1>
            {getAllBooksResults.loading && (
              <Spinner animation="grow" variant="info" role="status" size="sm">
                <span className="sr-only">Loading...</span>
              </Spinner>
            )}
            <hr />

            {hasNoBooks && <NoResource resource="books" />}

            {books.length > 0 && (
              <>
                <Row className="mb-4 align-items-center">
                  <Col xs={12} className="mb-2">
                    <span id={uidSeed("genre-filter")} className="lead">
                      Filter Books by Genre:
                    </span>
                  </Col>
                  <Col sm={10} md={5}>
                    <Select
                      name="genres"
                      options={generateOptions()}
                      onChange={filterByGenre}
                      defaultValue={generateOptions()[0]}
                      aria-labelledby={uidSeed("genre-filter")}
                      isLoading={getAllBooksResults.loading}
                    />
                  </Col>
                </Row>
                <BooksTable books={books} />
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Books;
