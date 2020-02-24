import React from "react";
import PropTypes from "prop-types";

const Input = ({
  id,
  type,
  name,
  handleChange,
  value,
  placeholder,
  ariaLabel,
  contextClass,
}) => {
  const inputClass = contextClass
    ? `c-row__input ${contextClass}`
    : `c-row__input`;

  return (
    <input
      name={name}
      id={id}
      type={type}
      className={inputClass}
      onChange={handleChange}
      value={value}
      placeholder={placeholder}
      aria-label={ariaLabel}
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
  ariaLabel: PropTypes.string,
  contextClass: PropTypes.string,
};

Input.defaultProps = {
  id: null,
  type: "text",
  contextClass: null,
  placeholder: null,
  ariaLabel: null,
};

export default React.memo(Input);
