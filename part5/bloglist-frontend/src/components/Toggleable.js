import React, { useState, useImperativeHandle } from "react";
import PropTypes from "prop-types";

const Toggleable = React.forwardRef(
  ({ cb, contextClass, buttons, children }, ref) => {
    const [visible, setVisible] = useState(false);

    let hideWhenVisible;
    let showWhenVisible;

    if (visible) {
      hideWhenVisible = "c-toggleable__show isHidden";
      showWhenVisible = "c-toggleable__content";
    } else {
      hideWhenVisible = "c-toggleable__show";
      showWhenVisible = "c-toggleable__content isHidden";
    }

    const toggleVisibility = () => {
      if (visible) cb();
      setVisible(!visible);
    };

    useImperativeHandle(ref, () => {
      return {
        toggleVisibility,
      };
    });

    return (
      <div className="c-toggleable">
        <div
          className={`${hideWhenVisible} c-toggleable__show--${contextClass}`}
        >
          {buttons.show}
        </div>
        <div className={`${showWhenVisible}`}>
          <div
            className={`c-toggleable__hide c-toggleable__hide--${contextClass}`}
          >
            {buttons.hide}
          </div>
          {children}
        </div>
      </div>
    );
  }
);

Toggleable.propTypes = {
  cb: PropTypes.func.isRequired,
  contextClass: PropTypes.string.isRequired,
  buttons: PropTypes.objectOf(PropTypes.element).isRequired,
  children: PropTypes.node.isRequired,
};

export default Toggleable;
