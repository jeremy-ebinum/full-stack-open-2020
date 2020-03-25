import React, { useCallback } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import { useUIDSeed } from "react-uid";
import Container from "react-bootstrap/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

import useAuthUser from "../hooks/useAuthUser";

const LinkedNavBar = () => {
  const uidSeed = useUIDSeed();
  const { pathname } = useLocation();
  const history = useHistory();
  const client = useApolloClient();
  const { user, hasSyncAuth } = useAuthUser();

  const logout = useCallback(() => {
    localStorage.removeItem("fso20-gqlLibrary-user-token");
    history.push("/login");
    client.resetStore();
  }, [client, history]);

  return (
    <Navbar collapseOnSelect variant="dark" bg="dark" expand="lg" sticky="top">
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
            {user && (
              <>
                <Nav.Link
                  to="/new"
                  as={Link}
                  active={pathname === "/new"}
                  className="mr-2"
                >
                  <FontAwesomeIcon icon="plus-circle" /> Add Book
                </Nav.Link>
                <Nav.Link
                  to="/recommended"
                  as={Link}
                  active={pathname === "/recommended"}
                  className="mr-2"
                >
                  <FontAwesomeIcon icon="star" /> Recommended
                </Nav.Link>
              </>
            )}
          </Nav>
          <>
            {hasSyncAuth && user && (
              <Nav>
                <Nav.Item>
                  <Navbar.Text className="font-weight-bold">
                    Signed in as {user.username}
                  </Navbar.Text>
                  <Button
                    variant="light"
                    size="sm"
                    className="ml-3"
                    onClick={logout}
                  >
                    <span className="text-uppercase font-weight-bold">
                      Logout
                    </span>
                  </Button>
                </Nav.Item>
              </Nav>
            )}
            {hasSyncAuth && !user && (
              <Nav>
                <Nav.Item>
                  <Button
                    as={Link}
                    size="sm"
                    variant="light"
                    to={{
                      pathname: "/login",
                      state: { from: pathname },
                    }}
                  >
                    <span className="text-uppercase font-weight-bold">
                      Login
                    </span>
                  </Button>
                </Nav.Item>
              </Nav>
            )}
          </>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default LinkedNavBar;
