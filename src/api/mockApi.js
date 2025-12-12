// Simulate a database of users
let users = { // Make users mutable
  // Students
  S12345: {
    id: 'S12345',
    name: 'John Doe',
    major: 'Computer Science',
    gpa: 3.8,
    academicStatus: 'Good Standing',
    overallCreditHours: 90,
    enrollmentYear: 2022,
    password: 'password',
    role: 'student',
  },
  S67890: {
    id: 'S67890',
    name: 'Jane Smith',
    major: 'Software Engineering',
    gpa: 3.9,
    academicStatus: 'Excellent',
    overallCreditHours: 120,
    enrollmentYear: 2021,
    password: 'password123',
    role: 'student',
  },
  // Admins
  A001: {
    id: 'A001',
    name: 'Dr. Evelyn Reed',
    email: 'e.reed@academiqu.edu',
    password: 'admin',
    role: 'admin',
  },
};

let courses = [ // Make courses mutable
    { id: 'CS101', name: 'Introduction to Computer Science', credits: 3 },
    { id: 'MA201', name: 'Calculus II', credits: 4 },
    { id: 'PY105', name: 'General Physics I', credits: 4 },
    { id: 'EN101', name: 'English Composition I', credits: 3 },
];

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
        const { password, ...userData } = user;
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
        const { password, ...studentData } = student;
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
        const { password, ...studentData } = student;
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
