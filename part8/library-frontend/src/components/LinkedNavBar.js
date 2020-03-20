import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useUIDSeed } from "react-uid";
import Container from "react-bootstrap/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

const LinkedNavBar = () => {
  const uidSeed = useUIDSeed();
  const { pathname } = useLocation();

  return (
    <Navbar collapseOnSelect variant="dark" bg="dark" expand="md" sticky="top">
      <Container fluid>
        <Navbar.Brand>GraphQL Library</Navbar.Brand>
        <Navbar.Toggle aria-controls={uidSeed("navbar-collapse")} />
        <Navbar.Collapse id={uidSeed("navbar-collapse")}>
          <Nav className="mr-auto">
            <Nav.Link
              to="/"
              as={Link}
              active={pathname === "/"}
              className="mr-2"
            >
              <FontAwesomeIcon icon="feather-alt" /> Authors
            </Nav.Link>
            <Nav.Link
              to="/books"
              as={Link}
              active={pathname === "/books"}
              className="mr-2"
            >
              <FontAwesomeIcon icon="book" /> Books
            </Nav.Link>
            <Nav.Link
              to="/add"
              as={Link}
              active={pathname === "/add"}
              className="mr-2"
            >
              <FontAwesomeIcon icon="plus-circle" /> Add Book
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default LinkedNavBar;
