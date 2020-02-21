import React from "react";
import PropTypes from "prop-types";

const InputAddon = ({ type, children }) => {
  const displayAddon = () => {
    switch (type) {
      case "append":
        return (
          <div className="c-input-addon c-input-addon--append">{children}</div>
        );
      default:
        return null;
    }
  };

  return <>{displayAddon()}</>;
};

InputAddon.propTypes = {
  type: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default InputAddon;
