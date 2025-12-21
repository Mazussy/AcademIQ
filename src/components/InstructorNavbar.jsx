import React from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import "./Navbar.css"; // Reusing the existing Navbar CSS

const InstructorNavbar = () => {
  const { instructorId } = useParams();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink
          to={`/instructor/dashboard/${instructorId}`}
          className="navbar-item"
        >
          AcademIQ (Instructor)
        </NavLink>
      </div>
      <div className="navbar-menu">
        <NavLink
          to={`/instructor/dashboard/${instructorId}`}
          className="navbar-item"
        >
          Dashboard
        </NavLink>
        <NavLink
          to={`/instructor/my-classes/${instructorId}`}
          className="navbar-item"
        >
          My Classes
        </NavLink>
      </div>
      <div className="navbar-end">
        <button onClick={handleLogout} className="navbar-item-button">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default InstructorNavbar;
