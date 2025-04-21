import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTracking, setIsTracking] = useState(false);
  const [trackedTime, setTrackedTime] = useState(0);

  // Format date to display as in the design
  const formattedDate = () => {
    const options = { weekday: 'short', day: 'numeric', year: 'numeric' };
    const date = new Date();
    return date.toLocaleDateString('en-US', options).replace(',', '');
  };

  // Format time for the timer display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start/stop time tracking
  const toggleTimeTracking = () => {
    setIsTracking(!isTracking);
  };

  // Update timer when tracking is active
  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => {
        setTrackedTime(prev => prev + 1); // Increment trackedTime every second
      }, 1000);
    } else {
      clearInterval(interval); // Clear interval when tracking stops
    }
    return () => clearInterval(interval); // Cleanup interval on component unmount or isTracking change
  }, [isTracking]);

  // Update current time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Projects data
  const projects = [
    { id: 1, name: 'Project one', time: '00:40:00', progress: 75 },
    { id: 2, name: 'Project Two', time: '00:10:00', progress: 30 },
    { id: 3, name: 'Project Three', time: '00:20:00', progress: 60 },
    { id: 4, name: 'Project Four', time: '00:30:00', progress: 45 }
  ];

  // To-do items
  const todos = [
    { id: 1, name: 'Creating Wireframe', time: '00:40:00', progress: 80 },
    { id: 2, name: 'Research Development', time: '00:20:00', progress: 40 }
  ];

  // Team members
  const members = [
    {
      id: 1,
      name: 'John Ekeler',
      role: 'Food Dashboard Design',
      description: 'Creating UI and Research',
      todayHours: '00:40:00',
      weekHours: '08:40:00',
      avatar: '👤'
    },
    {
      id: 2,
      name: 'Rubik Sans',
      role: 'Project Name',
      description: 'Creating UI and Research',
      todayHours: '00:40:00',
      weekHours: '08:40:00',
      avatar: '👤'
    }
  ];

  // Activity images (placeholders)
  const activityImages = [
    { id: 1, src: "/api/placeholder/300/200", alt: "Code" },
    { id: 2, src: "/api/placeholder/300/200", alt: "Design" },
    { id: 3, src: "/api/placeholder/300/200", alt: "Analysis" },
    { id: 4, src: "/api/placeholder/300/200", alt: "Code 2" },
    { id: 5, src: "/api/placeholder/300/200", alt: "Analytics" }
  ];

  return (
    <div className="app-container">
      {/* Left sidebar */}
      <div className="sidebar">
        <div className="logo">
          <h1>TASK<span className="logo-highlight">Y.</span></h1>
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
            <span className="nav-icon">⏱️</span>
            <span className="nav-text">Timesheets</span>
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

        <div className="workspace-selector">
          <div className="workspace-label">Workspace</div>
          <div className="workspace-value">
            Matrix Domain
            <span className="dropdown-icon">▼</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="header-left">
            <button className="menu-toggle">☰</button>
            <h2 className="header-title">Dashboard</h2>
          </div>

          <div className="header-center">
            <div className="search-box">
              <input type="text" placeholder="Search Project..." />
              <button className="search-btn">🔍</button>
            </div>
          </div>

          <div className="header-right">
            <div className="notification">
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">3</span>
            </div>

            <div className="user-profile">
              <div className="user-info">
                <div className="user-name">Manjay Gupta</div>
                <div className="user-role">Web Designer</div>
              </div>
              <div className="user-avatar">MG</div>
            </div>
          </div>
        </div>

        {/* Today section */}
        <div className="today-section">
          <div className="today-header">
            <div className="today-title">
              <h1>Today</h1>
              <div className="today-date">{formattedDate()} | {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
            </div>

            <div className="time-tracker">
              <div className="tracker-text">
                {isTracking ? "Tracking Time..." : "Start Time Tracker"}
              </div>
              <div className="tracked-time">{formatTime(trackedTime)}</div>
              <button className="tracker-btn" onClick={toggleTimeTracking}>
                {isTracking ? "⏸" : "▶"}
              </button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-title">Weekly Activity</div>
                <button className="options-btn">:</button>
              </div>
              <div className="stat-content">
                <div className="stat-value">0%</div>
                <div className="stat-icon activity-icon">📊</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-title">Worked This Week</div>
                <button className="options-btn">:</button>
              </div>
              <div className="stat-content">
                <div className="stat-value">40:00:05</div>
                <div className="stat-icon time-icon">⏱️</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-title">Project Worked</div>
                <button className="options-btn">:</button>
              </div>
              <div className="stat-content">
                <div className="stat-value">02</div>
                <div className="stat-icon project-icon">📁</div>
              </div>
            </div>
          </div>

          {/* Projects section */}
          <div className="dual-section-grid">
            <div className="section-card">
              <div className="section-header">
                <div className="section-title">Projects</div>
                <button className="options-btn">:</button>
              </div>

              <div className="projects-list">
                {projects.map(project => (
                  <div className="project-item" key={project.id}>
                    <div className="project-icon">📁</div>
                    <div className="project-name">{project.name}</div>
                    <div className="project-time">{project.time}</div>
                    <div className="project-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="view-all-container right">
                  <button className="view-all-button dark">View All</button>
                </div>
              </div>
            </div>

            <div className="section-card">
              <div className="section-header">
                <div className="section-title">To Do</div>
                <button className="options-btn">:</button>
              </div>

              <div className="todos-content">
                <div className="todos-header">
                  <div className="todos-label">To Dos</div>
                  <div className="time-label">Time</div>
                </div>

                <div className="todos-list">
                  {todos.map(todo => (
                    <div className="todo-item" key={todo.id}>
                      <div className="todo-icon">📋</div>
                      <div className="todo-name">{todo.name}</div>
                      <div className="todo-time">{todo.time}</div>
                      <div className="todo-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${todo.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="view-all-container right">
                  <button className="view-all-button dark">View Reports</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;