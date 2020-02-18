import React, { useState, useImperativeHandle } from "react";

const Toggleable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  // hide or show depending on if props.children is visible using state
  const hideWhenVisible = visible
    ? "c-toggleable__show isHidden"
    : "c-toggleable__show";
  const showWhenVisible = visible
    ? "c-toggleable__content"
    : "c-toggleable__content isHidden";

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    };
  });

  return (
    <div className="c-toggleable">
      <div className={`${hideWhenVisible} ${props.showContextClass}`}>
        <button
          className={`${props.showButtonClass}`}
          onClick={toggleVisibility}
        >
          {props.showButtonLabel}
        </button>
      </div>
      <div className={`${showWhenVisible}`}>
        <div className={`c-toggleable__hide ${props.hideContextClass}`}>
          <button
            className={props.hideButtonClass || "c-btn"}
            onClick={toggleVisibility}
          >
            {props.hideButtonLabel || "Cancel"}
          </button>
        </div>
        {props.children}
      </div>
    </div>
  );
});

export default Toggleable;
