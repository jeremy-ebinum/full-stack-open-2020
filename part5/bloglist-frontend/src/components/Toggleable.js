import React, { useState, useImperativeHandle } from "react";
import PropTypes from "prop-types";

const Toggleable = React.forwardRef(
  ({ contextClass, buttons, testid, children }, ref) => {
    const [visible, setVisible] = useState(false);

    const hideWhenVisible = { display: visible ? "none" : "" };
    const showWhenVisible = { display: visible ? "" : "none" };

    const toggleVisibility = () => {
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
          style={hideWhenVisible}
          className={`c-toggleable__show c-toggleable__show--${contextClass}`}
        >
          {buttons.show}
        </div>
        <div
          style={showWhenVisible}
          className="c-toggleable__content"
          data-testid={testid}
        >
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
  contextClass: PropTypes.string.isRequired,
  buttons: PropTypes.objectOf(PropTypes.element).isRequired,
  children: PropTypes.node.isRequired,
  testid: PropTypes.string,
};

Toggleable.defaultProps = {
  testid: null,
};

export default Toggleable;
