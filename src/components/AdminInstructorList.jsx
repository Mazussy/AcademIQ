import React, { useState, useEffect } from "react";
import { adminApi } from "../api/api";
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
    id: "",
    user_Id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    departmnet_Id: "",
    departmnet_Name: "",
    office: "",
    title: "",
  });

  useEffect(() => {
    const fetchInstructors = async () => {
      setIsLoading(true);
      try {
        const data = await adminApi.allInstructors();
        const list = Array.isArray(data) ? data : (data?.items || []);
        const normalized = list.map((i) => ({
          id: i.id || i.user_Id || i.instructorId,
          user_Id: i.user_Id || i.id,
          firstName: i.firstName || i.firstname || "",
          lastName: i.lastName || i.lastname || "",
          name: i.fullName || i.name || [i.firstName || i.firstname, i.lastName || i.lastname].filter(Boolean).join(" ") || i.id,
          email: i.email || '—',
          phoneNumber: i.phoneNumber || '—',
          departmnet_Id: i.departmnet_Id || i.departmentId || "",
          departmnet_Name: i.departmnet_Name || i.departmentName || i.department || i.departmnet_Id || "—",
          office: i.office || i.office_Number || i.officeNumber || i.office_Location || i.officeLocation || "—",
          title: i.title || "",
        }));
        setInstructors(normalized);
        setFilteredInstructors(normalized);
      } catch {
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
        instructor.departmnet_Name.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredInstructors(results);
  }, [searchTerm, instructors]);

  const handleInstructorClick = (instructorId) => {
    setExpandedInstructor(expandedInstructor === instructorId ? null : instructorId);
  };

  const handleEditInstructor = (instructor) => {
    setCurrentInstructor(instructor);
    // If firstName/lastName are empty, derive from the full name
    let firstName = instructor.firstName;
    let lastName = instructor.lastName;
    if (!firstName && !lastName && instructor.name) {
      const nameParts = instructor.name.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }
    setFormData({
      id: instructor.id,
      user_Id: instructor.user_Id || instructor.id,
      firstName: firstName,
      lastName: lastName,
      email: instructor.email,
      phoneNumber: instructor.phoneNumber === '—' ? '' : instructor.phoneNumber,
      departmnet_Id: instructor.departmnet_Id,
      departmnet_Name: instructor.departmnet_Name,
      office: instructor.office === '—' ? '' : instructor.office,
      title: instructor.title,
    });
    setShowModal(true);
  };

  const handleDeleteInstructor = async (instructorId) => {
    if (
      window.confirm(`Are you sure you want to delete instructor ${instructorId}?`)
    ) {
      try {
        console.log('Deleting instructor with ID:', instructorId);
        await adminApi.deleteInstructor(instructorId);
        setInstructors(instructors.filter((instructor) => instructor.id !== instructorId));
        setFilteredInstructors(
          filteredInstructors.filter((instructor) => instructor.id !== instructorId)
        );
        alert('Instructor deleted successfully!');
      } catch (err) {
        console.error('Error deleting instructor:', err);
        console.error('Error response:', err?.response?.data);
        console.error('Error status:', err?.response?.status);
        alert(`Failed to delete instructor: ${err?.response?.data?.message || err?.message || 'Unknown error'}`);
      }
    }
  };

  const handleSaveInstructor = async (e) => {
    e.preventDefault();
    try {
      // Send all required fields including hidden id, user_Id, and departmnet_Id
      const payload = {
        id: formData.id,
        user_Id: currentInstructor.user_Id || formData.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        departmnet_Id: formData.departmnet_Id,
        departmnet_Name: formData.departmnet_Name,
        office: formData.office,
        title: formData.title,
      };
      
      console.log('Sending instructor update payload:', payload);
      
      // Make API call to save changes
      const response = await adminApi.editInstructor(payload);
      console.log('Instructor update response:', response);
      
      // Update local state only after successful API response
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
      alert('Instructor updated successfully!');
    } catch (err) {
      console.error('Error updating instructor:', err);
      console.error('Error details:', err?.response?.data || err?.message);
      alert(`Failed to update instructor: ${err?.response?.data?.message || err?.message || 'Unknown error'}`);
    }
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
              <h3>{instructor.name}</h3>
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
                  <strong>Department:</strong> {instructor.departmnet_Name}
                </li>
                <li>
                  <strong>Email:</strong> {instructor.email}
                </li>
                <li>
                  <strong>Office:</strong> {instructor.office}
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
                First Name:
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleFormChange}
                  disabled
                  style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleFormChange}
                  disabled
                  style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
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
                Phone Number:
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleFormChange}
                />
              </label>
              <label>
                Department:
                <input
                  type="text"
                  name="departmnet_Name"
                  value={formData.departmnet_Name}
                  onChange={handleFormChange}
                  disabled
                  style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                />
              </label>
              <label>
                Title:
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select a title</option>
                  <option value="Dr">Dr</option>
                  <option value="Prof">Prof</option>
                  <option value="Assoc Prof">Assoc Prof</option>
                  <option value="Asst Prof">Asst Prof</option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="TA">TA</option>
                </select>
              </label>
              <label>
                Office:
                <input
                  type="text"
                  name="office"
                  value={formData.office}
                  onChange={handleFormChange}
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
