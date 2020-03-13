import React, { useEffect } from "react";
import PropTypes from "prop-types";

const Modal = ({ testid, children }) => {
  useEffect(() => {
    const rootStyle = document.documentElement.style;
    const wrapper = document.querySelector(".js-wrapper");
    rootStyle.setProperty("--body-overflow", "hidden");
    wrapper.classList.add("hasModal");
    return () => {
      rootStyle.setProperty("--body-overflow", "auto");
      wrapper.classList.remove("hasModal");
    };
  }, []);

  return (
    <div data-testid={testid} className="c-modal">
      <div className="c-modal__content">{children}</div>
    </div>
  );
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  testid: PropTypes.string,
};

Modal.defaultProps = {
  testid: null,
};

export default Modal;
