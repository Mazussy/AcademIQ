// Mock API removed. This file is intentionally left as a stub.
export {};
// Deprecated: mock API removed. Intentionally left minimal to avoid imports.
export {};
// Legacy content retained as raw string to avoid parsing
const __DEAD = String.raw`

let courses = [ // Make courses mutable
    { id: 'CS101', name: 'Introduction to Computer Science', credits: 3, classroom: 'CR201', instructorId: 'I001', day: 'Sunday', time: '14:00-16:00' },
    { id: 'MA201', name: 'Calculus II', credits: 4, classroom: 'CR101', instructorId: 'I002', day: 'Sunday', time: '11:00-13:00' },
    { id: 'PY105', name: 'General Physics I', credits: 4, classroom: 'CR102', instructorId: 'I003', day: 'Monday', time: '11:00-13:00' },
    { id: 'EN101', name: 'English Composition I', credits: 3, classroom: 'CR101', instructorId: 'I004', day: 'Wednesday', time: '11:00-13:00' },
];

const enrollments = {
  CS101: ['S12345', 'S67890'],
  MA201: ['S12345'],
  PY105: ['S12345'],
  EN101: ['S67890'],
};

let classrooms = [ // Mock classroom data (merged with availability and assignment)
  { id: 'CR101', name: 'Lecture Hall A', capacity: 100, available: true, assignedTo: null },
  { id: 'CR102', name: 'Lecture Hall B', capacity: 80, available: true, assignedTo: null },
  { id: 'CR201', name: 'Seminar Room 1', capacity: 30, available: false, assignedTo: 'CS101' },
  { id: 'CR202', name: 'Seminar Room 2', capacity: 25, available: true, assignedTo: null },
];


// Detailed schedule data per classroom
const classroomSchedules = {
  CR101: [
    { day: 'Sunday', time: '09:00-11:00', courseId: 'CS101' },
    { day: 'Sunday', time: '11:00-13:00', courseId: 'MA201' },
    { day: 'Monday', time: '09:00-11:00', courseId: 'PY105' },
    { day: 'Tuesday', time: '14:00-16:00', courseId: 'CS101' },
    { day: 'Wednesday', time: '11:00-13:00', courseId: 'EN101' },
  ],
  CR102: [
    { day: 'Monday', time: '11:00-13:00', courseId: 'EN101' },
    { day: 'Tuesday', time: '09:00-11:00', courseId: 'MA201' },
    { day: 'Thursday', time: '16:00-18:00', courseId: 'PY105' },
  ],
  CR201: [
    { day: 'Sunday', time: '14:00-16:00', courseId: 'PY105' },
    { day: 'Tuesday', time: '11:00-13:00', courseId: 'EN101' },
    { day: 'Wednesday', time: '09:00-11:00', courseId: 'CS101' },
    { day: 'Thursday', time: '09:00-11:00', courseId: 'MA201' },
  ],
  CR202: [],
};

// Notification data - organized by user ID
let notifications = {
  // Student notifications
  S12345: [
    { id: 'N001', userId: 'S12345', message: 'New assignment posted in Introduction to Computer Science', time: '2 hours ago', read: false, timestamp: Date.now() - 7200000 },
    { id: 'N002', userId: 'S12345', message: 'Your attendance has been marked for Calculus II', time: '5 hours ago', read: false, timestamp: Date.now() - 18000000 },
    { id: 'N003', userId: 'S12345', message: 'Grade posted for General Physics I - Midterm Exam', time: '1 day ago', read: true, timestamp: Date.now() - 86400000 },
  ],
  S67890: [
    { id: 'N004', userId: 'S67890', message: 'Reminder: English Composition I class tomorrow at 11:00 AM', time: '3 hours ago', read: false, timestamp: Date.now() - 10800000 },
  ],
  // Admin notifications
  A001: [
    { id: 'N005', userId: 'A001', message: 'New user registration request pending approval', time: '1 hour ago', read: false, timestamp: Date.now() - 3600000 },
    { id: 'N006', userId: 'A001', message: 'Course CS101 schedule updated successfully', time: '3 hours ago', read: false, timestamp: Date.now() - 10800000 },
    { id: 'N007', userId: 'A001', message: 'Classroom CR201 availability changed', time: '6 hours ago', read: true, timestamp: Date.now() - 21600000 },
  ],
};

let notificationIdCounter = 8; // For generating new notification IDs

const attendanceData = {
  S12345: {
    overallPercentage: 92,
    courses: [
      { id: 'CS101', name: 'Introduction to Computer Science', attended: 28, total: 30, details: [
        { date: '2025-11-24', status: 'Present' },
        { date: '2025-11-21', status: 'Present' },
        { date: '2025-11-19', status: 'Absent' },
      ]},
      { id: 'MA201', name: 'Calculus II', attended: 25, total: 30 },
      { id: 'PY105', name: 'General Physics I', attended: 29, total: 30 },
    ],
  },
  S67890: {
    overallPercentage: 98,
    courses: [
      { id: 'EN101', name: 'English Composition I', attended: 19, total: 20 },
    ],
  },
};

// Mock API functions

/**
 * Simulates a login API call for any user type.
 * @param {string} userId
 * @param {string} password
 * @param {string} role - 'student', 'admin', or 'instructor'
 * @returns {Promise<{success: boolean, user?: object, message: string}>}
 */
export const login = (userId, password, role) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = users[userId];
      if (user && user.password === password && user.role === role) {
        const { password: _password, ...userData } = user;
        resolve({
          success: true,
          user: userData,
          message: 'Login successful!',
        });
      } else {
        resolve({
          success: false,
          message: 'Invalid credentials or role.',
        });
      }
    }, 500); // Simulate network delay
  });
};

/**
 * Simulates fetching student data from an API.
 * @param {string} studentId
 * @returns {Promise<{success: boolean, data?: object, message: string}>}
 */
export const getStudentData = (studentId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const student = users[studentId];
      if (student && student.role === 'student') {
        const { password: _password, ...studentData } = student;
        resolve({
          success: true,
          data: studentData,
          message: 'Data fetched successfully!',
        });
      } else {
        resolve({
          success: false,
          message: 'Student not found.',
        });
      }
    }, 800); // Simulate network delay
  });
};

/**
 * Simulates fetching all student data for admin view.
 * @returns {Promise<{success: boolean, data?: object[], message: string}>}
 */
export const getAllStudents = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allStudents = Object.values(users).filter(user => user.role === 'student');
      const studentsWithoutPasswords = allStudents.map(student => {
        const { password: _password, ...studentData } = student;
        return studentData;
      });
      resolve({
        success: true,
        data: studentsWithoutPasswords,
        message: 'All students fetched successfully!',
      });
    }, 700); // Simulate network delay
  });
};

/**
 * Simulates fetching instructor data from an API.
 * @param {string} instructorId
 * @returns {Promise<{success: boolean, data?: object, message: string}>}
 */
export const getInstructorData = (instructorId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const instructor = users[instructorId];
      if (instructor && instructor.role === 'instructor') {
        const { password: _password, ...instructorData } = instructor;
        resolve({
          success: true,
          data: instructorData,
          message: 'Data fetched successfully!',
        });
      } else {
        resolve({
          success: false,
          message: 'Instructor not found.',
        });
      }
    }, 800); // Simulate network delay
  });
};

/**
 * Simulates fetching all instructor data for admin view.
 * @returns {Promise<{success: boolean, data?: object[], message: string}>}
 */
export const getAllInstructors = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allInstructors = Object.values(users).filter(user => user.role === 'instructor');
      const instructorsWithoutPasswords = allInstructors.map(instructor => {
        const { password, ...instructorData } = instructor;
        return instructorData;
      });
      resolve({
        success: true,
        data: instructorsWithoutPasswords,
        message: 'All instructors fetched successfully!',
      });
    }, 700); // Simulate network delay
  });
};

/**
 * Simulates fetching available courses from an API.
 * @returns {Promise<{success: boolean, data?: object[], message: string}>}
 */
export const getCourses = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: courses,
        message: 'Courses fetched successfully!',
      });
    }, 600); // Simulate network delay
  });
};

/**
 * Simulates fetching roster (list of students) for a specific course.
 * @param {string} courseId
 * @returns {Promise<{success: boolean, data?: object[], message: string}>}
 */
export const getCourseRoster = (courseId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const studentIds = enrollments[courseId] || [];
      const rosterStudents = studentIds.map(studentId => {
        const student = users[studentId];
        if (student) {
          const { password: _password, ...studentData } = student;
          return studentData;
        }
        return null;
      }).filter(student => student !== null);
      
      resolve({
        success: true,
        data: rosterStudents,
        message: 'Course roster fetched successfully!',
      });
    }, 500);
  });
};

/**
 * Simulates fetching courses taught by a specific instructor.
 * @param {string} instructorId
 * @returns {Promise<{success: boolean, data?: object[], message: string}>}
 */
export const getInstructorCourses = (instructorId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const instructorCourses = courses.filter(course => course.instructorId === instructorId);
      resolve({
        success: true,
        data: instructorCourses,
        message: 'Instructor courses fetched successfully!',
      });
    }, 600);
  });
};


/**
 * Simulates adding a new course.
 * @param {object} course - The course object to add.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const addCourse = (course) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (courses.find(c => c.id === course.id)) {
        resolve({ success: false, message: 'Course with this ID already exists.' });
      } else {
        courses.push(course);
        resolve({ success: true, message: 'Course added successfully!' });
      }
    }, 500);
  });
};

/**
 * Simulates updating an existing course.
 * @param {object} updatedCourse - The updated course object.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const updateCourse = (updatedCourse) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = courses.findIndex(c => c.id === updatedCourse.id);
      if (index !== -1) {
        courses[index] = updatedCourse;
        resolve({ success: true, message: 'Course updated successfully!' });
      } else {
        resolve({ success: false, message: 'Course not found.' });
      }
    }, 500);
  });
};

/**
 * Simulates deleting a course.
 * @param {string} courseId - The ID of the course to delete.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const deleteCourse = (courseId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const initialLength = courses.length;
      courses = courses.filter(c => c.id !== courseId);
      if (courses.length < initialLength) {
        resolve({ success: true, message: 'Course deleted successfully!' });
      } else {
        resolve({ success: false, message: 'Course not found.' });
      }
    }, 500);
  });
};

/**
 * Simulates registering a new user.
 * @param {object} userData - The user data to register.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const registerUser = (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (users[userData.id]) {
        resolve({ success: false, message: 'User with this ID already exists.' });
      } else {
        users[userData.id] = { ...userData };
        resolve({ success: true, message: 'User registered successfully!' });
      }
    }, 500);
  });
};

/**
 * Simulates fetching attendance data for a student.
 * @param {string} studentId
 * @returns {Promise<{success: boolean, data?: object, message: string}>}
 */
export const getAttendanceData = (studentId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const data = attendanceData[studentId];
            if (data) {
                resolve({
                    success: true,
                    data: data,
                    message: 'Attendance data fetched successfully!',
                });
            } else {
                resolve({
                    success: false,
                    message: 'Attendance data not found for this student.',
                });
            }
        }, 700); // Simulate network delay
    });
};

/**
 * Simulates fetching all classrooms.
 * @returns {Promise<{success: boolean, data?: object[], message: string}>}
 */
export const getClassrooms = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: classrooms,
        message: 'Classrooms fetched successfully!',
      });
    }, 600);
  });
};

/**
 * Simulates updating a classroom's availability.
 * @param {string} classroomId
 * @param {boolean} available
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const updateClassroomAvailability = (classroomId, available) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const classroom = classrooms.find(c => c.id === classroomId);
      if (classroom) {
        classroom.available = available;
        if (!available) classroom.assignedTo = null; // Unassign if made unavailable
        resolve({ success: true, message: 'Classroom availability updated!' });
      } else {
        resolve({ success: false, message: 'Classroom not found.' });
      }
    }, 500);
  });
};

/**
 * Simulates assigning a classroom to a course.
 * @param {string} classroomId
 * @param {string|null} courseId - The ID of the course to assign, or null to unassign.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const assignClassroom = (classroomId, courseId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const classroom = classrooms.find(c => c.id === classroomId);
      if (classroom) {
        if (courseId && !classroom.available) {
            resolve({ success: false, message: 'Classroom is not available for assignment.' });
            return;
        }
        classroom.assignedTo = courseId;
        classroom.available = !courseId; // Set to unavailable if assigned, available if unassigned
        resolve({ success: true, message: `Classroom ${courseId ? 'assigned to' : 'unassigned from'} ${courseId || 'course'}.` });
      } else {
        resolve({ success: false, message: 'Classroom not found.' });
      }
    }, 500);
  });
};

/**
 * Simulates fetching schedule for a specific classroom.
 * @param {string} classroomId
 * @returns {Promise<{success: boolean, data?: object[], message: string}>}
 */
export const getClassroomSchedules = (classroomId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const schedule = classroomSchedules[classroomId];
      if (schedule) {
        // In a real app, you might want to join this with course data
        const detailedSchedule = schedule.map(slot => {
          const course = courses.find(c => c.id === slot.courseId);
          return {
            ...slot,
            courseName: course ? course.name : 'Unknown Course',
          };
        });
        resolve({
          success: true,
          data: detailedSchedule,
          message: 'Schedule fetched successfully!',
        });
      } else {
        resolve({
          success: false,
          message: 'Schedule not found for this classroom.',
        });
      }
    }, 500);
  });
};

/**
 * Simulates fetching notifications for a user.
 * @param {string} userId - The user ID to fetch notifications for.
 * @returns {Promise<{success: boolean, data?: object[], message: string}>}
 */
export const getNotifications = (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userNotifications = notifications[userId] || [];
      // Sort by timestamp, newest first
      const sortedNotifications = [...userNotifications].sort((a, b) => b.timestamp - a.timestamp);
      resolve({
        success: true,
        data: sortedNotifications,
        message: 'Notifications fetched successfully!',
      });
    }, 300);
  });
};

/**
 * Simulates marking a notification as read.
 * @param {string} userId - The user ID.
 * @param {string} notificationId - The notification ID to mark as read.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const markNotificationAsRead = (userId, notificationId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userNotifications = notifications[userId];
      if (userNotifications) {
        const notification = userNotifications.find(n => n.id === notificationId);
        if (notification) {
          notification.read = true;
          resolve({ success: true, message: 'Notification marked as read.' });
        } else {
          resolve({ success: false, message: 'Notification not found.' });
        }
      } else {
        resolve({ success: false, message: 'User has no notifications.' });
      }
    }, 300);
  });
};

/**
 * Simulates marking all notifications as read for a user.
 * @param {string} userId - The user ID.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const markAllNotificationsAsRead = (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userNotifications = notifications[userId];
      if (userNotifications) {
        userNotifications.forEach(n => n.read = true);
        resolve({ success: true, message: 'All notifications marked as read.' });
      } else {
        resolve({ success: false, message: 'User has no notifications.' });
      }
    }, 300);
  });
};

/**
 * Simulates adding a new notification for a user.
 * @param {string} userId - The user ID to add notification for.
 * @param {string} message - The notification message.
 * @returns {Promise<{success: boolean, data?: object, message: string}>}
 */
export const addNotification = (userId, message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!notifications[userId]) {
        notifications[userId] = [];
      }
      
      const newNotification = {
        id: `N${String(notificationIdCounter++).padStart(3, '0')}`,
        userId,
        message,
        time: 'Just now',
        read: false,
        timestamp: Date.now(),
      };
      
      notifications[userId].unshift(newNotification);
      
      resolve({
        success: true,
        data: newNotification,
        message: 'Notification added successfully!',
      });
    }, 300);
  });
};

/**
 * Simulates deleting a notification.
 * @param {string} userId - The user ID.
 * @param {string} notificationId - The notification ID to delete.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const deleteNotification = (userId, notificationId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (notifications[userId]) {
        const initialLength = notifications[userId].length;
        notifications[userId] = notifications[userId].filter(n => n.id !== notificationId);
        if (notifications[userId].length < initialLength) {
          resolve({ success: true, message: 'Notification deleted successfully!' });
        } else {
          resolve({ success: false, message: 'Notification not found.' });
        }
      } else {
        resolve({ success: false, message: 'User has no notifications.' });
      }
    }, 300);
  });
};

// Mock data for sent notifications (for instructors to view their sent notifications)
let sentNotifications = [];
let sentNotificationIdCounter = 1;

/**
 * Simulates sending a notification to a student.
 * @param {string} studentId - The student ID to send notification to.
 * @param {string} message - The notification message.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const sendNotification = (studentId, message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const student = users[studentId];
      if (student && student.role === 'student') {
        // Add notification to student's notifications
        addNotification(studentId, message);
        
        // Store in sent notifications for instructor to view
        const sentNotification = {
          id: `SN${String(sentNotificationIdCounter++).padStart(3, '0')}`,
          studentName: student.name,
          studentId: studentId,
          message: message,
          date: new Date().toLocaleDateString(),
          timestamp: Date.now(),
        };
        sentNotifications.push(sentNotification);
        
        resolve({
          success: true,
          message: 'Notification sent successfully!',
        });
      } else {
        resolve({
          success: false,
          message: 'Student not found.',
        });
      }
    }, 500);
  });
};

/**
 * Simulates fetching sent notifications (for instructors).
 * @returns {Promise<{success: boolean, data?: object[], message: string}>}
 */
export const getSentNotifications = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Sort by timestamp, newest first
      const sorted = [...sentNotifications].sort((a, b) => b.timestamp - a.timestamp);
      resolve({
        success: true,
        data: sorted,
        message: 'Sent notifications fetched successfully!',
      });
    }, 300);
  });
};

`;
