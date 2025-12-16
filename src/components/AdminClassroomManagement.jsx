import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/api';
import './AdminClassroomManagement.css';

const AdminClassroomManagement = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedClassroom, setExpandedClassroom] = useState(null);

  useEffect(() => {
    const fetchClassrooms = async () => {
      setIsLoading(true);
      try {
        const data = await adminApi.classrooms();
        const list = Array.isArray(data) ? data : (data?.items || []);
        setClassrooms(list);
      } catch {
        setError('An unexpected error occurred while fetching classroom data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  const handleClassroomClick = (classroomId) => {
    setExpandedClassroom(expandedClassroom === classroomId ? null : classroomId);
  };

  if (isLoading) {
    return <div className="page-container">Loading classroom data...</div>;
  }

  if (error) {
    return <div className="page-container" style={{ color: 'var(--danger-color)' }}>Error: {error}</div>;
  }

  return (
    <div className="page-container admin-list-container">
      <h1>Classroom Management</h1>
      <div>
        {classrooms.map((classroom) => (
          <div key={classroom.id} className="list-item">
            <div className="list-header" onClick={() => handleClassroomClick(classroom.id)}>
              <h3>{classroom.name}</h3>
              <span className={`arrow ${expandedClassroom === classroom.id ? 'expanded' : ''}`}>&#9654;</span>
            </div>
            <div className={`details-container ${expandedClassroom === classroom.id ? 'expanded' : ''}`}>
              {expandedClassroom === classroom.id && (
                <div style={{ padding: '10px', color: 'var(--text-secondary)' }}>
                  Schedule view is not available yet.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Classroom schedule view is temporarily disabled until endpoint is ready

export default AdminClassroomManagement;