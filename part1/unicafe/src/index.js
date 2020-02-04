import React, { useState } from "react";
import ReactDOM from "react-dom";

const Heading = props => <h1>{props.text}</h1>;

const Button = props => <button onClick={props.onClick}>{props.text}</button>;

const Statistics = props => {
  return (
    <div>
      <Heading text="Statistics" />
      <p>
        {props.feedback[0].name} - {props.feedback[0].count}
      </p>
      <p>
        {props.feedback[1].name} - {props.feedback[1].count}
      </p>
      <p>
        {props.feedback[2].name} - {props.feedback[2].count}
      </p>
    </div>
  );
};

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const feedback = [
    { name: "good", count: good },
    { name: "neutral", count: neutral },
    { name: "bad", count: bad }
  ];

  const handleFeedbackButtonClick = type => {
    switch (type) {
      case "good":
        return () => setGood(good + 1);
      case "neutral":
        return () => setNeutral(neutral + 1);
      case "bad":
        return () => setBad(bad + 1);
      default:
        break;
    }
  };

  return (
    <div>
      <Heading text="Give Feedback" />
      <Button onClick={handleFeedbackButtonClick("good")} text="good" />
      <Button onClick={handleFeedbackButtonClick("neutral")} text="neutral" />
      <Button onClick={handleFeedbackButtonClick("bad")} text="bad" />
      <Statistics feedback={feedback} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
