import React, { useEffect } from "react";
import { Modal as StyledModal, ModalContent } from "./StyledComponents";

const Modal = ({ children }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <StyledModal>
      <ModalContent>{children}</ModalContent>
    </StyledModal>
  );
};

export default Modal;
