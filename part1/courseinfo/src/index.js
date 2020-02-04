import React from "react";
import ReactDOM from "react-dom";

const Header = props => {
  return <h1>{props.course}</h1>;
};

const Part = props => {
  return (
    <p>
      {props.name} {props.exCount}
    </p>
  );
};

const Content = props => {
  return (
    <div>
      <Part name={props.name1} exCount={props.exCount1} />
      <Part name={props.name2} exCount={props.exCount2} />
      <Part name={props.name3} exCount={props.exCount3} />
    </div>
  );
};

const Total = props => {
  return <p>Number of excercises {props.num1 + props.num2 + props.num3}</p>;
};

const App = () => {
  const course = "Half Stack application development";
  const part1 = "Fundamentals of React";
  const exercises1 = 10;
  const part2 = "Using props to pass data";
  const exercises2 = 7;
  const part3 = "State of a component";
  const exercises3 = 14;

  return (
    <div>
      <Header course={course} />
      <Content
        name1={part1}
        exCount1={exercises1}
        name2={part2}
        exCount2={exercises2}
        name3={part3}
        exCount3={exercises3}
      />
      <Total num1={exercises1} num2={exercises2} num3={exercises3} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
