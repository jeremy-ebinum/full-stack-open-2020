import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { getTestIDs } from "../helpers/testHelper";
import Modal from "./Modal";

export const testIDs = getTestIDs();

const ModalSpinner = () => {
  return (
    <Modal testid={testIDs.ModalSpinner_modal}>
      <FontAwesomeIcon
        className="c-spinner c-spinner--inModal"
        icon={faSpinner}
        spin
      />
    </Modal>
  );
};

export default ModalSpinner;
