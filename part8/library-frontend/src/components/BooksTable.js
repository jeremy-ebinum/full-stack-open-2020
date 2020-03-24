import React from "react";
import PropTypes from "prop-types";

import Table from "react-bootstrap/Table";

const BooksTable = ({ books }) => {
  return (
    <Table responsive striped bordered hover variant="light">
      <caption>List of Books</caption>
      <thead className="thead-dark">
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Published</th>
        </tr>
      </thead>
      <tbody>
        {books.map((b) => (
          <tr key={b.id}>
            <td>{b.title}</td>
            <td>{b.author.name}</td>
            <td>{b.published}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

BooksTable.propTypes = {
  books: PropTypes.arrayOf(PropTypes.object),
};

export default BooksTable;
