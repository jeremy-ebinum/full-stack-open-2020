import styled from "styled-components";
import Spinner from "react-bootstrap/Spinner";

export const Modal = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(50, 50, 50, 0.95);
  z-index: 9999;
`;

export const ModalContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LoadingSpinner = styled(Spinner)`
  width: 4rem;
  height: 4rem;
  font-size: 2rem;

  @media (min-width: 768px) {
    width: 6rem;
    height: 6rem;
  }
`;
