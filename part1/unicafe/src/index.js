import React, { useState } from "react";
import ReactDOM from "react-dom";

const Heading = props => <h1>{props.text}</h1>;

const Button = props => <button onClick={props.onClick}>{props.text}</button>;

const Statistic = props => {
  return (
    <tr>
      <td>{props.name}</td>
      <td>{props.value}</td>
    </tr>
  );
};

const Statistics = props => {
  if (!props.hasFeedback) {
    return <p>No feedback has been given</p>;
  }

  return (
    <div>
      <Heading text="Statistics" />
      <table>
        <tbody>
          <Statistic name="good" value={props.good} />

          <Statistic name="neutral" value={props.neutral} />

          <Statistic name="bad" value={props.bad} />

          <Statistic name="total" value={props.total} />

          <Statistic name="averageScore" value={props.averageScore} />

          <Statistic
            name="percentPositive"
            value={props.percentPositive + "%"}
          />
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [hasFeedback, setHasFeedback] = useState(false);

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

  const statisticsProps = {
    hasFeedback: hasFeedback,
    good: good,
    neutral: neutral,
    bad: bad,
    total: total,
    averageScore: averageScore,
    percentPositive: percentPositive
  };

  return (
    <div>
      <Heading text="Give Feedback" />
      <Button onClick={() => handleButtonClick("good")} text="good" />
      <Button onClick={() => handleButtonClick("neutral")} text="neutral" />
      <Button onClick={() => handleButtonClick("bad")} text="bad" />
      <Statistics {...statisticsProps} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
