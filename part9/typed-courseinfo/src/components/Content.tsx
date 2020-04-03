import React from "react";

import { CoursePart } from "../App";

const Content: React.FC<{ courseParts: CoursePart[] }> = ({ courseParts }) => {
  return (
    <>
      {courseParts.map((part) => (
        <p key={part.id}>
          {part.name} {part.exerciseCount}
        </p>
      ))}
    </>
  );
};

export default Content;
