import React from "react";

const Header = (props) => {
  return <h1>{props.name}</h1>;
};

const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  );
};

const Content = ({ parts }) => {
  const partsList = parts.map((item) => {
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

export default Course;
