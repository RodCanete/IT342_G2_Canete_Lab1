import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getProfile();
      setProfile(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>User Dashboard</h1>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </nav>

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        {profile && (
          <div className="profile-card">
            <h2>Your Profile</h2>
            <div className="profile-info">
              <div className="info-item">
                <label>Email:</label>
                <span>{profile.email}</span>
              </div>

              <div className="info-item">
                <label>User ID:</label>
                <span>{profile.id}</span>
              </div>

              <div className="info-item">
                <label>Role:</label>
                <span className="badge">{profile.role}</span>
              </div>

              <div className="info-item">
                <label>Account Status:</label>
                <span className={`badge ${profile.isActive ? 'active' : 'inactive'}`}>
                  {profile.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="info-item">
                <label>Member Since:</label>
                <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>

              {profile.lastLoginAt && (
                <div className="info-item">
                  <label>Last Login:</label>
                  <span>{new Date(profile.lastLoginAt).toLocaleString()}</span>
                </div>
              )}
            </div>

            <button onClick={fetchProfile} className="btn-refresh">
              Refresh Profile
            </button>
          </div>
        )}

        {!profile && !error && (
          <div className="no-profile">No profile data available</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
