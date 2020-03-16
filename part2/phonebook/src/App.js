import React, { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Alert from "./components/Alert";
import personsService from "./services/persons";
import uniqueRandom from "unique-random";

const random = uniqueRandom(1, 10000);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    personsService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const filteredPersons = persons.filter((person) => {
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
      number: newNumber,
    };

    return person;
  };

  // Attempt to create a new person and return true or false depending on user
  const attemptPersonUpdate = () => {
    const person = persons.find((p) => p.name === newName);
    const willUpdate = window.confirm(
      `${person.name} is alrady added to the phonebook, ` +
        "replace the old number with a new one?"
    );

    if (willUpdate) {
      const updatedPerson = { ...person, number: newNumber };
      const id = person.id;
      return personsService
        .update(id, updatedPerson)
        .then((returnedPerson) => {
          setPersons(persons.map((p) => (p.id !== id ? p : returnedPerson)));
          queueAlert([
            {
              type: `info`,
              message: `${returnedPerson.name}'s number updated to ${returnedPerson.number}`,
            },
          ]);
          return true;
        })
        .catch((error) => {
          queueAlert([
            {
              type: `error`,
              message: `Contact "${person.name}" has already been removed from server`,
            },
          ]);
          setPersons(persons.filter((p) => p.id !== id));
        });
    } else {
      return Promise.resolve(false);
    }
  };

  // handle errors associated with adding a new person
  const handleCreateErrors = (error) => {
    // const statusCode = error.response.status;
    const errorMessages = error.response.data.messages;

    if (errorMessages.length > 0) {
      const alerts = errorMessages.map((m) => {
        return {
          type: "error",
          message: m,
        };
      });

      queueAlert(alerts);
    } else {
      throw error;
    }
  };

  // handle submit events (PersonForm component)
  const handleSubmit = (event) => {
    event.preventDefault();

    const nameExists = persons.some((p) => p.name === newName);

    if (nameExists) {
      attemptPersonUpdate().then((wasUpdated) => {
        if (wasUpdated) console.log("Person Updated Successfully");
        else if (!wasUpdated) console.log("User Opted Not To Update Person");
        resetPersonForm();
      });
    } else {
      const person = createNewPerson();
      personsService
        .create(person)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          queueAlert([
            {
              type: `success`,
              message: `Added "${returnedPerson.name}"`,
            },
          ]);
        })
        .catch((error) => {
          handleCreateErrors(error);
        })
        .finally(() => resetPersonForm());
    }
  };

  // Attempt to remove a person with specified id, include basic error logging
  const removePersonWithId = (id) => {
    let deleted = true;

    personsService
      .remove(id)
      .catch((err) => {
        console.log(err);
        deleted = false;
      })
      .finally(() => {
        if (deleted) {
          setPersons(persons.filter((p) => p.id !== id));
        }
      });
  };

  // Handle click events based on component concern type
  const handleClick = (event, type) => {
    switch (type) {
      case "deletePerson":
        const id = event.target.dataset.id;
        if (Number.isNaN(id) || !id) break;
        const person = persons.find((p) => p.id === id);
        const willDelete = window.confirm(`Delete ${person.name}?`);
        if (willDelete) {
          removePersonWithId(id);
          queueAlert([
            {
              type: `info`,
              message: `Removed "${person.name}" from contact list`,
            },
          ]);
        }
        break;
      default:
        break;
    }
  };

  /**
   * Map an array of alerts to a format usable by Alert Component
   *
   * @param {Object[]} newAlerts - An array of alerts to be transformed
   * @param {string} newAlerts[].type - "info" or "error" or "success"
   * @param {string} newAlerts[].message - The alert message
   */
  const queueAlert = (newAlerts) => {
    const timeoutFunc = (id) =>
      setAlerts((alerts) => alerts.filter((a) => a.id !== id));

    const alertsWithTimeout = newAlerts.map((a) => {
      return { ...a, id: `${a.type}-${random()}`, timeoutFunc: timeoutFunc };
    });

    setAlerts([...alerts, ...alertsWithTimeout]);
  };

  // display all queued alerts
  const alertList = alerts.map((alert) => {
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
        handleSubmit={(event) => handleSubmit(event)}
        handleNameChange={(event) => handleChange(event, "name")}
        handleNumberChange={(event) => handleChange(event, "number")}
      />

      <Filter
        handleFilterChange={(event) => handleChange(event, "nameFilter")}
        value={nameFilter}
      />

      <Persons
        persons={filteredPersons}
        handleClick={(event) => handleClick(event, "deletePerson")}
      />
    </div>
  );
};

export default App;
