import React from "react";
import { uid } from "react-uid";

import { CoursePart } from "./types";

import Header from "./components/Header";
import Content from "./components/Content";
import Total from "./components/Total";

const App: React.FC = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      id: uid({}),
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      id: uid({}),
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev",
      id: uid({}),
    },
    {
      name: "A History of Spam and Eggs",
      exerciseCount: 1,
      studentCount: 7e9,
      description: "Quite possibly the most important course in the world",
      id: uid({}),
    },
  ];

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;
