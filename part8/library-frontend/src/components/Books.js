import React from "react";
import { Helmet } from "react-helmet-async";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import LinkedNavBar from "./LinkedNavBar";

const Books = () => {
  const books = [];

  return (
    <>
      <Helmet>
        <title>GraphQL Library | Books</title>
      </Helmet>
      <LinkedNavBar />
      <Container>
        <Row>
          <Col>
            <h2>books</h2>
            <table>
              <tbody>
                <tr>
                  <th></th>
                  <th>author</th>
                  <th>published</th>
                </tr>
                {books.map((a) => (
                  <tr key={a.title}>
                    <td>{a.title}</td>
                    <td>{a.author}</td>
                    <td>{a.published}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Books;
