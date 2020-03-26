import React, { useState, useEffect } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

import { GET_ALL_AUTHORS, ON_BOOK_ADDED } from "../queries";

import LinkedNavBar from "./LinkedNavBar";
import Notifications from "./Notifications";
import AuthorsTable from "./AuthorsTable";
import AuthorsForm from "./AuthorsForm";
import NoResource from "./NoResource";

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [hasNoAuthors, setHasNoAuthors] = useState(false);
  const getAllAuthors = useQuery(GET_ALL_AUTHORS);

  useSubscription(ON_BOOK_ADDED, {
    onSubscriptionData: () => {
      getAllAuthors.refetch();
    },
  });

  useEffect(() => {
    if (getAllAuthors.networkStatus > 6) {
      const authors = getAllAuthors.data ? getAllAuthors.data.allAuthors : [];
      setHasNoAuthors(authors.length === 0);
      setAuthors(authors);
    }
  }, [getAllAuthors.networkStatus, getAllAuthors.data]);

  return (
    <>
      <Helmet>
        <title>GraphQL Library | Home</title>
      </Helmet>
      <LinkedNavBar />

      <Notifications />

      <Container>
        <Row className="my-4">
          <Col>
            <h1 className="d-inline h2 mr-2">Authors</h1>
            {getAllAuthors.loading && (
              <Spinner animation="grow" role="status" size="sm">
                <span className="sr-only">Loading...</span>
              </Spinner>
            )}
            <hr></hr>

            {hasNoAuthors && <NoResource resource="authors" />}

            {authors.length > 0 && (
              <>
                <AuthorsForm authors={authors} />
                <AuthorsTable authors={authors} />
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Authors;
