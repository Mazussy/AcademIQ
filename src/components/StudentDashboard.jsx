import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { studentApi } from '../api/api';
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
        const data = await studentApi.dashboard();
        // Normalize display name/fields from possible DTO shapes
        const normalized = {
          id: data.id || data.userId || data.studentId || 'me',
          name: data.name || [data.firstName, data.lastName].filter(Boolean).join(' ') || 'Student',
          major: data.major || data.major_Name || data.majorId || '—',
          gpa: data.gpa ?? '—',
          academicStatus: data.academic_Status ?? data.academicStatus ?? '—',
          overallCreditHours: data.overallCreditsHours ?? data.overallCreditHours ?? '—',
          enrollmentYear: data.enrollmentYear || (data.enrollment_Date ? new Date(data.enrollment_Date).getFullYear() : '—'),
        };
        setStudent(normalized);
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
          <li><strong>Academic Status:</strong> <span style={{fontWeight: 'bold', color: student.academicStatus === 'Good Standing' ? 'var(--success-color)' : 'var(--warning-color)'}}>{String(student.academicStatus)}</span></li>
          <li><strong>Overall Credit Hours:</strong> <span>{student.overallCreditHours}</span></li>
          <li><strong>Enrollment Year:</strong> <span>{student.enrollmentYear}</span></li>
        </ul>
      </div>
    </div>
  );
};

export default StudentDashboard;
