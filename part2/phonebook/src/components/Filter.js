import React from "react";

const Filter = props => {
  return (
    <div>
      Filter by Name:{" "}
      <input onChange={props.handleFilterChange} value={props.value} />
    </div>
  );
};

export default Filter;
