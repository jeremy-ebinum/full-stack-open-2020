import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

import { GET_ALL_BOOKS } from "../queries";
import LinkedNavBar from "./LinkedNavBar";
import Notifications from "./Notifications";
import BooksTable from "./BooksTable";
import NoResource from "./NoResource";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [hasNoBooks, setHasNoBooks] = useState(false);
  const getAllBooks = useQuery(GET_ALL_BOOKS);

  useEffect(() => {
    if (getAllBooks.networkStatus > 6) {
      const books = getAllBooks.data ? getAllBooks.data.allBooks : [];
      setHasNoBooks(books.length === 0);
      setBooks(books);
    }
  }, [getAllBooks.networkStatus, getAllBooks.data]);

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
            {getAllBooks.loading && (
              <Spinner animation="grow" role="status" size="sm">
                <span className="sr-only">Loading...</span>
              </Spinner>
            )}
            <hr />

            {hasNoBooks && <NoResource resource="books" />}

            {books.length > 0 && <BooksTable books={books} />}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Books;
