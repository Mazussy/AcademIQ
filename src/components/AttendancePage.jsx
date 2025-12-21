import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { studentApi } from '../api/api';
import './AttendancePage.css';

const AttendancePage = () => {
  const { studentId } = useParams();
  const [attendanceData, setAttendanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCourse, setExpandedCourse] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      setIsLoading(true);
      try {
        // NOTE: User requested this endpoint for attendance pending API readiness
        const data = await studentApi.attendance();
        // Try to normalize to existing shape if possible
        const normalized = Array.isArray(data)
          ? { overallPercentage: 0, courses: [] }
          : data;
        setAttendanceData(normalized);
      } catch (err) {
        setError('An unexpected error occurred while fetching attendance data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, [studentId]);

  const getAttendancePercentage = (attended, total) => {
    if (total === 0) return 0;
    return Math.round((attended / total) * 100);
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 90) return 'var(--primary-color)';
    if (percentage >= 75) return 'var(--warning-color)';
    return 'var(--danger-color)';
  };

  const handleCourseClick = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  if (isLoading) {
    return <div className="page-container">Loading attendance data...</div>;
  }

  if (error) {
    return <div className="page-container" style={{ color: 'var(--danger-color)' }}>Error: {error}</div>;
  }

  if (!attendanceData) {
    return <div className="page-container">No attendance data available for this student.</div>;
  }

  return (
    <div className="page-container">
      <h1>Attendance</h1>
      <div className="attendance-summary">
        <h2>{attendanceData.overallPercentage}%</h2>
        <p>Overall Attendance</p>
      </div>
      <div>
        {attendanceData.courses.map((course) => {
          const percentage = getAttendancePercentage(course.attended, course.total);
          return (
            <div key={course.id} className="attendance-item">
              <div onClick={() => handleCourseClick(course.id)}>
                <h3>{course.name} ({course.id})</h3>
                <div className="progress-bar-container">
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getProgressBarColor(percentage),
                      }}
                    >
                      {percentage}%
                    </div>
                  </div>
                  <span>({course.attended}/{course.total})</span>
                </div>
              </div>
              {expandedCourse === course.id && course.details && (
                <div className="course-details expanded" style={{marginTop: '20px'}}>
                  <h4>Attendance Details:</h4>
                  <ul className="attendance-details-list">
                    {course.details.map((detail) => (
                      <li key={detail.date}>
                        <span>{detail.date}</span>
                        <span style={{ color: detail.status === 'Present' ? 'var(--primary-color)' : 'var(--danger-color)', fontWeight: 'bold' }}>
                          {detail.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendancePage;
