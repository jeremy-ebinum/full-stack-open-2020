import React from "react";

const Header: React.FC<{ courseName: string }> = ({ courseName }) => {
  return <h1>{courseName}</h1>;
};

export default Header;
