import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getStudentData } from '../api/mockApi';
import './Dashboard.css';

const StudentDashboard = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      setIsLoading(true);
      try {
        const response = await getStudentData(studentId);
        if (response.success) {
          setStudent(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('An unexpected error occurred while fetching data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (isLoading) {
    return <div className="page-container">Loading...</div>;
  }

  if (error) {
    return <div className="page-container" style={{ color: 'var(--danger-color)' }}>Error: {error}</div>;
  }

  if (!student) {
    return <div className="page-container">No student data available.</div>;
  }

  return (
    <div className="page-container">
      <div className="dashboard-card">
        <h1>Student Dashboard</h1>
        <p>Welcome back, <strong>{student.name}</strong>!</p>
        <ul className="student-info-list">
          <li><strong>ID:</strong> <span>{student.id}</span></li>
          <li><strong>Name:</strong> <span>{student.name}</span></li>
          <li><strong>Major:</strong> <span>{student.major}</span></li>
          <li><strong>GPA:</strong> <span>{student.gpa}</span></li>
          <li><strong>Academic Status:</strong> <span style={{fontWeight: 'bold', color: student.academicStatus === 'Good Standing' ? 'var(--success-color)' : 'var(--warning-color)'}}>{student.academicStatus}</span></li>
          <li><strong>Overall Credit Hours:</strong> <span>{student.overallCreditHours}</span></li>
          <li><strong>Enrollment Year:</strong> <span>{student.enrollmentYear}</span></li>
        </ul>
      </div>
    </div>
  );
};

export default StudentDashboard;
