import React, { useState, useEffect } from 'react';
import { getClassrooms, getClassroomSchedules } from '../api/mockApi';
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
        const response = await getClassrooms();
        if (response.success) {
          setClassrooms(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
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
                <ClassroomSchedule classroomId={classroom.id} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ClassroomSchedule = ({ classroomId }) => {
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoading(true);
      try {
        const response = await getClassroomSchedules(classroomId);
        if (response.success) {
          setSchedule(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('An unexpected error occurred while fetching the schedule.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [classroomId]);

  if (isLoading) {
    return <div>Loading schedule...</div>;
  }

  if (error) {
    return <div style={{ color: 'var(--danger-color)' }}>Error: {error}</div>;
  }

  // --- Schedule Rendering Logic ---
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const timeSlots = ['09:00-11:00', '11:00-13:00', '14:00-16:00', '16:00-18:00'];
  const breakSlot = '13:00-14:00';

  // Create a lookup map for quick access to scheduled courses
  const scheduleMap = new Map();
  schedule?.forEach(item => {
    scheduleMap.set(`${item.day}-${item.time}`, item.courseName);
  });

  return (
    <table className="schedule-table">
      <thead>
        <tr>
          <th>Time</th>
          {days.map(day => <th key={day}>{day}</th>)}
        </tr>
      </thead>
      <tbody>
        {timeSlots.map((time, index) => (
          <React.Fragment key={time}>
            {/* Add Break Row */}
            {index === 2 && (
              <tr className="break-row">
                <td className="time-slot-header">{breakSlot}</td>
                <td colSpan={days.length}>Break</td>
              </tr>
            )}
            {/* Regular Schedule Row */}
            <tr>
              <td className="time-slot-header">{time}</td>
              {days.map(day => {
                const key = `${day}-${time}`;
                const courseName = scheduleMap.get(key);
                return (
                  <td key={key} className={courseName ? 'schedule-slot-taken' : 'schedule-slot-free'}>
                    {courseName || 'Free'}
                  </td>
                );
              })}
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default AdminClassroomManagement;