import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/api';
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
  const [formInstructorId, setFormInstructorId] = useState('');
  const [formClassroomId, setFormClassroomId] = useState('');
  const [formSemester, setFormSemester] = useState('');
  const [formYear, setFormYear] = useState('');
  const [formDayTime, setFormDayTime] = useState('');
  const [formCapacity, setFormCapacity] = useState('');
  const [formEnrolledCount, setFormEnrolledCount] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCourse, setExpandedCourse] = useState(null);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.courses();
      const list = Array.isArray(data) ? data : (data?.items || []);
      const normalized = list.map((c) => ({
        id: c.id || c.code,
        name: c.name || c.courseName || 'Course',
        credits: c.credits ?? c.credits_Hours ?? '—',
        instructorId: c.instructor_Id || c.instructorId || '—',
        classroomId: c.class_Room_Id || c.classroom || '—',
        semester: c.semester || '',
        year: c.year || '',
        day_time: c.day_Time || c.schedule || '',
        capacity: c.capacity ?? '',
        enrolled: c.enrolled_Count ?? c.enrolled ?? '',
        startDate: c.start_Date || c.startDate || '',
        endDate: c.end_Date || c.endDate || '',
      }));
      setCourses(normalized);
    } catch {
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
    setFormInstructorId('');
    setFormClassroomId('');
    setFormSemester('');
    setFormYear('');
    setFormDayTime('');
    setFormCapacity('');
    setFormEnrolledCount('');
    setFormStartDate('');
    setFormEndDate('');
    setShowModal(true);
  };

  const handleEditClick = (course) => {
    setCurrentCourse(course);
    setFormCourseId(course.id);
    setFormCourseName(course.name);
    setFormCourseCredits(course.credits);
    setFormInstructorId(course.instructorId || course.instructor || '');
    setFormClassroomId(course.classroomId || course.classroom || '');
    setFormSemester(course.semester || '');
    setFormYear(course.year || '');
    setFormDayTime(course.day_time || course.schedule || '');
    setFormCapacity(course.capacity || '');
    setFormEnrolledCount(course.enrolled || course.enrolledCount || '');
    setFormStartDate(course.startDate || '');
    setFormEndDate(course.endDate || '');
    setShowModal(true);
  };

  const handleDeleteClick = async (courseId) => {
    if (window.confirm(`Are you sure you want to delete course ${courseId}?`)) {
      try {
        await adminApi.deleteCourse(courseId);
        fetchCourses(); // Refresh list
      } catch {
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
      instructorId: formInstructorId,
      classroomId: formClassroomId,
      semester: formSemester,
      year: formYear ? parseInt(formYear, 10) : undefined,
      day_time: formDayTime,
      capacity: formCapacity ? parseInt(formCapacity, 10) : undefined,
      enrolled: formEnrolledCount ? parseInt(formEnrolledCount, 10) : undefined,
      startDate: formStartDate,
      endDate: formEndDate,
    };

    try {
      if (currentCourse) {
        await adminApi.editCourse(courseData.id, { newCourse: { code: courseData.id, name: courseData.name, credits: courseData.credits } });
      } else {
        await adminApi.addCourse({ newCourse: { code: courseData.id, name: courseData.name, credits: courseData.credits } });
      }
      setShowModal(false);
      fetchCourses();
    } catch {
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
      <div className="course-top-bar">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search by course name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search courses"
          />
        </div>
        <div className="button-wrapper">
          <button className="add-course-button" onClick={handleAddClick}>
            Add New Course
          </button>
        </div>
      </div>

      {courses.length === 0 && !isLoading && !error && (
        <p>No courses available.</p>
      )}

      <div>
        {courses
          .filter((course) => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return (
              course.name.toLowerCase().includes(q) ||
              course.id.toLowerCase().includes(q)
            );
          })
          .map((course) => (
          <div key={course.id} className="student-list-item">
            <div className="student-info" onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}>
              <h3>{course.name} ({course.id})</h3>
            </div>
            <div className="student-actions">
              <button
                className="edit-button"
                onClick={() => handleEditClick(course)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDeleteClick(course.id)}
              >
                Delete
              </button>
              <span
                className={`arrow ${
                  expandedCourse === course.id ? "expanded" : ""
                }`}
              >
                &#9654;
              </span>
            </div>

            <div className={`student-details ${expandedCourse === course.id ? 'expanded' : ''}`}>
              <ul>
                <li><strong>Course ID:</strong> <span>{course.id || 'N/A'}</span></li>
                <li><strong>Instructor ID:</strong> <span>{course.instructorId || course.instructor || 'TBD'}</span></li>
                <li><strong>Classroom ID:</strong> <span>{course.classroomId || course.classroom || 'TBD'}</span></li>
                <li><strong>Semester:</strong> <span>{course.semester || 'N/A'}</span></li>
                <li><strong>Year:</strong> <span>{course.year || new Date().getFullYear()}</span></li>
                <li><strong>Day/Time:</strong> <span>{course.day_time || course.schedule || 'TBD'}</span></li>
                <li><strong>Capacity:</strong> <span>{course.capacity ?? 'N/A'}</span></li>
                <li><strong>Enrolled Count:</strong> <span>{course.enrolled ?? 0}</span></li>
                <li><strong>Start - End:</strong> <span>{(course.startDate && course.endDate) ? `${course.startDate} - ${course.endDate}` : (course.start_end || 'TBD')}</span></li>
              </ul>
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
              <label>
                Instructor ID:
                <input
                  type="text"
                  value={formInstructorId}
                  onChange={(e) => setFormInstructorId(e.target.value)}
                />
              </label>
              <label>
                Classroom ID:
                <input
                  type="text"
                  value={formClassroomId}
                  onChange={(e) => setFormClassroomId(e.target.value)}
                />
              </label>
              <label>
                Semester:
                <input
                  type="text"
                  value={formSemester}
                  onChange={(e) => setFormSemester(e.target.value)}
                />
              </label>
              <label>
                Year:
                <input
                  type="number"
                  value={formYear}
                  onChange={(e) => setFormYear(e.target.value)}
                />
              </label>
              <label>
                Day/Time:
                <input
                  type="text"
                  value={formDayTime}
                  onChange={(e) => setFormDayTime(e.target.value)}
                  placeholder="e.g., Mon/Wed 10:00-11:30"
                />
              </label>
              <label>
                Capacity:
                <input
                  type="number"
                  value={formCapacity}
                  onChange={(e) => setFormCapacity(e.target.value)}
                />
              </label>
              <label>
                Enrolled Count:
                <input
                  type="number"
                  value={formEnrolledCount}
                  onChange={(e) => setFormEnrolledCount(e.target.value)}
                />
              </label>
              <label>
                Start Date:
                <input
                  type="date"
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                />
              </label>
              <label>
                End Date:
                <input
                  type="date"
                  value={formEndDate}
                  onChange={(e) => setFormEndDate(e.target.value)}
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
