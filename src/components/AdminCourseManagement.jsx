import React, { useState, useEffect } from "react";
import { adminApi } from "../api/api";
import "./AdminCourseManagement.css";

const AdminCourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null); // For editing
  const [formCourseId, setFormCourseId] = useState("");
  const [formCourseName, setFormCourseName] = useState("");
  const [formCourseCredits, setFormCourseCredits] = useState("");
  const [formInstructorId, setFormInstructorId] = useState("");
  const [formClassroomId, setFormClassroomId] = useState("");
  const [formSemester, setFormSemester] = useState("");
  const [formYear, setFormYear] = useState("");
  const [formDayTime, setFormDayTime] = useState("");
  const [formCapacity, setFormCapacity] = useState("");
  const [formEnrolledCount, setFormEnrolledCount] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.courses();
      console.log("Raw courses data from API:", data, "Type:", typeof data);

      // Handle different possible response structures
      let list = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (data && typeof data === "object") {
        // Try common wrapper structures
        list =
          data.items ||
          data.data ||
          data.result ||
          data.courses ||
          data.value ||
          [];
      }

      console.log("Extracted list:", list, "Length:", list?.length);

      if (!list || list.length === 0) {
        console.warn("No courses found in response");
        setCourses([]);
        return;
      }

      const normalized = list.map((c) => {
        console.log("Normalizing course:", c);
        return {
          id: c.id || c.code,
          name: c.name || c.courseName || "Course",
          credits: c.credits ?? c.credits_Hours ?? "—",
          instructorId: c.instructor_Id || c.instructorId || "—",
          classroomId: c.class_Room_Id || c.classroom || "—",
          semester: c.semester || "",
          year: c.year || "",
          day_time: c.day_Time || c.schedule || "",
          capacity: c.capacity ?? "",
          enrolled: c.enrolled_Count ?? c.enrolled ?? "",
          startDate: c.start_Date || c.startDate || "",
          endDate: c.end_Date || c.endDate || "",
        };
      });
      console.log("Normalized courses:", normalized);
      setCourses(normalized);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(`Error fetching courses: ${err?.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddClick = () => {
    setCurrentCourse(null); // Clear for new course
    setFormCourseId("");
    setFormCourseName("");
    setFormCourseCredits("");
    setFormInstructorId("");
    setFormClassroomId("");
    setFormSemester("");
    setFormYear("");
    setFormDayTime("");
    setFormCapacity("");
    setFormEnrolledCount("");
    setFormStartDate("");
    setFormEndDate("");
    setShowModal(true);
  };

  const handleEditClick = (course) => {
    setCurrentCourse(course);
    setFormCourseId(course.id);
    setFormCourseName(course.name);
    setFormCourseCredits(course.credits);
    setFormInstructorId(course.instructorId || course.instructor || "");
    setFormClassroomId(course.classroomId || course.classroom || "");
    setFormSemester(course.semester || "");
    setFormYear(course.year || "");
    setFormDayTime(course.day_time || course.schedule || "");
    setFormCapacity(course.capacity || "");
    setFormEnrolledCount(course.enrolled || course.enrolledCount || "");
    setFormStartDate(course.startDate || "");
    setFormEndDate(course.endDate || "");
    setShowModal(true);
  };

  const handleDeleteClick = async (courseId) => {
    if (window.confirm(`Are you sure you want to delete course ${courseId}?`)) {
      try {
        await adminApi.deleteCourse(courseId);
        fetchCourses(); // Refresh list
      } catch {
        setError("Error deleting course.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (currentCourse) {
        // Edit course
        await adminApi.editCourse(formCourseId, {
          newCourse: {
            code: formCourseId,
            name: formCourseName,
            credits: parseInt(formCourseCredits, 10),
            semester: formSemester,
            year: formYear ? parseInt(formYear, 10) : undefined,
          },
        });
      } else {
        // Add new course
        await adminApi.addCourse({
          newCourse: {
            code: formCourseId,
            name: formCourseName,
            credits: parseInt(formCourseCredits, 10),
            semester: formSemester,
            year: formYear ? parseInt(formYear, 10) : undefined,
          },
        });
      }
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      setError(err?.message || "Error saving course.");
    }
  };

  if (isLoading) {
    return <div className="page-container">Loading courses...</div>;
  }

  if (error) {
    return (
      <div className="page-container" style={{ color: "var(--danger-color)" }}>
        Error: {error}
      </div>
    );
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
            <div key={course.id} className="course-item">
              <div className="course-header">
                <h2>{course.name}</h2>
              </div>
            </div>
          ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{currentCourse ? "Edit Course" : "Add New Course"}</h2>
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
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit">Save Course</button>
              </div>
            </form>
            {error && (
              <p style={{ color: "var(--danger-color)", marginTop: "15px" }}>
                {error}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseManagement;
