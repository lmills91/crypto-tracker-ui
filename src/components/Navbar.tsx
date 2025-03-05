import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link> | <Link to="/table">Table</Link> | <Link to="/graphs">Graphs</Link>
    </nav>
  );
};

export default Navbar;
