import styled, { createGlobalStyle, keyframes, css } from "styled-components";
import { Spinner2 } from "styled-icons/icomoon/";
import FlexoW01RegularWoff from "../fonts/FlexoW01Regular.woff";
import FlexoW01RegularWoff2 from "../fonts/FlexoW01Regular.woff2";

// CONTAINERS
export const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 1.5rem 1rem;
  background-color: #272b2b;

  @media (min-width: 640px) {
    padding: 1.5rem;
  }

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

export const Container = styled.div`
  width: 100%;
  display: flex;
  margin: ${(props) => (props.margin ? props.margin : "0")};
  flex-direction: ${(props) => (props.column ? "column" : "row")};
  flex-wrap: wrap;
  justify-content: ${(props) => (props.justify ? props.justify : "unset")};
  align-items: ${(props) => (props.align ? props.align : "unset")};
`;

export const FixedContainer = styled(Container)`
  position: fixed;
  top: 1rem;
  left: 0;
`;

export const NotificationContainer = styled(FixedContainer)`
  background: transparent;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
`;

export const Modal = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(50, 50, 50, 0.65);
  z-index: 9999;
`;

export const ModalContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Card = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin: 0.5rem 0;
  background-color: #f9f9f9;

  @media (min-width: 768px) {
    margin: 0.5rem 1rem 0.5rem 0;
    flex: 1 0 calc(50% - 1rem);
  }

  @media (min-width: 1280px) {
    margin: 0.75rem;
    flex: 0 0 calc(45% - 1.5rem);
  }
`;

// ANIMATIONS
const fullSpin = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const fillWidth = keyframes`
  from {
    width: 0%;
  }

  to {
    width: 100%;
  }
`;

export const FetchSpinner = styled(Spinner2)`
  color: ghostwhite;
  width: 4rem;
  height: 4rem;
  animation: ${fullSpin} 0.5s linear infinite;

  @media (min-width: 768px) {
    width: 6rem;
    height: 6rem;
  }
`;

const fixedTopLeftMixin = css`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
`;

// PROGRESS BAR
export const Meter = styled.div`
  background-color: #272b2b;
  height: 6px;

  ${(props) => props.toTop && fixedTopLeftMixin}
`;

export const MeterBar = styled.span`
  display: block;
  height: 100%;
  background: linear-gradient(
    45deg,
    rgb(16, 148, 108) 37%,
    rgba(14, 128, 93, 0.7) 69%
  );
  position: absolute;
  top: 0;
  left: 0;
  animation: ${fillWidth} 1s ease-in-out infinite;
`;

// NOTIFICATION
export const Alert = styled.div`
  width: 100%;
  margin: auto;
  font-family: monospace;
  background: rgba(19, 21, 21, 0.75);
  color: ghostwhite;
  font-weight: 700;
  text-align: center;
  padding: 0.4rem 0.3rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;

  &.info {
    background-color: rgba(0, 100, 148, 0.75);
    color: ghostwhite;
  }

  &.success {
    background: rgba(16, 148, 108, 0.75);
    color: ghostwhite;
  }

  &.warning {
    background: rgba(191, 21, 73, 0.75);
    color: ghostwhite;
  }

  @media (min-width: 480px) {
    font-size: 1rem;
  }

  @media (min-width: 768px) {
    padding: 0.5rem;
    font-size: 1.2rem;
    max-width: 1024px;
  }
`;

// FORMS
export const Form = styled.form`
  width: 100%;

  @media (min-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const FormRow = styled(Container)`
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    justify-content: center;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.35rem 0.75rem;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;

// TEXT
export const Heading = styled.h1`
  font-size: 1.5rem;
  color: #f9f9f9;
  margin-bottom: 0.5rem;

  @media (min-width: 768px) {
    text-align: center;
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
  }

  @media (min-width: 1280px) {
    font-size: 2rem;
  }
`;

export const MainHeading = styled(Heading)`
  font-size: 1.7rem;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 1.25rem;
  }

  @media (min-width: 1280px) {
    font-size: 2.4rem;
  }
`;

export const Txt = styled.span`
  color: ${(props) => props.color || "#131515"};
  font-family: "Flexo W01";
  font-size: 1rem;
  font-weight: ${(props) => props.weight || 400};
  line-height: 1.4;

  @media (min-width: 480px) {
    font-size: 1.1rem;
  }
`;

// BUTTONS
export const Button = styled.button`
  display: inline-block;
  border: 1px solid transparent;
  border-radius: 1px;
  padding: 0.35rem 0.75rem;
  margin: ${(props) => (props.margin ? props.margin : "0")};
  text-decoration: none;
  background: #000;
  color: #fff;
  font-family: monospace;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  text-align: center;
  transition: background 250ms ease-in-out, transform 150ms ease;
  -webkit-appearance: none;
  -moz-appearance: none;
  align-self: ${(props) => (props.align ? props.align : "unset")};

  &:hover {
    background: #333;
  }

  &:active {
    transform: scale(0.99);
  }
`;

export const PrimaryButton = styled(Button)`
  background-color: #006494;

  &:hover {
    background: #004769;
  }
`;

export const SuccessButton = styled(Button)`
  text-transform: uppercase;
  font-weight: 500;
  background-color: #13ab7d;

  &:hover {
    background: #10946c;
  }
`;

export const WarningButton = styled(Button)`
  background-color: #bf1549;

  &:hover {
    background: #ab1341;
  }
`;

// ANECDOTE FORM
export const AnecdotesFormContainer = styled(Container)`
  margin-bottom: 1rem;
  @media (min-width: 768px) {
    margin-bottom: 2rem;
  }
`;

export const AnecdoteInput = styled(Input)`
  font-family: "Flexo W01";
  height: 80px;

  @media (min-width: 640px) {
    height: 100px;
  }

  @media (min-width: 768px) {
    height: 100px;
    font-size: 1.2rem;
    max-width: 768px;
  }
`;

export const CreateAnecdoteButton = styled(SuccessButton)`
  font-family: Arial, Helvetica, sans-serif;
  padding: 0.4rem 1rem;
  font-size: 1.2rem;

  @media (min-width: 768px) {
    border-radius: 4px;
    width: 100%;
    max-width: 768px;
    padding: 0.5rem 0;
    font-size: 1.5rem;
    font-weight: bold;
  }
`;

// ANECDOTE LIST
export const AnecdotesListContainer = styled(Container)`
  @media (min-width: 768px) {
    justify-content: center;
    flex-direction: row;
  }
`;

// FILTER
export const FilterContainer = styled(Container)`
  flex-direction: column;
  margin-bottom: 1rem;
  align-items: flex-start;
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
`;

export const FilterLabel = styled.label`
  color: #f9f9f9;
  font-size: 1.3rem;

  @media (min-width: 768px) {
    width: auto;
  }
`;

export const FilterInput = styled(Input)`
  padding: 0.35rem 1rem;
  width: 80%;
  max-width: 320px;
  border-color: transparent;
  border-radius: 20px;
  font-family: "Flexo W01";
  font-size: 1rem;
  margin: 0.5rem 0;

  @media (min-width: 768px) {
    margin: 0.5rem 1rem;
    width: 50%;
    max-width: 360px;
    font-size: 1.1rem;
  }
`;

export const ClearFliterButton = styled(WarningButton)`
  font-family: "Flexo W01";
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 10px;
  width: auto;
  text-transform: uppercase;
  margin-top: 0.25rem;
`;

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  @font-face {
    font-family: "Flexo W01";
    src: url(${FlexoW01RegularWoff2}) format('woff2'),
    url(${FlexoW01RegularWoff}) format('woff');
    font-weight: 400;
    font-style: normal;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    width: 100%;
    height: 100%;
  }
`;
