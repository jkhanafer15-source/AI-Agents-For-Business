import React from "react";
import { Link } from "react-router-dom";

import "../css/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="navbar-logo">
        <span className="logo-icon">🤖</span>

        <h2>
          BizAgent <span>AI</span>
        </h2>
      </div>

      <div className="navbar-links">

        <Link to="/home">
          Home
        </Link>

        <Link to="/chat">
          AI Assistant
        </Link>

        <Link to="/company">
          company data
        </Link>

        <Link to="/analytics">
          Business Analysis
        </Link>

        

      </div>

      <div className="navbar-profile">
        <div className="profile-avatar">
          J
        </div>
      </div>

    </nav>
  );
}

export default Navbar;