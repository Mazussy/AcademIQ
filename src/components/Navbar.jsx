import React from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { logout as apiLogout } from "../api/api";
import "./Navbar.css";

const Navbar = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch {}
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to={`/dashboard/${studentId}`} className="navbar-item">
          AcademIQ
        </NavLink>
      </div>
      <div className="navbar-menu">
        <NavLink to={`/dashboard/${studentId}`} className="navbar-item" end>
          Dashboard
        </NavLink>
        <NavLink to={`/courses/${studentId}`} className="navbar-item">
          Courses
        </NavLink>
        <NavLink to={`/schedule/${studentId}`} className="navbar-item">
          My Schedule
        </NavLink>
        <NavLink to={`/attendance/${studentId}`} className="navbar-item">
          Attendance
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

export default Navbar;
