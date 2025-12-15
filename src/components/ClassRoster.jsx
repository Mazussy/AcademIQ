import React, { useState, useEffect } from 'react';
import { getCourseRoster } from '../api/mockApi';

const ClassRoster = ({ courseId }) => {
  const [roster, setRoster] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    const fetchRoster = async () => {
      setIsLoading(true);
      try {
        const response = await getCourseRoster(courseId);
        if (response.success) {
          setRoster(response.data);
          // Initialize attendance state
          const initialAttendance = {};
          response.data.forEach(student => {
            initialAttendance[student.id] = 'Present';
          });
          setAttendance(initialAttendance);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('An unexpected error occurred while fetching the roster.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoster();
  }, [courseId]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  if (isLoading) {
    return <div>Loading roster...</div>;
  }

  if (error) {
    return <div style={{ color: 'var(--danger-color)' }}>Error: {error}</div>;
  }

  return (
    <div className="roster-list">
      {roster.map(student => (
        <div key={student.id} className="roster-item">
          <span className="student-name">{student.name}</span>
          <div className="attendance-buttons">
            <span
              className={`attendance-button present ${attendance[student.id] === 'Present' ? 'active' : ''}`}
              onClick={() => handleAttendanceChange(student.id, 'Present')}
            >
              ✓
            </span>
            <span
              className={`attendance-button absent ${attendance[student.id] === 'Absent' ? 'active' : ''}`}
              onClick={() => handleAttendanceChange(student.id, 'Absent')}
            >
              ✗
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassRoster;
