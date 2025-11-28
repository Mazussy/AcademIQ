import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginScreen from './components/LoginScreen';
import StudentDashboard from './components/StudentDashboard';
import CoursesPage from './components/CoursesPage';
import AttendancePage from './components/AttendancePage';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';
import AdminStudentList from './components/AdminStudentList';
import AdminCourseManagement from './components/AdminCourseManagement';
import AdminUserRegistry from './components/AdminUserRegistry';
import AdminClassroomManagement from './components/AdminClassroomManagement';


function App() {
  return (
    <Router>
      <Routes>
        {/* Routes without the navbar */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginScreen />} />

        {/* Student Routes with the student navbar */}
        <Route element={<Layout />}>
          <Route path="/dashboard/:studentId" element={<StudentDashboard />} />
          <Route path="/courses/:studentId" element={<CoursesPage />} />
          <Route path="/attendance/:studentId" element={<AttendancePage />} />
        </Route>

        {/* Admin Routes with the admin navbar */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard/:adminId" element={<AdminDashboard />} />
          <Route path="/admin/students/:adminId" element={<AdminStudentList />} />
          <Route path="/admin/courses/:adminId" element={<AdminCourseManagement />} />
          <Route path="/admin/users/:adminId" element={<AdminUserRegistry />} />
          <Route path="/admin/classrooms/:adminId" element={<AdminClassroomManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;