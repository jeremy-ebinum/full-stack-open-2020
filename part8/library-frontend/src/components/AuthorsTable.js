import React from "react";
import Table from "react-bootstrap/Table";

const AuthorsTable = ({ authors }) => {
  return (
    <Table responsive striped bordered hover variant="dark">
      <thead>
        <tr>
          <th></th>
          <th>born</th>
          <th>books</th>
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

export default AuthorsTable;
