import React, { useState, useEffect } from "react";
import { adminApi } from "../api/api";
import "./AdminStudentList.css";

const AdminStudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [formData, setFormData] = useState({
    major: "",
    gpa: "",
    academicStatus: "",
    overallCreditHours: "",
    enrollmentYear: "",
  });

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const data = await adminApi.allStudents();
        const list = Array.isArray(data) ? data : (data?.items || []);
        const normalized = list.map((s) => ({
          id: s.id || s.userId || s.studentId,
          name: s.name || [s.firstName, s.lastName].filter(Boolean).join(' '),
          major: s.major || s.major_Name || s.major_Id || '—',
          gpa: s.gpa ?? '—',
          academicStatus: s.academic_Status ?? s.academicStatus ?? '—',
          overallCreditHours: s.overallCreditsHours ?? s.overallCreditHours ?? '—',
          enrollmentYear: s.enrollmentYear || (s.enrollment_Date ? new Date(s.enrollment_Date).getFullYear() : '—'),
        }));
        setStudents(normalized);
        setFilteredStudents(normalized);
      } catch (err) {
        setError("An unexpected error occurred while fetching student data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const results = students.filter(
      (student) =>
        student.name.toLowerCase().includes(lowercasedFilter) ||
        student.id.toLowerCase().includes(lowercasedFilter) ||
        student.major.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredStudents(results);
  }, [searchTerm, students]);

  const handleStudentClick = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const handleEditStudent = (student) => {
    setCurrentStudent(student);
    setFormData({
      major: student.major,
      gpa: student.gpa,
      academicStatus: student.academicStatus,
      overallCreditHours: student.overallCreditHours,
      enrollmentYear: student.enrollmentYear,
    });
    setShowModal(true);
  };

  const handleDeleteStudent = (studentId) => {
    if (
      window.confirm(`Are you sure you want to delete student ${studentId}?`)
    ) {
      setStudents(students.filter((student) => student.id !== studentId));
      setFilteredStudents(
        filteredStudents.filter((student) => student.id !== studentId)
      );
    }
  };

  const handleSaveStudent = (e) => {
    e.preventDefault();
    const updatedStudents = students.map((student) =>
      student.id === currentStudent.id ? { ...student, ...formData } : student
    );
    setStudents(updatedStudents);
    setFilteredStudents(
      filteredStudents.map((student) =>
        student.id === currentStudent.id ? { ...student, ...formData } : student
      )
    );
    setShowModal(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (isLoading) {
    return <div className="page-container">Loading student data...</div>;
  }

  if (error) {
    return (
      <div className="page-container" style={{ color: "var(--danger-color)" }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div className="page-container admin-list-container">
      <h1>Student Management</h1>
      <input
        type="text"
        placeholder="Search students by name, ID, or major..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredStudents.length === 0 && !isLoading && !error && (
        <p>No students found matching your search.</p>
      )}

      <div>
        {filteredStudents.map((student) => (
          <div key={student.id} className="student-list-item">
            <div
              className="student-info"
              onClick={() => handleStudentClick(student.id)}
            >
              <h3>
                {student.name} ({student.id})
              </h3>
            </div>
            <div className="student-actions">
              <button
                className="edit-button"
                onClick={() => handleEditStudent(student)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDeleteStudent(student.id)}
              >
                Delete
              </button>
              <span
                className={`arrow ${
                  expandedStudent === student.id ? "expanded" : ""
                }`}
              >
                &#9654;
              </span>
            </div>
            <div
              className={`student-details ${
                expandedStudent === student.id ? "expanded" : ""
              }`}
            >
              <ul>
                <li>
                  <strong>Major:</strong> {student.major}
                </li>
                <li>
                  <strong>GPA:</strong> {student.gpa}
                </li>
                <li>
                  <strong>Academic Status:</strong>{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color:
                        student.academicStatus === "Good Standing"
                          ? "var(--primary-color)"
                          : "var(--warning-color)",
                    }}
                  >
                    {student.academicStatus}
                  </span>
                </li>
                <li>
                  <strong>Overall Credit Hours:</strong>{" "}
                  {student.overallCreditHours}
                </li>
                <li>
                  <strong>Enrollment Year:</strong> {student.enrollmentYear}
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Student: {currentStudent?.name}</h2>
            <form onSubmit={handleSaveStudent}>
              <label>
                Major:
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                GPA:
                <input
                  type="number"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleFormChange}
                  step="0.01"
                  required
                />
              </label>
              <label>
                Academic Status:
                <select
                  name="academicStatus"
                  value={formData.academicStatus}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Good Standing">Good Standing</option>
                  <option value="Probation">Probation</option>
                </select>
              </label>
              <label>
                Overall Credit Hours:
                <input
                  type="number"
                  name="overallCreditHours"
                  value={formData.overallCreditHours}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Enrollment Year:
                <input
                  type="number"
                  name="enrollmentYear"
                  value={formData.enrollmentYear}
                  onChange={handleFormChange}
                  required
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
                <button type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudentList;
