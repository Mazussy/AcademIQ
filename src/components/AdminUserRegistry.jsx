import React, { useState, useEffect } from "react";
import { registerApi } from "../api/api";
import "./AdminUserRegistry.css";

const AdminUserRegistry = () => {
  const [activeTab, setActiveTab] = useState("student"); // 'student', 'admin', 'instructor'

  // Common fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Student-specific fields
  const [majorId, setMajorId] = useState("");
  const [gpa, setGpa] = useState("");
  const [academicStatus, setAcademicStatus] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState("");
  const [overallCreditHours, setOverallCreditHours] = useState("");
  const [majors, setMajors] = useState([]);

  // Instructor-specific fields
  const [office, setOffice] = useState("");
  const [title, setTitle] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const tabRefs = React.useRef({
    student: null,
    admin: null,
    instructor: null,
  });

  const [underlineStyle, setUnderlineStyle] = React.useState({
    width: 0,
    left: 0,
  });

  React.useEffect(() => {
    const activeTabRef = tabRefs.current[activeTab];
    if (activeTabRef) {
      setUnderlineStyle({
        width: activeTabRef.offsetWidth,
        left: activeTabRef.offsetLeft,
      });
    }
  }, [activeTab]);

  const fetchMajors = async () => {
    try {
      setIsFetchingData(true);
      const data = await registerApi.getAllMajors();
      const majorsList = Array.isArray(data) ? data : data?.items || [];
      setMajors(majorsList);
    } catch {
      setError("Failed to load majors.");
    } finally {
      setIsFetchingData(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      setIsFetchingData(true);
      const data = await registerApi.getAllDepartments();
      const departmentsList = Array.isArray(data) ? data : data?.items || [];
      setDepartments(departmentsList);
    } catch {
      setError("Failed to load departments.");
    } finally {
      setIsFetchingData(false);
    }
  };

  // Load majors and departments on tab change
  useEffect(() => {
    if (activeTab === "student" && majors.length === 0) {
      fetchMajors();
    } else if (activeTab === "instructor" && departments.length === 0) {
      fetchDepartments();
    }
  }, [activeTab, majors.length, departments.length]);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhoneNumber('');
    setPassword('');
    setConfirmPassword('');
    setMajorId('');
    setGpa('');
    setAcademicStatus('');
    setEnrollmentDate('');
    setOverallCreditHours('');
    setOffice('');
    setTitle('');
    setDepartmentId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);


    const academicStatusMap = {
      Regular: 0,
      Suspended: 1,
      Probation: 2,
    };

    // Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      setError("All required fields must be filled.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    // Role-specific validation
    if (activeTab === "student") {
      if (
        !majorId ||
        !gpa ||
        !academicStatus ||
        !enrollmentDate ||
        !overallCreditHours
      ) {
        setError("All student fields are required.");
        setIsLoading(false);
        return;
      }
      // Ensure date is in yyyy-mm-dd
      const parsedDate = new Date(enrollmentDate);
      if (Number.isNaN(parsedDate.getTime())) {
        setError("Enrollment date is invalid. Use yyyy-mm-dd.");
        setIsLoading(false);
        return;
      }
    } else if (activeTab === "instructor") {
      if (!office || !title || !departmentId) {
        setError("All instructor fields are required.");
        setIsLoading(false);
        return;
      }
    }

    try {
      if (activeTab === "student") {
        const studentDTO = {
          newStudent: {
            User_Id: "",
            UserId: "",
            firstname: firstName,
            lastname: lastName,
            email,
            phoneNumber,
            password,
            confirmPassword,
            major_Id: majorId,
            gpa: parseFloat(gpa),
            academic_Status: academicStatusMap[academicStatus],
            enrollment_Date: new Date(enrollmentDate)
              .toISOString()
              .split("T")[0], // yyyy-mm-dd
            overallCreditsHours: parseInt(overallCreditHours),
          },
        };
        await registerApi.registerStudent(studentDTO);
        setSuccess("Student registered successfully!");
      } else if (activeTab === "instructor") {
        const instructorDTO = {
          newInstructor: {
            User_Id: "",
            UserId: "",
            firstname: firstName,
            lastname: lastName,
            email,
            phoneNumber,
            password,
            confirmPassword,
            departmnet_Id: departmentId,
            office,
            title,
          },
        };
        await registerApi.registerInstructor(instructorDTO);
        setSuccess("Instructor registered successfully!");
      } else if (activeTab === "admin") {
        const adminDTO = {
          User_Id: "",
          UserId: "",
          firstname: firstName,
          lastname: lastName,
          email,
          phoneNumber,
          password,
          confirmPassword,
        };
        await registerApi.registerAdmin(adminDTO);
        setSuccess("Admin registered successfully!");
      }
      resetForm();
    } catch (err) {
      setError(
        err?.data?.message ||
          "An unexpected error occurred during registration."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isLoading}
            placeholder="Enter first name"
            required
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isLoading}
            placeholder="Enter last name"
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            placeholder="Enter email"
            required
          />
        </label>
        <label>
          Phone Number:
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={isLoading}
            placeholder="Enter phone number"
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            placeholder="Enter password"
            required
          />
        </label>
        <label>
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            placeholder="Confirm password"
            required
          />
        </label>

        {/* Student-specific fields */}
        {activeTab === 'student' && (
          <>
            <label>
              Major:
              <select
                value={majorId}
                onChange={(e) => setMajorId(e.target.value)}
                disabled={isLoading || isFetchingData}
                required
              >
                <option value="">-- Select a Major --</option>
                {majors.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name || m.code}
                  </option>
                ))}
              </select>
            </label>
            <label>
              GPA:
              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                disabled={isLoading}
                placeholder="Enter GPA"
                required
              />
            </label>
            <label>
              Academic Status:
              <select
                value={academicStatus}
                onChange={(e) => setAcademicStatus(e.target.value)}
                disabled={isLoading}
                required
              >
                <option value="">-- Select Academic Status --</option>
                <option value="Regular">Regular</option>
                <option value="Suspended">Suspended</option>
                <option value="Probation">Probation</option>
              </select>
              {academicStatus && (
                <div
                  className={`status-indicator status-${academicStatus.toLowerCase()}`}
                >
                  {academicStatus}
                </div>
              )}
            </label>
            <label>
              Enrollment Date:
              <input
                type="date"
                value={enrollmentDate}
                onChange={(e) => setEnrollmentDate(e.target.value)}
                disabled={isLoading}
                required
              />
            </label>
            <label>
              Overall Credit Hours:
              <input
                type="number"
                min="0"
                value={overallCreditHours}
                onChange={(e) => setOverallCreditHours(e.target.value)}
                disabled={isLoading}
                placeholder="Enter credit hours"
                required
              />
            </label>
          </>
        )}

        {/* Instructor-specific fields */}
        {activeTab === 'instructor' && (
          <>
            <label>
              Department:
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                disabled={isLoading || isFetchingData}
                required
              >
                <option value="">-- Select a Department --</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name || dept.code}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Office:
              <input
                type="text"
                value={office}
                onChange={(e) => setOffice(e.target.value)}
                disabled={isLoading}
                placeholder="Enter office location"
                required
              />
            </label>
            <label>
              Title:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter title"
                disabled={isLoading}
                required
              />
            </label>
          </>
        )}

        <button
          type="submit"
          className="register-button"
          disabled={isLoading}
          style={{ width: '100%', marginTop: '10px', marginBottom: '5px' }}
        >
          {isLoading ? 'Registering...' : 'Register User'}
        </button>
      </form>
    );
  };

  return (
    <div className="centered-container">
      <div className="card">
        <h1 style={{ marginBottom: '30px' }}>Register New User</h1>
        <div className="register-tabs">
          <div
            className="tab-underline"
            style={{
              width: underlineStyle.width,
              left: underlineStyle.left,
            }}
          ></div>
          <button
            ref={(el) => (tabRefs.current.student = el)}
            className={`register-tab ${activeTab === 'student' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('student');
              resetForm();
            }}
            type="button"
          >
            Student
          </button>
          <button
            ref={(el) => (tabRefs.current.admin = el)}
            className={`register-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('admin');
              resetForm();
            }}
            type="button"
          >
            Admin
          </button>
          <button
            ref={(el) => (tabRefs.current.instructor = el)}
            className={`register-tab ${activeTab === 'instructor' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('instructor');
              resetForm();
            }}
            type="button"
          >
            Instructor
          </button>
        </div>

        {renderForm()}

        {error && (
          <p style={{ color: 'var(--danger-color)', marginTop: '15px' }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{ color: 'var(--success-color)', marginTop: '15px' }}>
            {success}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminUserRegistry;
