import React, { useState, useEffect } from 'react';
import { getCourses } from '../api/mockApi';
import './CoursesPage.css';

const CoursesPage = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCourse, setExpandedCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await getCourses();
        if (response.success) {
          setAvailableCourses(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('An unexpected error occurred while fetching courses.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const handleEnroll = (e, courseId) => {
    e.stopPropagation();
    const courseToEnroll = availableCourses.find(course => course.id === courseId);
    
    if (courseToEnroll) {
      setAvailableCourses(availableCourses.filter(course => course.id !== courseId));
      setEnrolledCourses([...enrolledCourses, courseToEnroll]);
      setExpandedCourse(null);
    }
  };

  const handleUnenroll = (e, courseId) => {
    e.stopPropagation();
    const courseToUnenroll = enrolledCourses.find(course => course.id === courseId);
    
    if (courseToUnenroll) {
      setEnrolledCourses(enrolledCourses.filter(course => course.id !== courseId));
      setAvailableCourses([...availableCourses, courseToUnenroll]);
      setExpandedCourse(null);
    }
  };

  if (isLoading) {
    return <div className="page-container">Loading courses...</div>;
  }

  if (error) {
    return <div className="page-container" style={{ color: 'var(--danger-color)' }}>Error: {error}</div>;
  }

  return (
    <div className="page-container">
      <h1>Courses</h1>
      
      <div className="courses-section">
        <h2>Available Courses</h2>
        {availableCourses.length === 0 ? (
          <p className="no-courses">No available courses</p>
        ) : (
          <div>
            {availableCourses.map((course) => (
              <div key={course.id} className="course-item">
                <div className="course-header" onClick={() => handleCourseClick(course.id)}>
                  <h2>{course.name}</h2>
                  <span className={`arrow ${expandedCourse === course.id ? 'expanded' : ''}`}>&#9654;</span>
                </div>
                <div className={`course-details ${expandedCourse === course.id ? 'expanded' : ''}`}>
                  <p><strong>Code:</strong> {course.id}</p>
                  <p><strong>Credits:</strong> {course.credits}</p>
                  <p><strong>Classroom:</strong> {course.classroom}</p>
                  <p><strong>Instructor ID:</strong> {course.instructorId}</p>
                  <p><strong>Day:</strong> {course.day}</p>
                  <p><strong>Time:</strong> {course.time}</p>
                  <button onClick={(e) => handleEnroll(e, course.id)}>Enroll</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="courses-section">
        <h2>Enrolled Courses</h2>
        {enrolledCourses.length === 0 ? (
          <p className="no-courses">You haven't enrolled in any courses yet</p>
        ) : (
          <div>
            {enrolledCourses.map((course) => (
              <div key={course.id} className="course-item enrolled">
                <div className="course-header" onClick={() => handleCourseClick(course.id)}>
                  <h2>{course.name}</h2>
                  <span className={`arrow ${expandedCourse === course.id ? 'expanded' : ''}`}>&#9654;</span>
                </div>
                <div className={`course-details ${expandedCourse === course.id ? 'expanded' : ''}`}>
                  <p><strong>Code:</strong> {course.id}</p>
                  <p><strong>Credits:</strong> {course.credits}</p>
                  <p><strong>Classroom:</strong> {course.classroom}</p>
                  <p><strong>Instructor ID:</strong> {course.instructorId}</p>
                  <p><strong>Day:</strong> {course.day}</p>
                  <p><strong>Time:</strong> {course.time}</p>
                  <button className="unenroll-btn" onClick={(e) => handleUnenroll(e, course.id)}>Unenroll</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
