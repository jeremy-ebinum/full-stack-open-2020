import React from "react";
import ReactDOM from "react-dom";

const Header = props => {
  return <h1>{props.name}</h1>;
};

const Part = props => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  );
};

const Content = ({ parts }) => {
  const partsList = parts.map(item => {
    return <Part key={item.id} name={item.name} exercises={item.exercises} />;
  });

  const noParts = !Array.isArray(partsList) || !partsList.length;

  return (
    <div>
      {noParts && <p>This course doesn't have any parts yet.</p>}
      {!noParts && partsList}
    </div>
  );
};

const Total = ({ parts }) => {
  const total = parts.reduce((acc, item) => acc + item.exercises, 0);

  return (
    <p>
      <strong>Total of {total} exercises</strong>
    </p>
  );
};

const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

const App = () => {
  const courses = [
    {
      name: "Half Stack application development",
      id: 1,
      parts: [
        {
          name: "Fundamentals of React",
          exercises: 10,
          id: 1
        },
        {
          name: "Using props to pass data",
          exercises: 7,
          id: 2
        },
        {
          name: "State of a component",
          exercises: 14,
          id: 3
        },
        {
          name: "Redux",
          exercises: 11,
          id: 4
        }
      ]
    },
    {
      name: "Node.js",
      id: 2,
      parts: [
        {
          name: "Routing",
          exercises: 3,
          id: 1
        },
        {
          name: "Middlewares",
          exercises: 7,
          id: 2
        }
      ]
    }
  ];

  const courseList = courses.map(course => {
    return <Course key={course.id} course={course} />;
  });

  return <div>{courseList}</div>;
};

ReactDOM.render(<App />, document.getElementById("root"));
