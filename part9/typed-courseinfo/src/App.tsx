import React from "react";
import { uid } from "react-uid";

import Header from "./components/Header";
import Content from "./components/Content";
import Total from "./components/Total";

export type CoursePart = {
  name: string;
  exerciseCount: number;
  id: string;
};

const App: React.FC = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      id: uid({}),
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      id: uid({}),
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
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
