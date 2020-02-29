import React from "react";
import Modal from "./Modal";
import { FetchSpinner } from "./StyledComponents";

const ModalSpinner = () => {
  return (
    <Modal>
      <FetchSpinner></FetchSpinner>
    </Modal>
  );
};

export default ModalSpinner;
