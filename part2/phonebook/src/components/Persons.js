import React from "react";

const Person = props => {
  return (
    <>
      <strong>Name:</strong> {props.name} <strong>Number:</strong>{" "}
      {props.number}
      <br />
    </>
  );
};

const Persons = ({ persons }) => {
  const personsList = persons.map(person => {
    return (
      <Person key={person.name} name={person.name} number={person.number} />
    );
  });

  return <div>{personsList}</div>;
};

export default Persons;
