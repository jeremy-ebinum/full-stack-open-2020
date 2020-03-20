import React from "react";
import { Switch, Route, Link, useLocation } from "react-router-dom";
import { useUIDSeed } from "react-uid";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";

const App = () => {
  const uidSeed = useUIDSeed();
  const { pathname } = useLocation();

  return (
    <>
      <Navbar
        collapseOnSelect
        variant="dark"
        bg="dark"
        expand="md"
        sticky="top"
      >
        <Container fluid>
          <Navbar.Brand>GraphQL Library</Navbar.Brand>
          <Navbar.Toggle aria-controls={uidSeed("navbar-collapse")} />
          <Navbar.Collapse id={uidSeed("navbar-collapse")}>
            <Nav className="mr-auto">
              <Nav.Link to="/" as={Link} active={pathname === "/"}>
                Authors
              </Nav.Link>
              <Nav.Link to="/books" as={Link} active={pathname === "/books"}>
                Books
              </Nav.Link>
              <Nav.Link to="/add" as={Link} active={pathname === "/add"}>
                Add Book
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Switch>
          <Route path="/" exact>
            <Authors />
          </Route>
          <Route path="/books" exact>
            <Books />
          </Route>
          <Route path="/add" exact>
            <NewBook />
          </Route>
        </Switch>
      </Container>
    </>
  );
};

export default App;
