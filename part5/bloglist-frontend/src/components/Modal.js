import React, { useEffect } from "react";

const Modal = props => {
  useEffect(() => {
    let rootStyle = document.documentElement.style;
    let wrapper = document.querySelector(".js-wrapper");
    rootStyle.setProperty("--body-overflow", "hidden");
    wrapper.classList.add("o-wrapper--hasModal");
    return () => {
      rootStyle.setProperty("--body-overflow", "auto");
      wrapper.classList.remove("o-wrapper--hasModal");
    };
  }, []);

  return (
    <div className="c-modal">
      <div className="c-modal__content">{props.children}</div>
    </div>
  );
};

export default Modal;
