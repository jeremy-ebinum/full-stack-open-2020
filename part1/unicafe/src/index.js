import React, { useState } from "react";
import ReactDOM from "react-dom";

const Heading = props => <h1>{props.text}</h1>;

const Button = props => <button onClick={props.onClick}>{props.text}</button>;

const Statistics = props => {
  if (!props.hasFeedback) {
    return <p>No feedback has been given</p>;
  }

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
      <p>total - {props.total}</p>
      <p>average - {props.averageScore}</p>
      <p>positive - {props.percentPositive}%</p>
    </div>
  );
};

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [hasFeedback, setHasFeedback] = useState(false);

  const feedback = [
    { name: "good", count: good },
    { name: "neutral", count: neutral },
    { name: "bad", count: bad }
  ];

  const total = good + neutral + bad;

  const getPercent = (x, totalAmount) => {
    let result = (x / totalAmount) * 100;

    if (Number.isNaN(result)) return 0;

    return Math.round(result * 1000) / 1000;
  };

  const percentPositive = getPercent(good, total);

  const getWeightedAvg = (weightsArr, total) => {
    const weights = weightsArr.reduce((acc, item) => {
      return acc + item.number * item.weight;
    }, 0);

    let result = weights / total;

    if (Number.isNaN(result)) return 0;

    return Math.round(result * 1000) / 1000;
  };

  const averageScore = getWeightedAvg(
    [
      { number: good, weight: 1 },
      { number: neutral, weight: 0 },
      { number: bad, weight: -1 }
    ],
    total
  );

  const handleButtonClick = type => {
    setHasFeedback(true);

    switch (type) {
      case "good":
        setGood(good + 1);
        break;
      case "neutral":
        setNeutral(neutral + 1);
        break;
      case "bad":
        setBad(bad + 1);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Heading text="Give Feedback" />
      <Button onClick={() => handleButtonClick("good")} text="good" />
      <Button onClick={() => handleButtonClick("neutral")} text="neutral" />
      <Button onClick={() => handleButtonClick("bad")} text="bad" />
      <Statistics
        hasFeedback={hasFeedback}
        total={total}
        feedback={feedback}
        averageScore={averageScore}
        percentPositive={percentPositive}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
