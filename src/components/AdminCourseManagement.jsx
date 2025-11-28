import React, { useState, useEffect } from 'react';
import { getCourses, addCourse, updateCourse, deleteCourse } from '../api/mockApi';
import './AdminCourseManagement.css';

const AdminCourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null); // For editing
  const [formCourseId, setFormCourseId] = useState('');
  const [formCourseName, setFormCourseName] = useState('');
  const [formCourseCredits, setFormCourseCredits] = useState('');

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

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddClick = () => {
    setCurrentCourse(null); // Clear for new course
    setFormCourseId('');
    setFormCourseName('');
    setFormCourseCredits('');
    setShowModal(true);
  };

  const handleEditClick = (course) => {
    setCurrentCourse(course);
    setFormCourseId(course.id);
    setFormCourseName(course.name);
    setFormCourseCredits(course.credits);
    setShowModal(true);
  };

  const handleDeleteClick = async (courseId) => {
    if (window.confirm(`Are you sure you want to delete course ${courseId}?`)) {
      try {
        const response = await deleteCourse(courseId);
        if (response.success) {
          alert(response.message);
          fetchCourses(); // Refresh list
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('Error deleting course.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const courseData = {
      id: formCourseId,
      name: formCourseName,
      credits: parseInt(formCourseCredits, 10),
    };

    try {
      let response;
      if (currentCourse) {
        response = await updateCourse(courseData);
      } else {
        response = await addCourse(courseData);
      }

      if (response.success) {
        alert(response.message);
        setShowModal(false);
        fetchCourses(); // Refresh list
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Error saving course.');
    }
  };

  if (isLoading) {
    return <div className="page-container">Loading courses...</div>;
  }

  if (error) {
    return <div className="page-container" style={{ color: 'var(--danger-color)' }}>Error: {error}</div>;
  }

  return (
    <div className="page-container admin-course-management">
      <h1>Course Management</h1>
      <button onClick={handleAddClick} style={{ marginBottom: '20px' }}>
        Add New Course
      </button>

      {courses.length === 0 && !isLoading && !error && (
        <p>No courses available.</p>
      )}

      <div>
        {courses.map((course) => (
          <div key={course.id} className="course-list-item">
            <div className="course-info">
              <h3>{course.name} ({course.id})</h3>
              <p>Credits: {course.credits}</p>
            </div>
            <div className="course-actions">
              <button className="edit-button" onClick={() => handleEditClick(course)}>
                Edit
              </button>
              <button className="delete-button" onClick={() => handleDeleteClick(course.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{currentCourse ? 'Edit Course' : 'Add New Course'}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Course ID:
                <input
                  type="text"
                  value={formCourseId}
                  onChange={(e) => setFormCourseId(e.target.value)}
                  required
                  disabled={!!currentCourse} // Disable ID input if editing
                />
              </label>
              <label>
                Course Name:
                <input
                  type="text"
                  value={formCourseName}
                  onChange={(e) => setFormCourseName(e.target.value)}
                  required
                />
              </label>
              <label>
                Credits:
                <input
                  type="number"
                  value={formCourseCredits}
                  onChange={(e) => setFormCourseCredits(e.target.value)}
                  required
                />
              </label>
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">Save Course</button>
              </div>
            </form>
            {error && <p style={{ color: 'var(--danger-color)', marginTop: '15px' }}>{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseManagement;
