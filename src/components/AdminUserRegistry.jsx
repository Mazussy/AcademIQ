import React, { useState } from 'react';
import { registerUser } from '../api/mockApi';
import './AdminUserRegistry.css';

const AdminUserRegistry = () => {
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!userId || !name || !password || !role) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }

    const userData = {
      id: userId,
      name: name,
      password: password,
      role: role,
      // Add other relevant fields based on role if needed
      ...(role === 'student' && { major: 'Undecided', gpa: 0.0, academicStatus: 'N/A', overallCreditHours: 0, enrollmentYear: new Date().getFullYear() }),
      ...(role === 'admin' && { email: `${userId.toLowerCase()}@academiqu.edu` }),
      // Add instructor specific fields here
    };

    try {
      const response = await registerUser(userData);
      if (response.success) {
        setSuccess(response.message);
        setUserId('');
        setName('');
        setPassword('');
        setRole('student');
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('An unexpected error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="user-registry-form">
        <h1>Register New User</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userId">User ID:</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)} disabled={isLoading}>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register User'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
};

export default AdminUserRegistry;
