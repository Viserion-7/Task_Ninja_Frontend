import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTracking, setIsTracking] = useState(false);
  const [trackedTime, setTrackedTime] = useState(0);
  const [tasks, setTasks] = useState([]);

  // Load tasks from localStorage
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  const formattedDate = () => {
    const options = { weekday: 'short', day: 'numeric', year: 'numeric' };
    return new Date().toLocaleDateString('en-US', options).replace(',', '');
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => {
        setTrackedTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleTimeTracking = () => {
    setIsTracking(!isTracking);
  };

  // Compute stats from tasks
  const completedCount = tasks.filter(t => t.completed).length;
  const activeTasks = tasks.filter(t => !t.completed);
  const weeklyActivity = tasks.length > 0 ? Math.floor((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="app-container">
      {/* Sidebar */}
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
            <span className="nav-icon">📝</span>
            <button className="nav-text" onClick={() => navigate("/add-task")}>Add Task</button>
          </div>

          <div className="nav-item">
            <span className="nav-icon">⏱️</span>
            <span className="nav-text">Timesheets</span>
          </div>

          <div className="nav-item">
            <span className="nav-icon">✓</span>
            <button className="nav-text" onClick={() => navigate("/todo")}>To Do</button>
          </div>

          <div className="nav-item">
            <span className="nav-icon">⚙️</span>
            <button className="nav-text" onClick={() => navigate("/profile")}>Settings</button>
          </div>
        </div>

        <div className="sidebar-actions">
          <button className="sidebar-btn" onClick={() => navigate("/add-task")}>+ Add Task</button>
          <button className="sidebar-btn logout" onClick={() => {
            localStorage.removeItem("auth");
            navigate("/");
          }}>Logout</button>
        </div>

        <div className="workspace-selector">
          <div className="workspace-label">Workspace</div>
          <div className="workspace-value">
            Matrix Domain <span className="dropdown-icon">▼</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
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
              <div className="tracker-text">{isTracking ? "Tracking Time..." : "Start Time Tracker"}</div>
              <div className="tracked-time">{formatTime(trackedTime)}</div>
              <button className="tracker-btn" onClick={toggleTimeTracking}>
                {isTracking ? "⏸" : "▶"}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-title">Weekly Activity</div>
              </div>
              <div className="stat-content">
                <div className="stat-value">{weeklyActivity}%</div>
                <div className="stat-icon activity-icon">📊</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-title">Worked This Week</div>
              </div>
              <div className="stat-content">
                <div className="stat-value">{formatTime(trackedTime)}</div>
                <div className="stat-icon time-icon">⏱️</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-title">Tasks Added</div>
              </div>
              <div className="stat-content">
                <div className="stat-value">{tasks.length}</div>
                <div className="stat-icon project-icon">📁</div>
              </div>
            </div>
          </div>

          {/* Project (all tasks) + To Do (incomplete tasks) */}
          <div className="dual-section-grid">
            <div className="section-card">
              <div className="section-header">
                <div className="section-title">Projects</div>
              </div>
              <div className="projects-list">
                {tasks.map(task => (
                  <div className="project-item" key={task.id}>
                    <div className="project-icon">📁</div>
                    <div className="project-name">{task.title}</div>
                    <div className="project-time">{task.dueDate || "No due date"}</div>
                    <div className="project-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: task.completed ? "100%" : "10%" }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <div className="section-header">
                <div className="section-title">To Do</div>
              </div>
              <div className="todos-list">
                {activeTasks.map(todo => (
                  <div className="todo-item" key={todo.id}>
                    <div className="todo-icon">📋</div>
                    <div className="todo-name">{todo.title}</div>
                    <div className="todo-time">{todo.dueDate || "No date"}</div>
                    <div className="todo-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: "0%" }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;