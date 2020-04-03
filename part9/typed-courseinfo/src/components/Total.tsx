import React from "react";

import { CoursePart } from "../App";

const Total: React.FC<{ courseParts: CoursePart[] }> = ({ courseParts }) => {
  return (
    <p>
      Number of exercises{" "}
      {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  );
};

export default Total;
