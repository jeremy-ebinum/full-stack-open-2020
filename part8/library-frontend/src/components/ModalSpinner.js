import React from "react";

import Modal from "./Modal";
import { LoadingSpinner } from "./StyledComponents";

const ModalSpinner = () => {
  return (
    <Modal>
      <LoadingSpinner
        variant="light"
        animation="border"
        role="status"
        size="lg"
      >
        <span className="sr-only">Loading...</span>
      </LoadingSpinner>
    </Modal>
  );
};

export default ModalSpinner;
