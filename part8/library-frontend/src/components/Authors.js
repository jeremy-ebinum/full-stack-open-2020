import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

import { GET_ALL_AUTHORS } from "../queries";
import LinkedNavBar from "./LinkedNavBar";
import AuthorsTable from "./AuthorsTable";
import NoResource from "./NoResource";

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const hasRunGetAllAuthors = useRef(false);
  const getAllAuthors = useQuery(GET_ALL_AUTHORS);

  useEffect(() => {
    if (getAllAuthors.data) {
      const authors = getAllAuthors.data.allAuthors;
      setAuthors(authors);
      hasRunGetAllAuthors.current = true;
    }
  }, [getAllAuthors.data]);

  const hasNoAuthors = hasRunGetAllAuthors.current && !authors.length;

  return (
    <>
      <Helmet>
        <title>GraphQL Library | Home</title>
      </Helmet>
      <LinkedNavBar />
      <Container>
        <Row className="mt-4">
          <Col>
            <div className="d-flex align-items-center">
              <h2 className="mr-2">Authors</h2>
              {getAllAuthors.loading && (
                <Spinner animation="grow" role="status" size="sm">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              )}
            </div>

            {hasNoAuthors && <NoResource resource="authors" />}

            {authors.length > 0 && <AuthorsTable authors={authors} />}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Authors;
