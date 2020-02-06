import React, { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personsService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  useEffect(() => {
    personsService.getAll().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  // const lowerCasedNames = persons.map(person => {
  //   return person.name.toLocaleLowerCase();
  // });

  const filteredPersons = persons.filter(person => {
    return person.name.toLocaleLowerCase().includes(nameFilter.toLowerCase());
  });

  const handleChange = (event, type) => {
    switch (type) {
      case "nameFilter":
        setNameFilter(event.target.value);
        break;
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

  const confirmAndUpdatePerson = () => {
    const person = persons.find(
      p => p.name.toLowerCase() === newName.toLowerCase()
    );
    const wantsToUpdate = window.confirm(
      `${person.name} is alrady added to the phonebook, ` +
        "replace the old number with a new one?"
    );

    if (wantsToUpdate) {
      const updatedPerson = { ...person, number: newNumber };
      const id = person.id;
      return personsService
        .update(id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => (p.id !== id ? p : returnedPerson)));
          return true;
        })
        .catch(error => {
          console.error(error);
          alert(`The person ${person.name} does not exist on the server`);
          setPersons(persons.filter(p => p.id !== id));
        });
    } else {
      return Promise.resolve(false);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();

    const nameExists = persons.some(
      p => p.name.toLowerCase() === newName.toLowerCase()
    );

    if (nameExists) {
      confirmAndUpdatePerson().then(wasUpdated => {
        if (wasUpdated) console.log("Person Updated Successfully");
        else console.log("User Opted Not To Update Person");
      });
    } else {
      const person = createNewPerson();
      personsService.create(person).then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
      });
    }

    setNewName("");
    setNewNumber("");
  };

  const removePersonWithId = id => {
    let deleted = true;

    personsService
      .remove(id)
      .catch(err => {
        console.log(err);
        deleted = false;
      })
      .finally(() => {
        if (deleted) {
          setPersons(persons.filter(p => p.id !== id));
        }
      });
  };

  const handleClick = (event, type) => {
    switch (type) {
      case "deletePerson":
        const id = parseInt(event.target.dataset.id);
        if (Number.isNaN(id) || !id) break;
        const person = persons.find(p => p.id === id);
        const wantsToDelete = window.confirm(`Delete ${person.name}?`);
        if (wantsToDelete) removePersonWithId(id);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter
        handleFilterChange={event => handleChange(event, "nameFilter")}
        value={nameFilter}
      />

      <h3>Add a New:</h3>

      <PersonForm
        nameValue={newName}
        numberValue={newNumber}
        handleSubmit={event => handleSubmit(event)}
        handleNameChange={event => handleChange(event, "name")}
        handleNumberChange={event => handleChange(event, "number")}
      />

      <h3>Numbers</h3>

      <Persons
        persons={filteredPersons}
        handleClick={event => handleClick(event, "deletePerson")}
      />
    </div>
  );
};

export default App;
