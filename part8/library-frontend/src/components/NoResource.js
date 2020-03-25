import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";

import useAuthUser from "../hooks/useAuthUser";

const NoResource = ({ resource }) => {
  const { user, hasSyncAuth } = useAuthUser();

  if (!hasSyncAuth) return null;
  return (
    <Jumbotron>
      <p className="lead">There are currently no {resource} to display.</p>
      <p>
        {user && (
          <Button variant="primary" as={Link} to="/new">
            Add a new Book
          </Button>
        )}
        {!user && (
          <Button
            variant="primary"
            as={Link}
            to={{
              pathname: "/login",
              state: { from: "/new" },
            }}
          >
            Login to add a new Book
          </Button>
        )}
      </p>
    </Jumbotron>
  );
};

NoResource.propTypes = {
  resource: PropTypes.string.isRequired,
};

export default NoResource;
