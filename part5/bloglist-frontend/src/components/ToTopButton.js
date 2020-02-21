import React from "react";
import PropTypes from "prop-types";

const ToTopButton = ({ handleScrollToTop }) => {
  return (
    <div className="c-to-top">
      <button
        type="button"
        onClick={handleScrollToTop}
        className="c-btn c-btn--transparent"
      >
        Back To Top
      </button>
    </div>
  );
};

ToTopButton.propTypes = {
  handleScrollToTop: PropTypes.func.isRequired,
};

export default ToTopButton;
