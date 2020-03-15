import React, { useState, useCallback, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import { getTestIDs } from "../helpers/testHelper";

export const testIDs = getTestIDs();

let ShowBlogFormBtn = ({ handleClick }) => (
  <>
    <button
      type="button"
      className="c-btn c-btn--success"
      onClick={handleClick}
      data-testid={testIDs.Toggleable_showBlogFormBtn}
    >
      + Blog
    </button>
  </>
);

ShowBlogFormBtn = React.memo(ShowBlogFormBtn);

let HideBlogFormBtn = ({ handleClick }) => (
  <>
    <button type="button" className="c-btn" onClick={handleClick}>
      Cancel
    </button>
  </>
);

HideBlogFormBtn = React.memo(HideBlogFormBtn);

const Toggleable = React.forwardRef(
  ({ cb, context, testid, children }, ref) => {
    const [visible, setVisible] = useState(false);

    const hideWhenVisible = { display: visible ? "none" : "" };
    const showWhenVisible = { display: visible ? "" : "none" };

    const toggleVisibility = useCallback(() => {
      if (visible) cb();
      setVisible((prevState) => !prevState);
    }, [visible, cb]);

    useImperativeHandle(ref, () => {
      return {
        toggleVisibility,
      };
    });

    return (
      <div className="c-toggleable">
        <div
          style={hideWhenVisible}
          className={`c-toggleable__show ${context}`}
        >
          {context === "inBlogForm" && (
            <ShowBlogFormBtn handleClick={toggleVisibility} />
          )}
        </div>
        <div
          style={showWhenVisible}
          className="c-toggleable__content"
          data-testid={testid}
        >
          <div className={`c-toggleable__hide ${context}`}>
            {context === "inBlogForm" && (
              <HideBlogFormBtn handleClick={toggleVisibility} />
            )}
          </div>
          {children}
        </div>
      </div>
    );
  }
);

Toggleable.propTypes = {
  cb: PropTypes.func,
  context: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  testid: PropTypes.string,
};

Toggleable.defaultProps = {
  cb: null,
  testid: null,
};

export default Toggleable;
