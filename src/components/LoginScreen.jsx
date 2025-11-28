import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/mockApi';
import './LoginScreen.css';

const LoginScreen = () => {
  const [activeTab, setActiveTab] = useState('student'); // 'student', 'admin', 'instructor'
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await login(userId, password, activeTab);
      if (response.success) {
        if (response.user.role === 'student') {
          navigate(`/dashboard/${response.user.id}`);
        } else if (response.user.role === 'admin') {
          // Placeholder for admin dashboard navigation
          navigate(`/admin/dashboard/${response.user.id}`);
        }
        // Add instructor navigation later
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    const idLabel = activeTab === 'student' ? 'Student ID' : 'User ID';
    const idPlaceholder = activeTab === 'student' ? 'e.g., S12345' : 'e.g., A001';
    
    return (
      <form onSubmit={handleLogin}>
        <label>
          {idLabel}:
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
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
        <button type="submit" disabled={isLoading} style={{ width: '100%', marginTop: '10px' }}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    );
  }

  return (
    <div className="centered-container">
      <div className="card">
        <div className="login-tabs">
          <button
            className={`login-tab ${activeTab === 'student' ? 'active' : ''}`}
            onClick={() => setActiveTab('student')}
          >
            Student
          </button>
          <button
            className={`login-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            Admin
          </button>
          <button
            className={`login-tab ${activeTab === 'instructor' ? 'active' : ''}`}
            onClick={() => setActiveTab('instructor')}
          >
            Instructor
          </button>
        </div>
        
        {renderForm()}
        
        {error && <p style={{ color: 'var(--danger-color)', marginTop: '15px' }}>{error}</p>}
      </div>
    </div>
  );
};

export default LoginScreen;
