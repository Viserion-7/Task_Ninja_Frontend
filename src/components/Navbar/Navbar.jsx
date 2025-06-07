import React from 'react';
import './Navbar.css'; // Optional styling

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
          <h1>TASK<span className="logo-highlight"> NINJA</span></h1>
      </div>

      <div className="nav-menu">
        <div className="nav-item active">
          <span className="nav-icon">📊</span>
          <span className="nav-text">Dashboard</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">📈</span>
          <span className="nav-text">Analytic</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">✓</span>
          <span className="nav-text">Todo</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">📝</span>
          <span className="nav-text">Report</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">⚙️</span>
          <span className="nav-text">Settings</span>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;