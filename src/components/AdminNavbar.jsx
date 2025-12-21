import React from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { logout as apiLogout } from "../api/api";
import "./Navbar.css"; // Reusing the existing Navbar CSS

const AdminNavbar = () => {
  const { adminId } = useParams(); // Assuming admin routes will have an adminId
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
        <NavLink to={`/admin/dashboard/${adminId}`} className="navbar-item">
          AcademIQ (Admin)
        </NavLink>
      </div>
      <div className="navbar-menu">
        <NavLink to={`/admin/students/${adminId}`} className="navbar-item">
          Students
        </NavLink>
        <NavLink to={`/admin/instructors/${adminId}`} className="navbar-item">
          Instructors
        </NavLink>
        <NavLink to={`/admin/courses/${adminId}`} className="navbar-item">
          Courses
        </NavLink>
        <NavLink to={`/admin/users/${adminId}`} className="navbar-item">
          Register Users
        </NavLink>
        <NavLink to={`/admin/classrooms/${adminId}`} className="navbar-item">
          Classrooms
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

export default AdminNavbar;
