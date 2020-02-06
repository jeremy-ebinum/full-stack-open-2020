import React from "react";

const Filter = props => {
  return (
    <div>
      <label>by Name: </label>
      <input onChange={props.onChange} value={props.value}></input>
    </div>
  );
};

export default Filter;
