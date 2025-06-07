// src/components/Profile/Profile.jsx

import React, { useState, useEffect } from "react";
import { FaCamera, FaGlobe, FaClock, FaLanguage, FaVenusMars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import './profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: "Harigovind CB",
    nickName: "Viserion",
    email: "reach.viserion@gmail.com",
    gender: "Male",
    country: "India",
    language: "English",
    timeZone: "Asia/Kolkata",
    profileImage: null,
  });

  const [editData, setEditData] = useState({ ...profileData });

  // Update current time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    setProfileData({ ...editData });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        if (isEditing) {
          setEditData(prev => ({ ...prev, profileImage: imageUrl }));
        } else {
          setProfileData(prev => ({ ...prev, profileImage: imageUrl }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const currentData = isEditing ? editData : profileData;

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = () => {
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    return currentTime.toLocaleDateString('en-US', options);
  };

  return (
    <div className="app-container">
      {/* Left sidebar */}
      <div className="sidebar">
        <div className="logo">
          <h1>TASK<span className="logo-highlight"> NINJA</span></h1>
        </div>

        <div className="nav-menu">
          <div className="nav-item">
            <span className="nav-icon">📊</span>
            <button className="nav-text" onClick={() => navigate("/dashboard")}>Dashboard</button>
          </div>

          <div className="nav-item">
            <span className="nav-icon">📝</span>
            <button className="nav-text" onClick={() => navigate("/add-task")}>Add Task</button>
          </div>
          <div className="nav-item">
            <span className="nav-icon">✓</span>
            <button className="nav-text" onClick={() => navigate("/todo")}>To Do</button>
          </div>

          <div className="nav-item active">
            <span className="nav-icon">👨🏻‍💼</span>
            <span className="nav-text">Profile</span>
          </div>
        </div>

        <div className="sidebar-actions">
          <button className="sidebar-btn" onClick={() => navigate("/add-task")}>
            + Add Task
          </button>
          <button className="sidebar-btn logout" onClick={() => {
            localStorage.removeItem("auth");
            navigate("/");
          }}>
            Logout
          </button>
        </div>

      </div>

      {/* Main content */}
      <div className="main-content">
        <div className="profile-container">
          {/* Header */}
          <div className="profile-header">
            <div className="header-left">
              <h1 className="welcome-title">Welcome, {currentData.nickName || currentData.fullName.split(' ')[0]}</h1>
            </div>
            <div className="header-right">
              <p className="header-date">{formatDate()}</p>
              <div className="user-avatar-header">
                {currentData.profileImage ? (
                  <img src={currentData.profileImage} alt="Profile" className="avatar-img" />
                ) : (
                  <div className="avatar-placeholder">
                    {getInitials(currentData.fullName)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-card-header">
              <div className="profile-avatar-section">
                <div className="profile-avatar-container">
                  {currentData.profileImage ? (
                    <img src={currentData.profileImage} alt="Profile" className="profile-avatar" />
                  ) : (
                    <div className="profile-avatar-placeholder">
                      {getInitials(currentData.fullName)}
                    </div>
                  )}
                </div>
                <div className="profile-basic-info">
                  <h2 className="profile-name">{currentData.fullName}</h2>
                  <p className="profile-email">{currentData.email}</p>
                </div>
              </div>
              <button 
                className={`edit-profile-btn ${isEditing ? 'save' : ''}`}
                onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
              >
                {isEditing ? 'Save' : 'Edit'}
              </button>
              {isEditing && (
                <button className="cancel-edit-btn" onClick={handleCancelEdit}>
                  Cancel
                </button>
              )}
            </div>

            {/* Profile Form */}
            <div className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <FaVenusMars className="label-icon" />
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      value={editData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="form-select"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  ) : (
                    <div className="form-display">{currentData.gender}</div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <FaGlobe className="label-icon" />
                    Country
                  </label>
                  {isEditing ? (
                    <select
                      value={editData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="form-select"
                    >
                      <option value="">Select Country</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="India">India</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Japan">Japan</option>
                      <option value="Russia">Russia</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div className="form-display">{currentData.country}</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <FaLanguage className="label-icon" />
                    Language
                  </label>
                  {isEditing ? (
                    <select
                      value={editData.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className="form-select"
                    >
                      <option value="">Select Language</option>
                      <option value="English">English</option>
                      <option value="German">German</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Russian">Russian</option>
                    </select>
                  ) : (
                    <div className="form-display">{currentData.language}</div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <FaClock className="label-icon" />
                    Time Zone
                  </label>
                  {isEditing ? (
                    <select
                      value={editData.timeZone}
                      onChange={(e) => handleInputChange('timeZone', e.target.value)}
                      className="form-select"
                    >
                      <option value="">Select Time Zone</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Europe/London">Europe/London</option>
                      <option value="Asia/Tokyo">Asia/Tokyo</option>
                      <option value="Asia/Dubai">Asia/Dubai</option>
                      <option value="Asia/Kolkata">Asia/Kolkata</option>
                      <option value="Australia/Sydney">Australia/Sydney</option>
                    </select>
                  ) : (
                    <div className="form-display">{currentData.timeZone}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;