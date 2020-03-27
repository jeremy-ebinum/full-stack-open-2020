import React, { useState, useEffect } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

import { GET_ALL_AUTHORS, ON_BOOK_ADDED } from "../graphql/queries";

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
    const { called, networkStatus, data } = getAllAuthors;
    if (called && networkStatus > 6) {
      const newAuthors = data ? data.allAuthors : authors;
      setHasNoAuthors(newAuthors.length === 0);
      setAuthors(newAuthors);
    }
  }, [authors, getAllAuthors]);

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
              <Spinner variant="info" animation="grow" role="status" size="sm">
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
