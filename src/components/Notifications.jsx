import React, { useState, useEffect } from 'react';
import { instructorApi } from '../api/api';
import './Notifications.css';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('send'); // 'send' or 'view'
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await instructorApi.allCourses();
        const list = Array.isArray(data) ? data : (data?.items || []);
        setCourses(list.map((c) => ({ id: c.id || c.course_Id, name: c.courseName || c.name })));
      } catch {
        // ignore for now
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    // No sent notifications endpoint provided; keep section empty
  }, [activeTab]);

  const openModal = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setNotificationMessage('');
  };

  const handleSendNotification = async () => {
    if (selectedStudent && notificationMessage) {
      try {
        await instructorApi.sendNotification({ student_Id: selectedStudent.id, message: notificationMessage });
        alert('Notification sent successfully!');
        closeModal();
      } catch {
        alert('Failed to send notification.');
      }
    }
  };

  const filteredStudents = students.filter((student) =>
    (student.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCourseChange = async (e) => {
    const id = e.target.value;
    setSelectedCourse(id);
    if (!id) { setStudents([]); return; }
    try {
      const data = await instructorApi.studentsRegistered(id);
      const list = Array.isArray(data) ? data : (data?.items || []);
      setStudents(list.map((s) => ({ id: s.id || s.userId || s.studentId, name: s.name || [s.firstName, s.lastName].filter(Boolean).join(' ') })));
    } catch {
      setStudents([]);
    }
  };

  return (
    <div className="page-container notifications-container">
      <h1>Notifications</h1>
      
      <div className="tab-buttons">
        <button
          className={`tab-button ${activeTab === 'send' ? 'active' : ''}`}
          onClick={() => setActiveTab('send')}
        >
          Send Notification
        </button>
        <button
          className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          View Sent Notifications
        </button>
      </div>

      {activeTab === 'send' ? (
        <div className="send-section">
          <select value={selectedCourse || ''} onChange={handleCourseChange} className="search-bar">
            <option value="">Select a course to load students…</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name || c.id}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search for a student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
          <div className="items-list">
            {filteredStudents.map((student) => (
              <div key={student.id} className="list-item">
                <div className="item-info">
                  <h3>{student.name}</h3>
                  <p className="student-id">ID: {student.id}</p>
                </div>
                <button
                  className="send-button"
                  onClick={() => openModal(student)}
                >
                  Send Notification
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="view-section">
          <div className="items-list">
            {notifications.map((notification) => (
              <div key={notification.id} className="list-item notification-item">
                <div className="notification-header">
                  <div>
                    <h3>To: {notification.studentName}</h3>
                    <p className="notification-date">Date: {notification.date}</p>
                  </div>
                </div>
                <div className="notification-body">
                  <p>{notification.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Send Notification to {selectedStudent?.name}</h2>
            <textarea
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              placeholder="Enter your notification message"
              className="notification-textarea"
            />
            <div className="modal-actions">
              <button className="send-modal-button" onClick={handleSendNotification}>
                Send
              </button>
              <button className="cancel-modal-button" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
