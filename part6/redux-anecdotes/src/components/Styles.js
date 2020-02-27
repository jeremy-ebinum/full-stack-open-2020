import styled, { createGlobalStyle } from "styled-components";

export const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 1.5rem 1rem;
  background-color: #272b2b;

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

export const Alert = styled.div`
  width: 100%;
  margin: auto;
  font-family: monospace;
  background: ghostwhite;
  color: #131515;
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

export const AnecdotesListContainer = styled(Container)`
  @media (min-width: 768px) {
    justify-content: center;
    flex-direction: row;
  }
`;

export const AnecdotesFormContainer = styled(Container)`
  margin-bottom: 1rem;
  @media (min-width: 768px) {
    margin-bottom: 2rem;
  }
`;

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

export const Heading = styled.h1`
  font-size: 1.5rem;
  color: #f9f9f9;
  margin-bottom: 0.5rem;

  @media (min-width: 768px) {
    text-align: center;
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
    ${AnecdotesListContainer} & {
      width: 100%;
    }
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

export const Card = styled.div`
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

export const Input = styled.input`
  width: 100%;
  padding: 0.35rem 0.75rem;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;

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
  font-size: 0.8rem;
  border-radius: 10px;
  width: auto;
  text-transform: uppercase;
  margin-top: 0.25rem;
`;

export const AnecdoteInput = styled(Input)`
  height: 80px;

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

export const Txt = styled.span`
  color: ${(props) => props.color || "#131515"};
  font-size: 1rem;
  font-weight: ${(props) => props.weight || 500};
  line-height: 1.4;

  @media (min-width: 480px) {
    font-size: 1.1rem;
  }
`;

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    width: 100%;
    height: 100%;
  }
`;
