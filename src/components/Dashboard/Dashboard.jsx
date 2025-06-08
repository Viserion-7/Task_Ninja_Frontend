import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import taskService from '../../services/taskService';
import { Toast, ToastContainer } from '../Toast/Toast';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [currentOverdueTask, setCurrentOverdueTask] = useState(null);

  // Format helpers
  const formattedDate = () => {
    const options = { weekday: 'short', day: 'numeric', year: 'numeric' };
    return new Date().toLocaleDateString('en-US', options).replace(',', '');
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllTasks();
      setTasks(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Check overdue tasks
  useEffect(() => {
    const overdueList = tasks.filter(task =>
      taskService.isTaskOverdue(task) && !task.is_completed
    );
    setOverdueTasks(overdueList);

    if (overdueList.length > 0 && !currentOverdueTask) {
      setCurrentOverdueTask(overdueList[0]);
      setShowToast(true);
    }
  }, [tasks, currentOverdueTask]);

  const handleReschedule = async () => {
    if (!currentOverdueTask) return;

    try {
      await taskService.rescheduleTask(currentOverdueTask.id);
      const updatedOverdue = overdueTasks.filter(task => task.id !== currentOverdueTask.id);
      setOverdueTasks(updatedOverdue);

      if (updatedOverdue.length > 0) {
        setCurrentOverdueTask(updatedOverdue[0]);
      } else {
        setCurrentOverdueTask(null);
        setShowToast(false);
      }

      fetchTasks();
    } catch (err) {
      setError('Failed to reschedule task');
    }
  };

  const handleCloseToast = () => {
    const currentIndex = overdueTasks.findIndex(task => task.id === currentOverdueTask.id);
    if (currentIndex < overdueTasks.length - 1) {
      setCurrentOverdueTask(overdueTasks[currentIndex + 1]);
    } else {
      setShowToast(false);
      setCurrentOverdueTask(null);
    }
  };

  // Stats
  const completedCount = tasks.filter(t => t.is_completed).length;
  const weeklyActivity = tasks.length > 0 ? Math.floor((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="app-container">
      {/* Sidebar */}
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
            <span className="nav-icon">📝</span>
            <button className="nav-text" onClick={() => navigate("/add-task")}>Add Task</button>
          </div>
          <div className="nav-item">
            <span className="nav-icon">✓</span>
            <button className="nav-text" onClick={() => navigate("/todo")}>To Do</button>
          </div>
          <div className="nav-item">
            <span className="nav-icon">👨🏻‍💼</span>
            <button className="nav-text" onClick={() => navigate("/profile")}>Profile</button>
          </div>
        </div>
        <div className="sidebar-actions">
          <button className="sidebar-btn logout" onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        <div className="header">
          <div className="header-left">
            <button className="menu-toggle">☰</button>
            <h2 className="header-title">Dashboard</h2>
            {error && <div className="error-message">{error}</div>}
            {loading && <div className="loading-message">Loading tasks...</div>}
          </div>
        </div>

        <div className="today-section">
          <div className="today-header">
            <div className="today-title">
              <h1>Today</h1>
              <div className="today-date">{formattedDate()} | {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header"><div className="stat-title">Weekly Activity</div></div>
              <div className="stat-content">
                <div className="stat-value">{weeklyActivity}%</div>
                <div className="stat-icon activity-icon">📊</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-header"><div className="stat-title">Tasks Added</div></div>
              <div className="stat-content">
                <div className="stat-value">{tasks.length}</div>
                <div className="stat-icon project-icon">📁</div>
              </div>
            </div>
          </div>

          {/* Task list */}
          <div className="dual-section-grid">
            <div className="section-card">
              <div className="section-header"><div className="section-title">Projects</div></div>
              <div className="projects-list">
                {tasks.map(task => (
                  <div className="project-item" key={task.id}>
                    <div className="project-icon">📁</div>
                    <div className="project-name">{task.title}</div>
                    <div className="project-time">{task.due_date || "No due date"}</div>
                    <div className="project-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: task.is_completed ? "100%" : "10%" }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {currentOverdueTask && (
        <Toast
          show={showToast}
          title="Task Overdue"
          message={`"${currentOverdueTask.title}" is overdue. Would you like to reschedule it?`}
          onClose={handleCloseToast}
          onAction={handleReschedule}
          actionText="Reschedule +1 Day"
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
