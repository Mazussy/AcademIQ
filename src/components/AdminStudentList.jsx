import React, { useState, useEffect } from 'react';
import { getAllStudents } from '../api/mockApi';
import './AdminStudentList.css';

const AdminStudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedStudent, setExpandedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const response = await getAllStudents();
        if (response.success) {
          setStudents(response.data);
          setFilteredStudents(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('An unexpected error occurred while fetching student data.');
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

  if (isLoading) {
    return <div className="page-container">Loading student data...</div>;
  }

  if (error) {
    return <div className="page-container" style={{ color: 'var(--danger-color)' }}>Error: {error}</div>;
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
            <div className="student-list-header" onClick={() => handleStudentClick(student.id)}>
              <h3>{student.name} ({student.id})</h3>
              <span className={`arrow ${expandedStudent === student.id ? 'expanded' : ''}`}>&#9654;</span>
            </div>
            <div className={`student-details ${expandedStudent === student.id ? 'expanded' : ''}`}>
              <ul>
                <li><strong>Major:</strong> {student.major}</li>
                <li><strong>GPA:</strong> {student.gpa}</li>
                <li><strong>Academic Status:</strong> <span style={{fontWeight: 'bold', color: student.academicStatus === 'Good Standing' ? 'var(--primary-color)' : 'var(--warning-color)'}}>{student.academicStatus}</span></li>
                <li><strong>Overall Credit Hours:</strong> {student.overallCreditHours}</li>
                <li><strong>Enrollment Year:</strong> {student.enrollmentYear}</li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminStudentList;
