import React, { useState, useEffect, useRef } from "react";
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
  const getAllBooks = useQuery(GET_ALL_BOOKS);
  const hasRunGetAllBooks = useRef(false);

  useEffect(() => {
    if (getAllBooks.data) {
      const books = getAllBooks.data.allBooks;
      setBooks(books);
      hasRunGetAllBooks.current = true;
    }
  }, [getAllBooks.data]);

  const hasNoBooks = hasRunGetAllBooks.current && !books.length;

  return (
    <>
      <Helmet>
        <title>GraphQL Library | Books</title>
      </Helmet>
      <LinkedNavBar />
      <Notifications />
      <Container>
        <Row className="mt-4">
          <Col>
            <div className="d-flex align-items-center">
              <h1 className="h2 mr-2">Books</h1>
              {getAllBooks.loading && (
                <Spinner animation="grow" role="status" size="sm">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              )}
            </div>

            {hasNoBooks && <NoResource resource="books" />}

            {books.length > 0 && <BooksTable books={books} />}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Books;
