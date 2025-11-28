import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getClassrooms, updateClassroomAvailability, assignClassroom, getCourses } from '../api/mockApi';
import './AdminClassroomManagement.css';

const AdminClassroomManagement = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [courses, setCourses] = useState([]); // To populate the assign dropdown
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('all'); // 'all', 'available', 'unavailable'
  const [searchQuery, setSearchQuery] = useState('');
  const { adminId } = useParams(); // To be used for API calls if needed

  const fetchClassroomsAndCourses = async () => {
    setIsLoading(true);
    try {
      const [classroomsResponse, coursesResponse] = await Promise.all([
        getClassrooms(),
        getCourses(),
      ]);

      if (classroomsResponse.success) {
        setClassrooms(classroomsResponse.data);
      } else {
        setError(classroomsResponse.message);
      }

      if (coursesResponse.success) {
        setCourses(coursesResponse.data);
      } else {
        setError(coursesResponse.message); // This might overwrite classroom error, handle better in production
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClassroomsAndCourses();
  }, []);

  const handleToggleAvailability = async (classroomId, currentStatus) => {
    try {
      const response = await updateClassroomAvailability(classroomId, !currentStatus);
      if (response.success) {
        alert(response.message);
        fetchClassroomsAndCourses(); // Refresh list
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Error updating availability.');
    }
  };

  const handleAssignCourse = async (classroomId, courseId) => {
    try {
      const response = await assignClassroom(classroomId, courseId === 'unassign' ? null : courseId);
      if (response.success) {
        alert(response.message);
        fetchClassroomsAndCourses(); // Refresh list
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Error assigning classroom.');
    }
  };

  const filteredClassrooms = classrooms.filter((classroom) => {
    const matchesAvailability =
      filterAvailability === 'all' ||
      (filterAvailability === 'available' && classroom.available) ||
      (filterAvailability === 'unavailable' && !classroom.available);

    const matchesSearch =
      classroom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classroom.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (classroom.assignedTo &&
        classroom.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesAvailability && matchesSearch;
  });

  if (isLoading) {
    return <div className="page-container">Loading classroom data...</div>;
  }

  if (error) {
    return <div className="page-container" style={{ color: 'var(--danger-color)' }}>Error: {error}</div>;
  }

  return (
    <div className="page-container classroom-management">
      <h1>Classroom Management</h1>

      <div className="classroom-filter-bar">
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={filterAvailability} onChange={(e) => setFilterAvailability(e.target.value)}>
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      <div className="classroom-list">
        {filteredClassrooms.length === 0 && !isLoading && !error && (
          <p>No classrooms found matching your criteria.</p>
        )}
        {filteredClassrooms.map((classroom) => (
          <div key={classroom.id} className="classroom-card">
            <h3>{classroom.name} ({classroom.id})</h3>
            <p>Capacity: {classroom.capacity}</p>
            <p className="classroom-status">
              Status: <span className={classroom.available ? 'status-available' : 'status-unavailable'}>
                {classroom.available ? 'Available' : 'Unavailable'}
              </span>
            </p>
            {classroom.assignedTo && <p>Assigned To: {classroom.assignedTo}</p>}

            <div className="classroom-actions">
              <button
                onClick={() => handleToggleAvailability(classroom.id, classroom.available)}
                style={{ backgroundColor: classroom.available ? 'var(--danger-color)' : 'var(--primary-color)' }}
              >
                {classroom.available ? 'Mark Unavailable' : 'Mark Available'}
              </button>

              <select
                onChange={(e) => handleAssignCourse(classroom.id, e.target.value)}
                value={classroom.assignedTo || 'unassign'}
              >
                <option value="unassign">Unassign Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.id})
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminClassroomManagement;
