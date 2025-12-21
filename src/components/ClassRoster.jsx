import React, { useState, useEffect } from 'react';
import { instructorApi } from '../api/api';

const ClassRoster = ({ courseId }) => {
  const [roster, setRoster] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    const fetchRoster = async () => {
      setIsLoading(true);
      try {
        const data = await instructorApi.studentsRegistered(courseId);
        const list = Array.isArray(data) ? data : (data?.items || []);
        const normalized = list.map((s) => ({
          id: s.id || s.userId || s.studentId,
          name: s.name || [s.firstName, s.lastName].filter(Boolean).join(' '),
          enrollmentId: s.enrollmentId || s.id,
        }));
        setRoster(normalized);
        const initialAttendance = {};
        normalized.forEach(student => { initialAttendance[student.enrollmentId] = 'Present'; });
        setAttendance(initialAttendance);
      } catch (err) {
        setError('An unexpected error occurred while fetching the roster.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoster();
  }, [courseId]);

  const handleAttendanceChange = (enrollmentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [enrollmentId]: status,
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
              className={`attendance-button present ${attendance[student.enrollmentId] === 'Present' ? 'active' : ''}`}
              onClick={() => handleAttendanceChange(student.enrollmentId, 'Present')}
            >
              ✓
            </span>
            <span
              className={`attendance-button absent ${attendance[student.enrollmentId] === 'Absent' ? 'active' : ''}`}
              onClick={() => handleAttendanceChange(student.enrollmentId, 'Absent')}
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
