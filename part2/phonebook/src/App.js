import React, { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Alert from "./components/Alert";
import personsService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    personsService.getAll().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  const filteredPersons = persons.filter(person => {
    return person.name.toLowerCase().includes(nameFilter.toLowerCase());
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

  const resetPersonForm = () => {
    setNewName("");
    setNewNumber("");
  };

  const createNewPerson = () => {
    const person = {
      name: newName,
      number: newNumber
    };

    return person;
  };

  const attemptPersonUpdate = () => {
    const person = persons.find(p => p.name === newName);
    const willUpdate = window.confirm(
      `${person.name} is alrady added to the phonebook, ` +
        "replace the old number with a new one?"
    );

    if (willUpdate) {
      const updatedPerson = { ...person, number: newNumber };
      const id = person.id;
      return personsService
        .update(id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => (p.id !== id ? p : returnedPerson)));
          queueAlert(
            `update-${returnedPerson.id}`,
            `info`,
            `${returnedPerson.name}'s number updated to ${returnedPerson.number}`
          );
          return true;
        })
        .catch(error => {
          queueAlert(
            `error-up-${person.id}`,
            "error",
            `Contact "${person.name}" has already been removed from server`
          );
          setPersons(persons.filter(p => p.id !== id));
        });
    } else {
      return Promise.resolve(false);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();

    const nameExists = persons.some(p => p.name === newName);

    if (nameExists) {
      attemptPersonUpdate().then(wasUpdated => {
        if (wasUpdated) console.log("Person Updated Successfully");
        else console.log("User Opted Not To Update Person");
        resetPersonForm();
      });
    } else {
      const person = createNewPerson();
      personsService.create(person).then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        queueAlert(
          `add-${returnedPerson.id}`,
          "success",
          `Added "${returnedPerson.name}"`
        );
        resetPersonForm();
      });
    }
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
        const willDelete = window.confirm(`Delete ${person.name}?`);
        if (willDelete) {
          removePersonWithId(id);
          queueAlert(
            `del-${person.id}`,
            "info",
            `Removed "${person.name}" from contact list`
          );
        }
        break;
      default:
        break;
    }
  };

  const queueAlert = (id, type, message) => {
    const timeoutFunc = id =>
      setAlerts(alerts => alerts.filter(a => a.id !== id));
    const alertProps = {
      timeoutFunc: timeoutFunc,
      id: id,
      type: type,
      message: message
    };
    setAlerts([...alerts, alertProps]);
  };

  const alertList = alerts.map(alert => {
    return (
      <Alert
        timeoutFunc={alert.timeoutFunc}
        key={alert.id}
        id={alert.id}
        type={alert.type}
        message={alert.message}
      ></Alert>
    );
  });

  return (
    <div className="o-wrapper">
      <h2>Phonebook</h2>

      {alertList}

      <PersonForm
        nameValue={newName}
        numberValue={newNumber}
        handleSubmit={event => handleSubmit(event)}
        handleNameChange={event => handleChange(event, "name")}
        handleNumberChange={event => handleChange(event, "number")}
      />

      <Filter
        handleFilterChange={event => handleChange(event, "nameFilter")}
        value={nameFilter}
      />

      <Persons
        persons={filteredPersons}
        handleClick={event => handleClick(event, "deletePerson")}
      />
    </div>
  );
};

export default App;
