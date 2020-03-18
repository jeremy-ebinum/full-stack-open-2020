import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import reducer from "./reducer";
import {
  GlobalStyles,
  Wrapper,
  Container,
  Button,
  Heading,
  Txt,
} from "./components";

const store = createStore(reducer);

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
