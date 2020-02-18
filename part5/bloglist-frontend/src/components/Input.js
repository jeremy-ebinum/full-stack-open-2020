import React from "react";

const Input = ({ type, handleChange, value, placeholder, contextClass }) => {
  return (
    <input
      type={type || "text"}
      className={`c-row__input ${contextClass ? contextClass : ""}`}
      onChange={handleChange}
      value={value}
      placeholder={placeholder}
    ></input>
  );
};

export default Input;
