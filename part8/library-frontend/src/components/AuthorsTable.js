import React from "react";
import PropTypes from "prop-types";

import Table from "react-bootstrap/Table";

const AuthorsTable = ({ authors }) => {
  return (
    <Table responsive striped bordered hover variant="dark">
      <caption>List of Authors</caption>
      <thead>
        <tr>
          <th>Name</th>
          <th>Birth Year</th>
          <th>Books</th>
        </tr>
      </thead>
      <tbody>
        {authors.map((a) => (
          <tr key={a.id}>
            <td>{a.name}</td>
            <td>{a.born}</td>
            <td>{a.bookCount}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

AuthorsTable.propTypes = {
  authors: PropTypes.arrayOf(PropTypes.object),
};

export default AuthorsTable;
