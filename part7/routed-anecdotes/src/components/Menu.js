import React from "react";
import { Link } from "react-router-dom";

const Menu = () => {
  const padding = {
    paddingRight: 5,
  };
  return (
    <div>
      <Link to="/" style={padding}>
        Anecdotes
      </Link>
      <Link to="/create" style={padding}>
        Create New
      </Link>
      <Link to="/about" style={padding}>
        About
      </Link>
    </div>
  );
};

export default Menu;
