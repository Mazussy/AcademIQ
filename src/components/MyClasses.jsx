import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { instructorApi } from '../api/api';
import ClassRoster from './ClassRoster';
import './CoursesPage.css';

const MyClasses = () => {
  const { instructorId } = useParams();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCourse, setExpandedCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const data = await instructorApi.allCourses();
        const list = Array.isArray(data) ? data : (data?.items || []);
        const normalized = list.map((c) => ({
          id: c.id || c.course_Id || c.code,
          name: c.name || c.courseName || 'Course',
        }));
        setCourses(normalized);
      } catch {
        setError('An unexpected error occurred while fetching courses.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [instructorId]);

  const handleCourseClick = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  if (isLoading) {
    return <div className="page-container">Loading courses...</div>;
  }

  if (error) {
    return <div className="page-container" style={{ color: 'var(--danger-color)' }}>Error: {error}</div>;
  }

  return (
    <div className="page-container">
      <h1>My Classes</h1>
      <div>
        {courses.map((course) => (
          <div key={course.id} className="course-item">
            <div className="course-header" onClick={() => handleCourseClick(course.id)}>
              <h2>{course.name}</h2>
              <span className={`arrow ${expandedCourse === course.id ? 'expanded' : ''}`}>&#9654;</span>
            </div>
            <div className={`course-details ${expandedCourse === course.id ? 'expanded' : ''}`}>
              <ClassRoster courseId={course.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyClasses;
