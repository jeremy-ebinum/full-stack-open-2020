import React from "react";

const PersonForm = props => {
  return (
    <div>
      <form onSubmit={props.handleSubmit}>
        <div>
          Name:{" "}
          <input onChange={props.handleNameChange} value={props.nameValue} />
        </div>
        <div>
          Number:{" "}
          <input
            onChange={props.handleNumberChange}
            value={props.numberValue}
          />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  );
};

export default PersonForm;
