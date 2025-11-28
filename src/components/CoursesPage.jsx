import React, { useState, useEffect } from 'react';
import { getCourses } from '../api/mockApi';
import './CoursesPage.css';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCourse, setExpandedCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await getCourses();
        if (response.success) {
          setCourses(response.data);
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
    e.stopPropagation(); // Prevent the course from collapsing when the button is clicked
    alert(`Enrolling in course: ${courseId}`);
  };

  if (isLoading) {
    return <div className="page-container">Loading courses...</div>;
  }

  if (error) {
    return <div className="page-container" style={{ color: 'var(--danger-color)' }}>Error: {error}</div>;
  }

  return (
    <div className="page-container">
      <h1>Available Courses</h1>
      <div>
        {courses.map((course) => (
          <div key={course.id} className="course-item">
            <div className="course-header" onClick={() => handleCourseClick(course.id)}>
              <h2>{course.name}</h2>
              <span className={`arrow ${expandedCourse === course.id ? 'expanded' : ''}`}>&#9654;</span>
            </div>
            <div className={`course-details ${expandedCourse === course.id ? 'expanded' : ''}`}>
              <p><strong>Code:</strong> {course.id}</p>
              <p><strong>Credits:</strong> {course.credits}</p>
              <button onClick={(e) => handleEnroll(e, course.id)}>Enroll</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
