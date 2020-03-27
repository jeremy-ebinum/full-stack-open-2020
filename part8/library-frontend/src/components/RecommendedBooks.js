import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Redirect, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

import { GET_ALL_BOOKS } from "../graphql/queries";
import useAuthUser from "../hooks/useAuthUser";
import LinkedNavBar from "./LinkedNavBar";
import Notifications from "./Notifications";
import BooksTable from "./BooksTable";
import NoResource from "./NoResource";

const RecommendedBooks = () => {
  const [books, setBooks] = useState([]);
  const [hasNoBooks, setHasNoBooks] = useState(false);
  const getAllBooks = useQuery(GET_ALL_BOOKS);
  const { user, hasSyncAuth } = useAuthUser();
  const { pathname } = useLocation();

  useEffect(() => {
    const { called, networkStatus, data } = getAllBooks;
    if (called && networkStatus > 6) {
      const newBooks = data ? data.allBooks : books;
      setHasNoBooks(books.length === 0);
      setBooks(newBooks);
    }
  }, [books, getAllBooks]);

  if (!hasSyncAuth) return null;

  if (hasSyncAuth && !user)
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: { from: pathname },
        }}
      />
    );

  const booksToShow = books.filter((b) =>
    b.genres.includes(user.favoriteGenre)
  );

  return (
    <>
      <Helmet>
        <title>GraphQL Library | Recommended Books</title>
      </Helmet>
      <LinkedNavBar />
      <Notifications />
      <Container>
        <Row className="my-4">
          <Col>
            <h1 className="d-inline h2 mr-2">Recommended Books</h1>
            {getAllBooks.loading && (
              <Spinner animation="grow" variant="info" role="status" size="sm">
                <span className="sr-only">Loading...</span>
              </Spinner>
            )}
            <hr />

            {hasNoBooks && <NoResource resource="books" />}

            <p className="lead">
              In your favorite genre:
              <span className="font-weight-bold ml-2">
                {user.favoriteGenre}
              </span>
            </p>
            {booksToShow.length > 0 && <BooksTable books={booksToShow} />}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RecommendedBooks;
