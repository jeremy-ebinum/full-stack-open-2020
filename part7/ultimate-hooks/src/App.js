import React, { useState, useEffect } from "react";
import axios from "axios";

const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const setInitialResources = async () => {
      console.log(`Fetching resources from ${baseUrl}`);
      try {
        const response = await axios.get(baseUrl, {
          cancelToken: source.token,
        });

        setResources(response.data);
      } catch (error) {
        setResources([]);
        if (axios.isCancel(error)) {
          console.log("Request Cancelled", error.message);
        } else {
          console.error(error);
        }
      }
    };

    setInitialResources();

    return () => source.cancel();
  }, [baseUrl]);

  const create = async (resource) => {
    try {
      const response = await axios.post(baseUrl, resource);

      setResources((prevResources) => prevResources.concat(response.data));
    } catch (error) {
      console.error(error);
    }
  };

  const service = {
    create,
  };

  return [resources, service];
};

const App = () => {
  const content = useField("text");
  const name = useField("text");
  const number = useField("text");

  const [notes, noteService] = useResource("http://localhost:3005/notes");
  const [persons, personService] = useResource("http://localhost:3005/persons");

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    noteService.create({ content: content.value });
  };

  const handlePersonSubmit = (event) => {
    event.preventDefault();
    personService.create({ name: name.value, number: number.value });
  };

  return (
    <div>
      <h2>notes</h2>

      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>

      {notes.map((n) => (
        <p key={n.id}>{n.content}</p>
      ))}

      <h2>persons</h2>

      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br />
        number <input {...number} />
        <button>create</button>
      </form>

      {persons.map((n) => (
        <p key={n.id}>
          {n.name} {n.number}
        </p>
      ))}
    </div>
  );
};

export default App;
