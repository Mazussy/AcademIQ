import React, { useState, useEffect } from 'react';
import { enrollmentApi } from '../api/api';
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
        const [available, enrolled] = await Promise.all([
          enrollmentApi.availableOfferings(),
          enrollmentApi.myEnrollments(),
        ]);
        const toCourse = (c) => ({
          id: c.id || c.course_Id || c.courseId || c.code || 'N/A',
          name: c.name || c.courseName || 'Course',
          credits: c.credits ?? c.credits_Hours ?? '—',
          classroom: c.class_RoomName || c.class_Room_Id || c.classroom || '—',
          instructorId: c.instructor_Id || c.instructorId || '—',
          day: c.day || undefined,
          time: c.time || undefined,
          day_time: c.day_Time || c.schedule,
        });
        setAvailableCourses((Array.isArray(available) ? available : available?.items || []).map(toCourse));
        setEnrolledCourses((Array.isArray(enrolled) ? enrolled : enrolled?.items || []).map(toCourse));
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

  const handleEnroll = async (e, courseId) => {
    e.stopPropagation();
    try {
      await enrollmentApi.registerCourse(courseId);
      const courseToEnroll = availableCourses.find(course => course.id === courseId);
      if (courseToEnroll) {
        setAvailableCourses(availableCourses.filter(course => course.id !== courseId));
        setEnrolledCourses([...enrolledCourses, courseToEnroll]);
        setExpandedCourse(null);
      }
    } catch {
      setError('Failed to enroll in course.');
    }
  };

  const handleUnenroll = async (e, courseId) => {
    e.stopPropagation();
    try {
      await enrollmentApi.deleteRegisteredCourse(courseId);
      const courseToUnenroll = enrolledCourses.find(course => course.id === courseId);
      if (courseToUnenroll) {
        setEnrolledCourses(enrolledCourses.filter(course => course.id !== courseId));
        setAvailableCourses([...availableCourses, courseToUnenroll]);
        setExpandedCourse(null);
      }
    } catch {
      setError('Failed to unenroll from course.');
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
                  <p><strong>Schedule:</strong> {course.day_time || `${course.day || ''} ${course.time || ''}`}</p>
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
                  <p><strong>Schedule:</strong> {course.day_time || `${course.day || ''} ${course.time || ''}`}</p>
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
