import React, { useState } from "react";

const Person = props => {
  return (
    <>
      {props.name}
      <br />
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }]);
  const [newName, setNewName] = useState("");
  const names = persons.map(person => {
    return person.name.toLocaleLowerCase();
  });

  const personsList = persons.map(person => {
    return <Person key={person.name} name={person.name} />;
  });

  const handleChange = event => {
    setNewName(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (names.includes(newName.toLocaleLowerCase())) {
      alert(`${newName} is already added to the phonebook.`);
    } else {
      const replacer = (match, p1, p2) => {
        return p1.toUpperCase() + p2.toLocaleLowerCase();
      };

      const titleCasedName = newName.replace(/\b([a-zA-Z])(\w+)/g, replacer);

      const person = {
        name: titleCasedName
      };

      setPersons([...persons].concat(person));
    }

    setNewName("");
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={event => handleSubmit(event)}>
        <div>
          name:{" "}
          <input onChange={event => handleChange(event)} value={newName} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personsList}
    </div>
  );
};

export default App;
