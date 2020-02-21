import React from "react";
import PropTypes from "prop-types";

const Input = ({
  id,
  type,
  name,
  handleChange,
  value,
  placeholder,
  contextClass,
}) => {
  const inputClass = contextClass
    ? `c-row__input ${contextClass}`
    : `c-row__input`;

  return (
    <input
      name={name}
      id={id || null}
      type={type || "text"}
      className={inputClass}
      onChange={handleChange}
      value={value}
      placeholder={placeholder || ""}
    />
  );
};

Input.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  contextClass: PropTypes.string,
};

Input.defaultProps = {
  id: null,
  type: "text",
  contextClass: null,
  placeholder: null,
};

export default Input;
