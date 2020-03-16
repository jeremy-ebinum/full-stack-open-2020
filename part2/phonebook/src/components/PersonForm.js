import React from "react";

const PersonForm = (props) => {
  return (
    <div>
      <form className="c-person-form" onSubmit={props.handleSubmit}>
        <h3 className="c-person-form__heading">Add a New Contact</h3>
        <div className={"c-form-row"}>
          <label htmlFor="name" className="c-form-row__label">
            Name:
          </label>
          <input
            id="name"
            className="c-form-row__input"
            onChange={props.handleNameChange}
            value={props.nameValue}
          />
        </div>
        <div className="c-form-row">
          <label htmlFor="number" className="c-form-row__label">
            Number:
          </label>
          <input
            id="number"
            className="c-form-row__input"
            onChange={props.handleNumberChange}
            value={props.numberValue}
          />
        </div>
        <div className="c-person-form__submit">
          <button className="c-btn" type="submit">
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonForm;
