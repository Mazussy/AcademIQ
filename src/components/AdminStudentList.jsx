import React, { useState, useEffect } from "react";
import { adminApi } from "../api/api";
import "./AdminStudentList.css";

const AdminStudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [majors, setMajors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    user_Id: "",
    major_Id: "",
    major_Name: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gpa: "",
    academic_Status: "",
    enrollment_Date: "",
    overallCreditHours: "",
  });

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      // Fetch both students and majors in parallel
      const [studentsData, majorsData] = await Promise.all([
        adminApi.allStudents(),
        adminApi.majors(),
      ]);
      
      // Create a map of major ID to major name
      const majorsList = Array.isArray(majorsData) ? majorsData : (majorsData?.items || []);
      const majorMap = {};
      majorsList.forEach(major => {
        majorMap[major.id] = major.name || major.id;
      });
      setMajors(majorsList);

      // Normalize students with major names
      const list = Array.isArray(studentsData) ? studentsData : (studentsData?.items || []);
      const normalized = list.map((s) => ({
        id: s.id || s.userId || s.studentId,
        user_Id: s.user_Id || s.userId || s.id,
        firstName: s.firstName || '',
        lastName: s.lastName || '',
        name: s.studentName || s.name || [s.firstName, s.lastName].filter(Boolean).join(' '),
        email: s.email || '—',
        phoneNumber: s.phoneNumber || '—',
        major_Id: s.major_Id || s.majorId || '',
        majorName: majorMap[s.major_Id] || s.major_Name || s.major || '—',
        gpa: s.gpa ?? '—',
        academic_Status: s.academic_Status ?? s.academicStatus ?? 0,
        overallCreditHours: s.overallCreditsHours ?? s.overallCreditHours ?? '—',
        enrollment_Date: s.enrollment_Date || '',
        enrollmentYear: s.enrollmentYear || (s.enrollment_Date ? new Date(s.enrollment_Date).getFullYear() : '—'),
      }));
      setStudents(normalized);
      setFilteredStudents(normalized);
    } catch {
      setError("An unexpected error occurred while fetching student data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const results = students.filter(
      (student) =>
        student.name.toLowerCase().includes(lowercasedFilter) ||
        student.id.toLowerCase().includes(lowercasedFilter) ||
        student.majorName.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredStudents(results);
  }, [searchTerm, students]);

  const handleStudentClick = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const handleEditStudent = (student) => {
    setCurrentStudent(student);
    // Parse name if firstName/lastName are empty
    let firstName = student.firstName;
    let lastName = student.lastName;
    if (!firstName && !lastName && student.name) {
      const nameParts = student.name.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }
    setFormData({
      id: student.id,
      user_Id: student.user_Id || student.id,
      major_Id: student.major_Id,
      major_Name: student.majorName,
      firstName: firstName,
      lastName: lastName,
      email: student.email === '—' ? '' : student.email,
      phoneNumber: student.phoneNumber === '—' ? '' : student.phoneNumber,
      gpa: student.gpa === '—' ? '' : student.gpa,
      academic_Status: student.academic_Status,
      enrollment_Date: student.enrollment_Date,
      overallCreditHours: student.overallCreditHours === '—' ? '' : student.overallCreditHours,
    });
    setShowModal(true);
  };

  const handleDeleteStudent = async (studentId) => {
    if (
      window.confirm(`Are you sure you want to delete student ${studentId}?`)
    ) {
      try {
        console.log('Deleting student with ID:', studentId);
        await adminApi.deleteStudent(studentId);
        setStudents(students.filter((student) => student.id !== studentId));
        setFilteredStudents(
          filteredStudents.filter((student) => student.id !== studentId)
        );
        alert('Student deleted successfully!');
      } catch (err) {
        console.error('Error deleting student:', err);
        console.error('Error response:', err?.response?.data);
        console.error('Error status:', err?.response?.status);
        alert(`Failed to delete student: ${err?.response?.data?.message || err?.message || 'Unknown error'}`);
      }
    }
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    try {
      const creditHours = parseInt(formData.overallCreditHours) || 0;
      
      // Send all required fields according to the API spec
      const payload = {
        id: formData.id,
        user_Id: formData.user_Id,
        major_Id: formData.major_Id,
        major_Name: formData.major_Name,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        gpa: parseFloat(formData.gpa) || 0,
        academic_Status: parseInt(formData.academic_Status),
        enrollment_Date: formData.enrollment_Date,
        overallCreditHours: creditHours,
        overallCreditsHours: creditHours, // Try both field name variations
      };
      
      console.log('Sending student update payload:', payload);
      console.log('Credit hours value:', creditHours, 'from formData:', formData.overallCreditHours);
      
      // Make API call to save changes
      const response = await adminApi.editStudent(payload);
      console.log('Student update response:', response);
      
      // Refetch student list to get updated data from server
      await fetchStudents();
      
      setShowModal(false);
      alert('Student updated successfully!');
    } catch (err) {
      console.error('Error updating student:', err);
      console.error('Error details:', err?.response?.data || err?.message);
      alert(`Failed to update student: ${err?.response?.data?.message || err?.message || 'Unknown error'}`);
    }
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
                {student.name}
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
                  <strong>Major:</strong> {student.majorName}
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
                        student.academic_Status === 0
                          ? "var(--primary-color)"
                          : student.academic_Status === 1
                          ? "var(--warning-color)"
                          : "var(--danger-color)",
                    }}
                  >
                    {student.academic_Status === 0 ? 'Regular' : student.academic_Status === 1 ? 'Probation' : 'Suspended'}
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
                Major:
                <select
                  name="major_Id"
                  value={formData.major_Id}
                  onChange={(e) => {
                    const selectedMajor = majors.find(m => m.id === e.target.value);
                    setFormData({
                      ...formData,
                      major_Id: e.target.value,
                      major_Name: selectedMajor?.name || ''
                    });
                  }}
                  required
                >
                  <option value="">Select a major</option>
                  {majors.map(major => (
                    <option key={major.id} value={major.id}>{major.name}</option>
                  ))}
                </select>
              </label>
              <label>
                GPA:
                <input
                  type="number"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleFormChange}
                  step="0.01"
                  min="0"
                  max="4"
                  required
                />
              </label>
              <label>
                Academic Status:
                <select
                  name="academic_Status"
                  value={formData.academic_Status}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="0">Regular</option>
                  <option value="1">Probation</option>
                  <option value="2">Suspended</option>
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
                Enrollment Date:
                <input
                  type="date"
                  name="enrollment_Date"
                  value={formData.enrollment_Date ? formData.enrollment_Date.split('T')[0] : ''}
                  onChange={(e) => {
                    // Convert to ISO datetime format expected by API
                    const dateValue = e.target.value ? new Date(e.target.value).toISOString() : '';
                    setFormData({ ...formData, enrollment_Date: dateValue });
                  }}
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
