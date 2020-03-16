import React from "react";

const Person = (props) => {
  return (
    <div className="c-person">
      <span className="c-person__detail">
        <span className="u-bold">{props.name}:</span>
      </span>
      <span className="c-person__detail">
        <span className="u-italic">{props.number}, </span>
      </span>
      <div className="c-person__delete">
        <div className="c-person__delete-btn">
          <button
            className="c-btn c-btn--danger"
            data-id={props.id}
            onClick={props.handleClick}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Persons = ({ persons, handleClick }) => {
  const personsList = persons.map((person) => {
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

  return (
    <div className="c-persons">
      <h3 className="c-persons__heading">Contact List</h3>
      {personsList}
    </div>
  );
};

export default Persons;
