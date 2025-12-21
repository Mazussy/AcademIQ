import React, { useState, useEffect } from "react";
import { adminApi } from "../api/api";
import "./AdminClassroomManagement.css";

const AdminClassroomManagement = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedClassroom, setExpandedClassroom] = useState(null);
  const [scheduleData, setScheduleData] = useState({});
  const [loadingSchedule, setLoadingSchedule] = useState({});
  const [scheduleError, setScheduleError] = useState({});

  useEffect(() => {
    const fetchClassrooms = async () => {
      setIsLoading(true);
      try {
        const data = await adminApi.classrooms();
        const list = Array.isArray(data) ? data : data?.items || [];
        setClassrooms(list);
      } catch {
        setError("An unexpected error occurred while fetching classroom data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  const handleClassroomClick = async (classroomId) => {
    if (expandedClassroom === classroomId) {
      setExpandedClassroom(null);
    } else {
      setExpandedClassroom(classroomId);
      // Fetch schedule if not already loaded
      if (!scheduleData[classroomId] && !loadingSchedule[classroomId]) {
        await fetchSchedule(classroomId);
      }
    }
  };

  const fetchSchedule = async (classroomId) => {
    console.log("Fetching schedule for classroom:", classroomId);
    setLoadingSchedule((prev) => ({ ...prev, [classroomId]: true }));
    try {
      const data = await adminApi.classroomSchedule(classroomId);
      console.log("Schedule data received:", data);
      setScheduleData((prev) => ({ ...prev, [classroomId]: data }));
    } catch (err) {
      console.error("Schedule fetch error:", err);
      setScheduleError((prev) => ({
        ...prev,
        [classroomId]: "Failed to load schedule data.",
      }));
    } finally {
      setLoadingSchedule((prev) => ({ ...prev, [classroomId]: false }));
    }
  };

  const renderScheduleTable = (classroomId) => {
    if (loadingSchedule[classroomId]) {
      return (
        <div style={{ padding: "10px", color: "var(--text-secondary)" }}>
          Loading schedule...
        </div>
      );
    }

    if (scheduleError[classroomId]) {
      return (
        <div style={{ padding: "10px", color: "var(--danger-color)" }}>
          {scheduleError[classroomId]}
        </div>
      );
    }

    const schedule = scheduleData[classroomId];
    if (!schedule) {
      return (
        <div style={{ padding: "10px", color: "var(--text-secondary)" }}>
          No schedule data available.
        </div>
      );
    }

    // If schedule is an array, render as table
    if (Array.isArray(schedule)) {
      if (schedule.length === 0) {
        return (
          <div style={{ padding: "10px", color: "var(--text-secondary)" }}>
            No schedule entries found.
          </div>
        );
      }

      return (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {Object.keys(schedule[0]).map((key) => (
                <th
                  key={key}
                  style={{
                    border: "1px solid var(--border-color)",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedule.map((item, idx) => (
              <tr key={idx}>
                {Object.values(item).map((val, valIdx) => (
                  <td
                    key={valIdx}
                    style={{
                      border: "1px solid var(--border-color)",
                      padding: "8px",
                    }}
                  >
                    {typeof val === "object"
                      ? JSON.stringify(val)
                      : String(val)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // If schedule is an object, render key-value pairs
    return (
      <div style={{ padding: "10px" }}>
        {Object.entries(schedule).map(([key, value]) => (
          <div key={key} style={{ marginBottom: "8px" }}>
            <strong>{key}:</strong>{" "}
            {typeof value === "object" ? JSON.stringify(value) : String(value)}
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <div className="page-container">Loading classroom data...</div>;
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
      <h1>Classroom Management</h1>
      <div>
        {classrooms.map((classroom) => (
          <div key={classroom.id} className="list-item">
            <div
              className="list-header"
              onClick={() => handleClassroomClick(classroom.id)}
            >
              <h3>{classroom.name}</h3>
              <span
                className={`arrow ${
                  expandedClassroom === classroom.id ? "expanded" : ""
                }`}
              >
                &#9654;
              </span>
            </div>
            <div
              className={`details-container ${
                expandedClassroom === classroom.id ? "expanded" : ""
              }`}
            >
              {expandedClassroom === classroom.id && (
                <div
                  style={{ padding: "10px", color: "var(--text-secondary)" }}
                >
                  {renderScheduleTable(classroom.id)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Classroom schedule view is now active and will fetch data from the endpoint

export default AdminClassroomManagement;
