import React from "react";
import { Link } from "react-router-dom";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";

const AuthorsJumbotron = () => {
  return (
    <Jumbotron>
      <p className="lead">There are currently no authors to display.</p>
      <p>
        <Button variant="primary" as={Link} to="/add">
          Add a new Book
        </Button>
      </p>
    </Jumbotron>
  );
};

export default AuthorsJumbotron;
