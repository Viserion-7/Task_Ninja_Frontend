import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import taskService from "../../services/taskService";
import { Toast } from "../Toast/Toast";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [currentOverdueTask, setCurrentOverdueTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Update overdue tasks list when tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      const overdueList = tasks.filter(
        (task) => taskService.isTaskOverdue(task) && !task.is_completed
      );
      setOverdueTasks(overdueList);
    }
  }, [tasks]);

  // Handle showing toast for overdue tasks
  useEffect(() => {
    if (overdueTasks.length > 0 && !currentOverdueTask) {
      setCurrentOverdueTask(overdueTasks[0]);
      setShowToast(true);
    }
  }, [overdueTasks, currentOverdueTask]);

  const fetchTasks = async () => {
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch tasks");
      setLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!currentOverdueTask) return;

    try {
      await taskService.rescheduleTask(currentOverdueTask.id);

      // Update tasks list without fetching
      const updatedTasks = tasks.map(task => 
        task.id === currentOverdueTask.id 
          ? { ...task, due_date: new Date(new Date(task.due_date).getTime() + 24 * 60 * 60 * 1000).toISOString() }
          : task
      );
      setTasks(updatedTasks);

      // Remove current task from overdue list
      const updatedOverdue = overdueTasks.filter(
        (task) => task.id !== currentOverdueTask.id
      );
      setOverdueTasks(updatedOverdue);

      // Clear current overdue task
      setCurrentOverdueTask(null);
      setShowToast(false);

    } catch (err) {
      setError("Failed to reschedule task");
    }
  };

  const handleCloseToast = () => {
    // Move to next overdue task if exists
    const currentIndex = overdueTasks.findIndex(
      (task) => task.id === currentOverdueTask.id
    );
    if (currentIndex < overdueTasks.length - 1) {
      setCurrentOverdueTask(overdueTasks[currentIndex + 1]);
    } else {
      setShowToast(false);
      setCurrentOverdueTask(null);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <h1>
            TASK<span className="logo-highlight"> NINJA</span>
          </h1>
        </div>
        <div className="nav-menu">
          <div className="nav-item active">
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">📝</span>
            <button className="nav-text" onClick={() => navigate("/add-task")}>
              Add Task
            </button>
          </div>
          <div className="nav-item">
            <span className="nav-icon">✓</span>
            <button className="nav-text" onClick={() => navigate("/todo")}>
              To Do
            </button>
          </div>
          <div className="nav-item">
            <span className="nav-icon">👨🏻‍💼</span>
            <button className="nav-text" onClick={() => navigate("/profile")}>
              Profile
            </button>
          </div>
        </div>
        <div className="sidebar-actions">
          <button className="sidebar-btn" onClick={() => navigate("/add-task")}>
            + Add Task
          </button>
          <button className="sidebar-btn logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        <div className="header">
          <div className="header-left">
            <h2 className="header-title">Dashboard</h2>
            {error && <div className="error-message">{error}</div>}
            {loading && <div className="loading-message">Loading tasks...</div>}
          </div>
        </div>

        {/* Today section */}
        <div className="today-section">
          {/* Project (all tasks) + To Do (incomplete tasks) */}
          <div className="dual-section-grid">
            <div className="section-card">
              <div className="section-header">
                <div className="section-title">Projects</div>
              </div>
              <div className="projects-list">
                {tasks.map((task) => (
                  <div className="project-item" key={task.id}>
                    <div className="project-icon">📁</div>
                    <div className="project-name">{task.title}</div>
                    <div className="project-time">
                      {task.due_date 
                        ? new Date(task.due_date).toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : "No due date"}
                    </div>
                    <div className="project-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: task.is_completed ? "100%" : "10%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast for overdue tasks */}
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
    </div>
  );
};

export default Dashboard;
