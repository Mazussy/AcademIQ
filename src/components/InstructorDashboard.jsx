import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getInstructorData } from '../api/mockApi';
import './Dashboard.css';

const InstructorDashboard = () => {
  const { instructorId } = useParams();
  const [instructor, setInstructor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInstructor = async () => {
      setIsLoading(true);
      try {
        const response = await getInstructorData(instructorId);
        if (response.success) {
          setInstructor(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('An unexpected error occurred while fetching data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructor();
  }, [instructorId]);

  if (isLoading) {
    return <div className="page-container">Loading...</div>;
  }

  if (error) {
    return <div className="page-container" style={{ color: 'var(--danger-color)' }}>Error: {error}</div>;
  }

  if (!instructor) {
    return <div className="page-container">No instructor data available.</div>;
  }

  return (
    <div className="page-container">
      <div className="dashboard-card">
        <h1>Instructor Dashboard</h1>
        <p>Welcome back, <strong>{instructor.name}</strong>!</p>
        <ul className="student-info-list">
          <li><strong>ID:</strong> <span>{instructor.id}</span></li>
          <li><strong>Name:</strong> <span>{instructor.name}</span></li>
          <li><strong>Department:</strong> <span>{instructor.department}</span></li>
          <li><strong>Office:</strong> <span>{instructor.office}</span></li>
        </ul>
      </div>
    </div>
  );
};

export default InstructorDashboard;
