import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { instructorApi } from '../api/api';
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
        const data = await instructorApi.info();
        // Normalize to match the InstructorInfo endpoint fields (separate firstname/lastname)
        const fullName = [data.firstname, data.lastname].filter(Boolean).join(' ') || data.name || 'Instructor';
        const normalized = {
          id: data.id || data.user_Id || data.userId || 'me',
          name: fullName,
          department: data.departmnet_Name || data.department_Name || data.departmentName || data.department || '—',
          office: data.office || '—',
        };
        setInstructor(normalized);
      } catch {
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
