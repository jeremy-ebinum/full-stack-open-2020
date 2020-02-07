import React from "react";

const Filter = props => {
  return (
    <div className="c-form-row">
      <label for="filter" className="c-form-row__label">
        Filter by Name:
      </label>
      <input
        id="filter"
        className="c-form-row__input"
        onChange={props.handleFilterChange}
        value={props.value}
      />
    </div>
  );
};

export default Filter;
