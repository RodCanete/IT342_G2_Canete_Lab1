import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import GlassSurface from '../components/GlassSurface';
import './Dashboard.css';

const Dashboard = () => {
  const { logout } = useAuth();
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
          <>
            <div className="stats-grid">
              <GlassSurface borderRadius={16} backgroundOpacity={0.15}>
                <div className="stat-card">
                  <div className="stat-title">Welcome</div>
                  <div className="stat-value">{profile.email}</div>
                </div>
              </GlassSurface>

              <GlassSurface borderRadius={16} backgroundOpacity={0.15}>
                <div className="stat-card">
                  <div className="stat-title">Role</div>
                  <div className="stat-value">{profile.role || 'User'}</div>
                </div>
              </GlassSurface>

              <GlassSurface borderRadius={16} backgroundOpacity={0.15}>
                <div className="stat-card">
                  <div className="stat-title">Status</div>
                  <div className={`stat-value status ${profile.isActive ? 'active' : 'inactive'}`}>
                    {profile.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </GlassSurface>

              <GlassSurface borderRadius={16} backgroundOpacity={0.15}>
                <div className="stat-card">
                  <div className="stat-title">Member Since</div>
                  <div className="stat-value">{new Date(profile.createdAt).toLocaleDateString()}</div>
                </div>
              </GlassSurface>
            </div>
          </>
        )}

        {!profile && !error && (
          <div className="no-profile">No profile data available</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
