import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="centered-container">
      <div className="card">
        <h1>Welcome to AcademIQ</h1>
        <p>Your intelligent hub for managing your academic journey.</p>
        <Link to="/login">
          <button className="get-started-button">Get Started</button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
