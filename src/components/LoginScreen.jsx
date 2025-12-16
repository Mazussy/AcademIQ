import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api";
import "./LoginScreen.css";

const LoginScreen = () => {
  const [activeTab, setActiveTab] = useState("student"); // 'student', 'admin', 'instructor'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login(email, password);
      if (response.success) {
        // We still use the role tab to decide where to go.
        if (activeTab === "student") {
          // ID will be resolved by pages using token; keep placeholder in URL
          navigate(`/dashboard/me`);
        } else if (activeTab === "admin") {
          navigate(`/admin/dashboard/admin`);
        } else if (activeTab === "instructor") {
          navigate(`/instructor/dashboard/me`);
        }
      } else {
        setError("Invalid credentials.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    const idLabel = "Email";
    const idPlaceholder = "your@email.com";

    return (
      <form onSubmit={handleLogin}>
        <label>
          {idLabel}:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            placeholder={idPlaceholder}
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
          />
        </label>
        <button
          type="submit"
          className="login-button"
          disabled={isLoading}
          style={{ width: "100%", marginTop: "10px" }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    );
  };

  // no-op helper removed

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

  return (
    <div className="centered-container">
      <div className="card">
        <div className="login-tabs">
          <div
            className="tab-underline"
            style={{
              width: underlineStyle.width,
              left: underlineStyle.left,
            }}
          ></div>
          <button
            ref={(el) => (tabRefs.current.student = el)}
            className={`login-tab ${activeTab === "student" ? "active" : ""}`}
            onClick={() => setActiveTab("student")}
          >
            Student
          </button>
          <button
            ref={(el) => (tabRefs.current.admin = el)}
            className={`login-tab ${activeTab === "admin" ? "active" : ""}`}
            onClick={() => setActiveTab("admin")}
          >
            Admin
          </button>
          <button
            ref={(el) => (tabRefs.current.instructor = el)}
            className={`login-tab ${
              activeTab === "instructor" ? "active" : ""
            }`}
            onClick={() => setActiveTab("instructor")}
          >
            Instructor
          </button>
        </div>

        {renderForm()}

        {error && (
          <p style={{ color: "var(--danger-color)", marginTop: "15px" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
