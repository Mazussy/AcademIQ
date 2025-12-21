import React, { useState, useEffect } from "react";
import { adminApi } from "../api/api";
import "./AdminCourseManagement.css";

const AdminCourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedCourse, setExpandedCourse] = useState(null);
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
          code: c.code || c.id || "—",
          credits: c.credits ?? c.credits_Hours ?? "—",
          department: c.department || c.dept || c.departmentName || "—",
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

  const handleCourseClick = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
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
      <h1>Courses</h1>
      <input
        type="text"
        className="search-input"
        placeholder="Search by course name or ID..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search courses"
        style={{ marginBottom: "20px", width: "100%", maxWidth: "500px" }}
      />

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
              <div
                className="course-info"
                onClick={() => handleCourseClick(course.id)}
              >
                <h3>{course.name}</h3>
              </div>
              <span
                className={`arrow ${
                  expandedCourse === course.id ? "expanded" : ""
                }`}
              >
                &#9654;
              </span>
              <div
                className={`course-details ${
                  expandedCourse === course.id ? "expanded" : ""
                }`}
              >
                <ul>
                  <li>
                    <strong>Course Code:</strong> {course.code}
                  </li>
                  <li>
                    <strong>Credit Hours:</strong> {course.credits}
                  </li>
                  <li>
                    <strong>Department:</strong> {course.department}
                  </li>
                </ul>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminCourseManagement;
