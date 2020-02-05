import React, { useState } from "react";

const Person = props => {
  return (
    <>
      {props.name} {props.number}
      <br />
    </>
  );
};

const initialPersons = [
  { name: "Arto Hellas", number: "040-123456" },
  { name: "Ada Lovelace", number: "39-44-5323523" },
  { name: "Dan Abramov", number: "12-43-234345" },
  { name: "Mary Poppendieck", number: "39-23-6423122" }
];

const App = () => {
  const [persons, setPersons] = useState(initialPersons);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const names = persons.map(person => {
    return person.name.toLocaleLowerCase();
  });

  const personsList = persons.map(person => {
    return (
      <Person key={person.name} name={person.name} number={person.number} />
    );
  });

  const handleChange = (event, type) => {
    switch (type) {
      case "name":
        setNewName(event.target.value);
        break;
      case "number":
        setNewNumber(event.target.value);
        break;
      default:
        break;
    }
  };

  const createNewPerson = () => {
    const replacer = (match, p1, p2) => {
      return p1.toUpperCase() + p2.toLocaleLowerCase();
    };

    const titleCasedName = newName.replace(/\b([a-zA-Z])(\w+)/g, replacer);

    const person = {
      name: titleCasedName,
      number: newNumber
    };

    return person;
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (names.includes(newName.toLocaleLowerCase())) {
      alert(`${newName} is already added to the phonebook.`);
    } else {
      const person = createNewPerson();
      setPersons([...persons].concat(person));
    }

    setNewName("");
    setNewNumber("");
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={event => handleSubmit(event)}>
        <div>
          Name:{" "}
          <input
            onChange={event => handleChange(event, "name")}
            value={newName}
          />
        </div>
        <div>
          Number:{" "}
          <input
            onChange={event => handleChange(event, "number")}
            value={newNumber}
          />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personsList}
    </div>
  );
};

export default App;