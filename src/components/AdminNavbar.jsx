import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { logout as apiLogout } from '../api/api';
import './Navbar.css'; // Reusing the existing Navbar CSS

const AdminNavbar = () => {
  const { adminId } = useParams(); // Assuming admin routes will have an adminId
  const navigate = useNavigate();
  const [showNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Fetch notifications on component mount and when adminId changes
  useEffect(() => {}, [adminId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try { await apiLogout(); } catch {}
    navigate('/login');
  };

  const toggleNotifications = () => {};

  // Get count of unread notifications
  const unreadCount = 0;

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
        <div className="notification-container" ref={notificationRef}>
          <button 
            onClick={toggleNotifications} 
            className="notification-bell-button"
            aria-label="Notifications"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="bell-icon"
            >
              <path d="M12 2C11.172 2 10.5 2.672 10.5 3.5V4.1C8.53 4.56 7 6.288 7 8.5V14L5.293 15.707C4.902 16.098 5.184 17 5.793 17H18.207C18.816 17 19.098 16.098 18.707 15.707L17 14V8.5C17 6.288 15.47 4.56 13.5 4.1V3.5C13.5 2.672 12.828 2 12 2ZM10 18C10 19.105 10.895 20 12 20C13.105 20 14 19.105 14 18H10Z"/>
            </svg>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          {false}
        </div>
        <button onClick={handleLogout} className="navbar-item-button">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
