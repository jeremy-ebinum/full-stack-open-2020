import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";

const NoResource = ({ resource }) => {
  return (
    <Jumbotron>
      <p className="lead">There are currently no {resource} to display.</p>
      <p>
        <Button variant="primary" as={Link} to="/add">
          Add a new Book
        </Button>
      </p>
    </Jumbotron>
  );
};

NoResource.propTypes = {
  resource: PropTypes.string.isRequired,
};

export default NoResource;
