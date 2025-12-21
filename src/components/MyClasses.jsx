import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { instructorApi } from "../api/api";
import "./CoursesPage.css";

const MyClasses = () => {
  const { instructorId } = useParams();
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoading(true);
      try {
        const data = await instructorApi.scheduling();
        // Handle array or single object response
        const list = Array.isArray(data) ? data : [data];
        setSchedule(list);
      } catch {
        setError("An unexpected error occurred while fetching schedule.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [instructorId]);

  if (isLoading) {
    return <div className="page-container">Loading schedule...</div>;
  }

  if (error) {
    return (
      <div className="page-container" style={{ color: "var(--danger-color)" }}>
        Error: {error}
      </div>
    );
  }

  if (!schedule || schedule.length === 0) {
    return (
      <div className="page-container">
        <h1>My Classes</h1>
        <p style={{ color: "var(--text-secondary)" }}>No schedule available.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>My Classes Schedule</h1>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "left",
                }}
              >
                Course Name
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "left",
                }}
              >
                Class Room
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "left",
                }}
              >
                Day & Time
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "left",
                }}
              >
                Semester
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                Capacity
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                Enrolled
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "left",
                }}
              >
                Start Date
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "left",
                }}
              >
                End Date
              </th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item, idx) => (
              <tr
                key={idx}
                style={{
                  backgroundColor: idx % 2 === 0 ? "#ffffff" : "#fafafa",
                }}
              >
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  {item.courseName || "N/A"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  {item.class_Room_Name || "N/A"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  {item.day_Time || "N/A"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  {item.semester || "N/A"}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  {item.capacity || "N/A"}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  {item.enrolled_Count || 0}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  {item.Start_Date
                    ? new Date(item.Start_Date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  {item.end_Date
                    ? new Date(item.end_Date).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyClasses;
