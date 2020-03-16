import React from "react";

const Filter = (props) => {
  return (
    <div className="c-filter">
      <h3 className="c-filter__heading">Search Contacts</h3>
      <div className="c-form-row">
        <input
          id="filter"
          className="c-form-row__input"
          onChange={props.handleFilterChange}
          value={props.value}
          placeholder="Enter name..."
        />
      </div>
    </div>
  );
};

export default Filter;
