import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const InputAddon = ({ type, icon, clickHandler }) => {
  let Addon;
  if (type === "toggler") {
    Addon = props => {
      return (
        <div
          role="button"
          onClick={clickHandler}
          className="c-input-addon c-input-addon--append c-input-addon--isToggler"
        >
          {props.children}
        </div>
      );
    };
  }

  return (
    <Addon>
      <FontAwesomeIcon className="c-input-addon__icon" icon={icon} />
    </Addon>
  );
};

export default InputAddon;
