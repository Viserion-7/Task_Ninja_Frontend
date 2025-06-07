// src/components/Profile/Profile.jsx

import React, { useState, useEffect } from "react";
import { FaEdit, FaCamera, FaEnvelope, FaUser, FaGlobe, FaClock, FaLanguage, FaVenusMars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import './profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [showAddEmail, setShowAddEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const [profileData, setProfileData] = useState({
    fullName: "Alexa Rawles",
    nickName: "Alex",
    email: "alexarawles@gmail.com",
    gender: "Female",
    country: "United States",
    language: "English",
    timeZone: "UTC-5 (Eastern Time)",
    profileImage: null,
    emailAddresses: [
      {
        id: 1,
        email: "alexarawles@gmail.com",
        addedDate: "1 month ago",
        isPrimary: true
      }
    ]
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

  const handleAddEmail = () => {
    if (newEmail && newEmail.includes('@')) {
      const newEmailObj = {
        id: Date.now(),
        email: newEmail,
        addedDate: "Just now",
        isPrimary: false
      };
      
      if (isEditing) {
        setEditData(prev => ({
          ...prev,
          emailAddresses: [...prev.emailAddresses, newEmailObj]
        }));
      } else {
        setProfileData(prev => ({
          ...prev,
          emailAddresses: [...prev.emailAddresses, newEmailObj]
        }));
      }
      
      setNewEmail("");
      setShowAddEmail(false);
    }
  };

  const removeEmail = (emailId) => {
    const emailToRemove = profileData.emailAddresses.find(e => e.id === emailId);
    if (emailToRemove && emailToRemove.isPrimary) {
      alert("Cannot remove primary email address");
      return;
    }

    if (isEditing) {
      setEditData(prev => ({
        ...prev,
        emailAddresses: prev.emailAddresses.filter(e => e.id !== emailId)
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        emailAddresses: prev.emailAddresses.filter(e => e.id !== emailId)
      }));
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
          <h1>TASK<span className="logo-highlight">Y.</span></h1>
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
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Settings</span>
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
              <p className="header-date">{formatDate()}</p>
            <div className="header-right">
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
                  <div className="avatar-upload-overlay">
                    <input 
                      type="file" 
                      id="avatar-upload" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="avatar-input"
                    />
                    <label htmlFor="avatar-upload" className="avatar-upload-btn">
                      <FaCamera />
                    </label>
                  </div>
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
                    <FaUser className="label-icon" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="form-input"
                      placeholder="Your Full Name"
                    />
                  ) : (
                    <div className="form-display">{currentData.fullName}</div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <FaUser className="label-icon" />
                    email
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.nickName}
                      onChange={(e) => handleInputChange('nickName', e.target.value)}
                      className="form-input"
                      placeholder="Your email"
                    />
                  ) : (
                    <div className="form-display">{currentData.nickName}</div>
                  )}
                </div>
              </div>

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
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Japan">Japan</option>
                      <option value="India">India</option>
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
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Portuguese">Portuguese</option>
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
                      <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
                      <option value="UTC-6 (Central Time)">UTC-6 (Central Time)</option>
                      <option value="UTC-7 (Mountain Time)">UTC-7 (Mountain Time)</option>
                      <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
                      <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                      <option value="UTC+1 (CET)">UTC+1 (CET)</option>
                      <option value="UTC+9 (JST)">UTC+9 (JST)</option>
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