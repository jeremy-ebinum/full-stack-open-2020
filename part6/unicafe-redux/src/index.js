import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import reducer from "./reducer";
import styled, { createGlobalStyle } from "styled-components";

const store = createStore(reducer);

const GlobalStyles = createGlobalStyle`
  * {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  }

  body {
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
  }
`;

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  padding: 2rem;
`;

const Container = styled.div`
  display: flex;
  margin: ${(props) => (props.spaced ? "1rem 0" : "0")};
  flex-direction: ${(props) => (props.column ? "column" : "row")};
  flex-wrap: wrap;

  @media (max-width: 480px) {
    justify-content: ${(props) => (props.column ? "" : "center")};
  }
`;

const Heading = styled.h2`
  color: #837a75;
  font-size: 2rem;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Button = styled.button`
  display: inline-block;
  border-radius: 3px;
  padding: 0.5rem 0;
  margin: 0 1rem 0.5rem 0;
  background-color: #564787;
  color: white;
  border: 0;
  width: 8rem;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  text-transform: uppercase;
  font-weight: bold;
  cursor: pointer;
  transition: background ease 0.4s;

  &:active {
    box-shadow: 0 0 2px 1px #101935;
  }

  &:hover {
    background-color: #6a58a7;
  }

  @media (max-width: 480px) {
    flex: 40% 0 0;
  }
`;

const Txt = styled.span`
  color: ${(props) => props.color || "#101935"};
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 1.4rem;
  font-weight: ${(props) => props.weight || 500};

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const App = () => {
  const action = (type) => {
    return () => {
      store.dispatch({
        type,
      });
    };
  };

  return (
    <>
      <GlobalStyles />
      <Wrapper>
        <Heading>Give Feedback</Heading>
        <Container spaced>
          <Button onClick={action("GOOD")}>good</Button>
          <Button onClick={action("OK")}>neutral</Button>
          <Button onClick={action("BAD")}>bad</Button>
          <Button onClick={action("ZERO")}>reset stats</Button>
        </Container>
        <Heading>Statistics</Heading>
        <Container spaced column>
          <div>
            <Txt>Good - </Txt>
            <Txt color="#28963C">{store.getState().good}</Txt>
          </div>
          <div>
            <Txt>Neutral - </Txt>
            <Txt>{store.getState().ok}</Txt>
          </div>
          <div>
            <Txt>Bad - </Txt>
            <Txt color="red">{store.getState().bad}</Txt>
          </div>
        </Container>
      </Wrapper>
    </>
  );
};

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById("root"));
};

renderApp();
store.subscribe(renderApp);
