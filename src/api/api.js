import { http, setToken } from "./http";

// Helpers
function extractToken(loginResponse) {
  if (!loginResponse) return null;
  if (typeof loginResponse === "string") return loginResponse;
  if (loginResponse.token) return loginResponse.token;
  if (loginResponse.accessToken) return loginResponse.accessToken;
  if (loginResponse.data && loginResponse.data.token)
    return loginResponse.data.token;
  if (loginResponse.data && loginResponse.data.accessToken)
    return loginResponse.data.accessToken;
  if (loginResponse.result && loginResponse.result.token)
    return loginResponse.result.token;
  if (loginResponse.jwt) return loginResponse.jwt;
  if (loginResponse.tokenString) return loginResponse.tokenString;
  return null;
}

// Auth
export async function login(email, password) {
  const debug =
    typeof localStorage !== "undefined" &&
    localStorage.getItem("apiDebug") === "1";
  // Try common DTO shapes used by .NET backends
  const variants = [
    { Email: email, Password: password },
    { email, password },
    { UserName: email, Password: password },
    { userName: email, password },
    { username: email, password },
  ];

  let lastErr;
  for (let i = 0; i < variants.length; i++) {
    const payload = variants[i];
    try {
      if (debug) {
        console.debug("[auth] login variant", i + 1, Object.keys(payload));
      }
      const resp = await http.post("/api/identity/Account/Login", payload);
      const token = extractToken(resp);
      if (!token) {
        console.warn(
          "[auth] Login response without token; response shape:",
          resp
        );
        // Some backends set auth via cookie; accept success without token
        setToken("");
        return { success: true, token: "" };
      }
      setToken(token);
      return { success: true, token };
    } catch (err) {
      lastErr = err;
      if (debug) {
        console.debug("[auth] variant failed", i + 1, {
          status: err?.status,
          data: err?.data,
        });
      }
      // Try next variant for server errors or bad request binding
      if (
        !err ||
        (err.status &&
          (err.status === 500 || err.status === 400 || err.status === 415))
      ) {
        continue;
      }
      // For 401/403, stop early (credentials likely wrong)
      if (err.status === 401 || err.status === 403) {
        break;
      }
    }
  }
  throw lastErr || new Error("Login failed");
}

export async function logout() {
  try {
    await http.post("/api/identity/Account/Logout");
  } catch {
    /* ignore */
  }
  setToken(null);
}

// Student
export const studentApi = {
  dashboard: async () => http.get("/api/customer/Student/StudentDashboard"),
  schedule: async () => http.get("/api/customer/Student/StudentSchedule"),
  notifications: async () =>
    http.get("/api/customer/Student/GetStudentNotifications"),
  // Attendance endpoint needs confirmation; temporarily align with user note
  attendance: async () =>
    http.get("/api/customer/Student/GetStudentNotifications"),
};

// Enrollment (Student)
export const enrollmentApi = {
  availableOfferings: async () =>
    http.get("/api/customer/Enrollment/GetAllCourseOfferingsForStudent"),
  myEnrollments: async () =>
    http.get("/api/customer/Enrollment/GetAllEnrollments"),
  registerCourse: async (id) =>
    http.post(`/api/customer/Enrollment/RegisterCourse/${id}`),
  deleteRegisteredCourse: async (id) =>
    http.del(`/api/customer/Enrollment/DeleteRegisterdCourse/${id}`),
};

// Instructor
export const instructorApi = {
  info: async () => http.get("/api/customer/Instructor/InstructorInfo"),
  scheduling: async () =>
    http.get("/api/customer/Instructor/SchedulingOfInstructor"),
  allCourses: async () => http.get("/api/customer/Instructor/AllCourses"),
  studentsRegistered: async (id) =>
    http.get(`/api/customer/Instructor/AllStudentRegistred/${id}`),
  markAttendance: async (enrollmentId, status) =>
    http.post("/api/customer/Instructor/MarkAttendance", {
      enrollmentId,
      status,
    }),
  sendNotification: async ({ student_Id, course_Id, type_Alert, message }) =>
    http.post("/api/customer/Instructor/SendNotification", {
      student_Id,
      course_Id,
      type_Alert,
      message,
    }),
};

// Admin
export const adminApi = {
  classrooms: async () => http.get("/api/admin/ClassRoom/AllClassRooms"),
  classroomSchedule: async (classRoomId) =>
    http.get(`/api/admin/ClassRoom/GetClassRoomSchedule/${classRoomId}`),
  allStudents: async () => http.get("/api/admin/User/GetAllStudent"),
  allInstructors: async () => http.get("/api/admin/User/GetAllInstructor"),
  editStudent: async (studentDTO) =>
    http.put("/api/admin/User/EditStudent", studentDTO),
  editInstructor: async (instructorDTO) =>
    http.put("/api/admin/User/EditInstructor", instructorDTO),
  lockUnlockStudent: async (id) =>
    http.put(`/api/admin/User/LockUnLockStudent/${id}`),
  lockUnlockInstructor: async (id) =>
    http.put(`/api/admin/User/LockUnLockInstructor/${id}`),
  deleteStudent: async (id) => http.del(`/api/admin/User/DeleteStudent/${id}`),
  deleteInstructor: async (id) =>
    http.del(`/api/admin/User/DeleteInstructor/${id}`),
  majors: async () => http.get("/api/admin/Major"),
  // Try common department endpoints to improve compatibility with backend variations
  departments: async () => {
    const candidates = [
      "/api/admin/Department",
      "/api/admin/Department/AllDepartments",
      "/api/admin/Departments",
      "/api/admin/Department/GetAll",
    ];
    let lastErr;
    for (const path of candidates) {
      try {
        const res = await http.get(path);
        return res;
      } catch (err) {
        lastErr = err;
        continue;
      }
    }
    throw lastErr || new Error("Departments fetch failed");
  },
  courses: async () => http.get("/api/admin/Course/AllCourses"),
  addCourse: async (courseDTO) =>
    http.post("/api/admin/Course/AddCourse", courseDTO),
  editCourse: async (id, courseDTO) =>
    http.put(
      `/api/admin/Course/EditCourse?Id=${encodeURIComponent(id)}`,
      courseDTO
    ),
  deleteCourse: async (id) => http.del(`/api/admin/Course/DeleteCourse/${id}`),
};

// Admin - Registration
export const registerApi = {
  registerStudent: async (studentDTO) =>
    http.post("/api/identity/Account/RegisterStudent", studentDTO),
  registerInstructor: async (instructorDTO) =>
    http.post("/api/identity/Account/InstructorRegister", instructorDTO),
  registerAdmin: async (adminDTO) =>
    http.post("/api/identity/Account/AdminRegister", adminDTO),
  getAllMajors: async () => http.get("/api/identity/Account/GetAllMajors"),
  getAllDepartments: async () =>
    http.get("/api/identity/Account/GetAllDepartments"),
};
