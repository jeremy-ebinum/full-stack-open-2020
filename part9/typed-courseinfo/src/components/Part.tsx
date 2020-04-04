import React from "react";

import { assertNever } from "../utils";
import { CoursePart } from "../types";

const Part: React.FC<{ part: CoursePart }> = ({ part }) => {
  switch (part.name) {
    case "Fundamentals":
      return (
        <div>
          <p>
            <strong>{part.name}</strong>
          </p>
          {part.description && (
            <p>
              <em>{part.description}</em>
            </p>
          )}
          <p>
            Exercises: <strong>{part.exerciseCount}</strong>
          </p>
          <hr />
        </div>
      );
    case "Using props to pass data":
      return (
        <div>
          <p>
            <strong>{part.name}</strong>
          </p>
          <p>
            Exercises: <strong>{part.exerciseCount}</strong>
          </p>
          <p>
            Group Projects: <strong>{part.groupProjectCount}</strong>
          </p>
          <hr />
        </div>
      );
    case "Deeper type usage":
      return (
        <div>
          <p>
            <strong>{part.name}</strong>
          </p>
          {part.description && (
            <p>
              <em>{part.description}</em>
            </p>
          )}
          <p>
            Exercises: <strong>{part.exerciseCount}</strong>
          </p>
          <p>
            Submission Link:{" "}
            <a href={part.exerciseSubmissionLink}>
              {part.exerciseSubmissionLink}
            </a>
          </p>
          <hr />
        </div>
      );
    case "A History of Spam and Eggs":
      return (
        <div>
          <p>
            <strong>{part.name}</strong>
          </p>

          <p>
            <em>{part.description}</em>
          </p>

          <p>
            Exercises: <strong>{part.exerciseCount}</strong>
          </p>

          <p>
            Students: <strong>{part.studentCount}</strong>
          </p>

          <hr />
        </div>
      );
    default:
      return assertNever(part);
  }
};

export default Part;
