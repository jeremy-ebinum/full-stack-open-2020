export interface CoursePartBase {
  name: string;
  exerciseCount: number;
  id: string;
}

interface CoursePartBaseWithOptionalDescription extends CoursePartBase {
  description?: string;
}

interface CoursePartOne extends CoursePartBaseWithOptionalDescription {
  name: "Fundamentals";
}

interface CoursePartTwo extends CoursePartBase {
  name: "Using props to pass data";
  groupProjectCount: number;
}

interface CoursePartThree extends CoursePartBaseWithOptionalDescription {
  name: "Deeper type usage";
  exerciseSubmissionLink: string;
}

interface CoursePartFour extends CoursePartBase {
  name: "A History of Spam and Eggs";
  description: string;
  studentCount: number;
}

export type CoursePart =
  | CoursePartOne
  | CoursePartTwo
  | CoursePartThree
  | CoursePartFour;
