import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCourses } from '../api/mockApi';
import './MySchedule.css';

const MySchedule = () => {
  const { studentId } = useParams();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    try {
      // Create placeholder courses with random days and times
      const placeholderCourses = [
        {
          courseCode: 'CS101',
          days: 'Monday, Wednesday',
          time: '09:00-11:00'
        },
        {
          courseCode: 'MATH201',
          days: 'Tuesday, Thursday',
          time: '11:00-13:00'
        },
        {
          courseCode: 'ENG102',
          days: 'Monday, Wednesday',
          time: '14:00-16:00'
        },
        {
          courseCode: 'PHY150',
          days: 'Tuesday',
          time: '16:00-18:00'
        },
        {
          courseCode: 'HIST301',
          days: 'Thursday',
          time: '14:00-16:00'
        }
      ];
      setEnrolledCourses(placeholderCourses);
    } catch (err) {
      setError('An unexpected error occurred while fetching courses.');
    } finally {
      setIsLoading(false);
    }
  }, [studentId]);

  if (isLoading) {
    return <div className="page-container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="page-container" style={{ color: 'var(--danger-color)' }}>
        Error: {error}
      </div>
    );
  }

  // --- Schedule Rendering Logic ---
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const timeSlots = ['09:00-11:00', '11:00-13:00', '14:00-16:00', '16:00-18:00'];
  const breakSlot = '13:00-14:00';

  // Create a lookup map for quick access to scheduled courses
  const scheduleMap = new Map();
  enrolledCourses?.forEach(course => {
    // Parse day from course data (assuming format like "Monday, Wednesday")
    const courseDays = course.days ? course.days.split(', ') : [];
    const courseTime = course.time || '09:00-11:00';
    
    courseDays.forEach(day => {
      scheduleMap.set(`${day}-${courseTime}`, course.courseCode);
    });
  });

  return (
    <div className="page-container">
      <h1>My Schedule</h1>
      {enrolledCourses.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No courses enrolled yet.
        </div>
      ) : (
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
                    const courseCode = scheduleMap.get(key);
                    return (
                      <td key={key} className={courseCode ? 'schedule-slot-taken' : 'schedule-slot-free'}>
                        {courseCode || 'Free'}
                      </td>
                    );
                  })}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MySchedule;
