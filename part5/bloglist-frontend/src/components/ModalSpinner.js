import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";

const ModalSpinner = () => {
  return (
    <Modal>
      <FontAwesomeIcon
        className="c-spinner c-spinner--inModal"
        icon={faSpinner}
        spin
      />
    </Modal>
  );
};

export default ModalSpinner;
