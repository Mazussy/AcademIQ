import React, { useState, useEffect } from "react";
import { getAllInstructors } from "../api/mockApi";
import "./AdminInstructorList.css";

const AdminInstructorList = () => {
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedInstructor, setExpandedInstructor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentInstructor, setCurrentInstructor] = useState(null);
  const [formData, setFormData] = useState({
    department: "",
    email: "",
    employmentStatus: "",
    hireYear: "",
  });

  useEffect(() => {
    const fetchInstructors = async () => {
      setIsLoading(true);
      try {
        const response = await getAllInstructors();
        if (response.success) {
          setInstructors(response.data);
          setFilteredInstructors(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("An unexpected error occurred while fetching instructor data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const results = instructors.filter(
      (instructor) =>
        instructor.name.toLowerCase().includes(lowercasedFilter) ||
        instructor.id.toLowerCase().includes(lowercasedFilter) ||
        instructor.department.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredInstructors(results);
  }, [searchTerm, instructors]);

  const handleInstructorClick = (instructorId) => {
    setExpandedInstructor(expandedInstructor === instructorId ? null : instructorId);
  };

  const handleEditInstructor = (instructor) => {
    setCurrentInstructor(instructor);
    setFormData({
      department: instructor.department,
      email: instructor.email,
      employmentStatus: instructor.employmentStatus,
      hireYear: instructor.hireYear,
    });
    setShowModal(true);
  };

  const handleDeleteInstructor = (instructorId) => {
    if (
      window.confirm(`Are you sure you want to delete instructor ${instructorId}?`)
    ) {
      setInstructors(instructors.filter((instructor) => instructor.id !== instructorId));
      setFilteredInstructors(
        filteredInstructors.filter((instructor) => instructor.id !== instructorId)
      );
    }
  };

  const handleSaveInstructor = (e) => {
    e.preventDefault();
    const updatedInstructors = instructors.map((instructor) =>
      instructor.id === currentInstructor.id ? { ...instructor, ...formData } : instructor
    );
    setInstructors(updatedInstructors);
    setFilteredInstructors(
      filteredInstructors.map((instructor) =>
        instructor.id === currentInstructor.id ? { ...instructor, ...formData } : instructor
      )
    );
    setShowModal(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (isLoading) {
    return <div className="page-container">Loading instructor data...</div>;
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
      <h1>Instructor Management</h1>
      <input
        type="text"
        placeholder="Search instructors by name, ID, or department..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredInstructors.length === 0 && !isLoading && !error && (
        <p>No instructors found matching your search.</p>
      )}

      <div>
        {filteredInstructors.map((instructor) => (
          <div key={instructor.id} className="instructor-list-item">
            <div
              className="instructor-info"
              onClick={() => handleInstructorClick(instructor.id)}
            >
              <h3>
                {instructor.name} ({instructor.id})
              </h3>
            </div>
            <div className="instructor-actions">
              <button
                className="edit-button"
                onClick={() => handleEditInstructor(instructor)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDeleteInstructor(instructor.id)}
              >
                Delete
              </button>
              <span
                className={`arrow ${
                  expandedInstructor === instructor.id ? "expanded" : ""
                }`}
              >
                &#9654;
              </span>
            </div>
            <div
              className={`instructor-details ${
                expandedInstructor === instructor.id ? "expanded" : ""
              }`}
            >
              <ul>
                <li>
                  <strong>Department:</strong> {instructor.department}
                </li>
                <li>
                  <strong>Email:</strong> {instructor.email}
                </li>
                <li>
                  <strong>Employment Status:</strong>{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color:
                        instructor.employmentStatus === "Full-Time"
                          ? "var(--primary-color)"
                          : "var(--warning-color)",
                    }}
                  >
                    {instructor.employmentStatus}
                  </span>
                </li>
                <li>
                  <strong>Hire Year:</strong> {instructor.hireYear}
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Instructor: {currentInstructor?.name}</h2>
            <form onSubmit={handleSaveInstructor}>
              <label>
                Department:
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Employment Status:
                <select
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                </select>
              </label>
              <label>
                Hire Year:
                <input
                  type="number"
                  name="hireYear"
                  value={formData.hireYear}
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

export default AdminInstructorList;
