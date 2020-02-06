import React from "react";

const Person = props => {
  return (
    <div>
      <strong>Name:</strong> {props.name} <strong>Number:</strong>{" "}
      {props.number}{" "}
      <button data-id={props.id} onClick={props.handleClick}>
        Delete
      </button>
    </div>
  );
};

const Persons = ({ persons, handleClick }) => {
  const personsList = persons.map(person => {
    return (
      <Person
        key={person.id}
        id={person.id}
        name={person.name}
        number={person.number}
        handleClick={handleClick}
      />
    );
  });

  return <div>{personsList}</div>;
};

export default Persons;
