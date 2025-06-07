// src/components/AddTask/AddTask.jsx

import React, { useState } from "react";
import { FaRobot, FaCheckCircle, FaTrashAlt, FaCalendar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import './AddTask.css';

const AddTask = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("priority");
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addNewTask = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert("Title is required");
    const newTask = {
      id: Date.now(),
      ...formData,
      completed: false,
      createdAt: new Date(),
    };
     // Fetch existing tasks from localStorage
    const existing = JSON.parse(localStorage.getItem("tasks")) || [];

  // Add new task to existing array
    const updatedTasks = [newTask, ...existing];

  // Save updated array to localStorage
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

  // Optional: Reset form and show alert
    setFormData({ title: "", description: "", dueDate: "", priority: "medium" });
    alert("Task added!");
};

  const toggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    if (window.confirm("Delete this task?")) {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    }
  };

  const renderTasks = () => {
    let filtered = [...tasks];

    const today = new Date().toISOString().split("T")[0];
    if (filter === "today") {
      filtered = filtered.filter((t) => t.dueDate === today);
    } else if (filter === "upcoming") {
      filtered = filtered.filter((t) => !t.completed && (!t.dueDate || t.dueDate > today));
    } else if (filter === "completed") {
      filtered = filtered.filter((t) => t.completed);
    }

    if (sortBy === "priority") {
      const order = { high: 1, medium: 2, low: 3 };
      filtered.sort((a, b) => order[a.priority] - order[b.priority]);
    } else if (sortBy === "due-date") {
      filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else {
      filtered.sort((a, b) => b.createdAt - a.createdAt);
    }

    return filtered.map((task) => (
      <div
        key={task.id}
        className={`task-card ${task.priority}-priority ${task.completed ? "completed" : ""}`}
      >
        <div className="task-content">
          <div className="task-info">
            <h4 className="task-title">{task.title}</h4>
            {task.description && <p className="task-description">{task.description}</p>}
            <div className="task-date">
              <FaCalendar className="calendar-icon" />
              <span>{task.dueDate || "No Due Date"}</span>
            </div>
          </div>
          <div className="task-actions">
            <button className="action-button" onClick={() => toggleComplete(task.id)}>
              <FaCheckCircle className={task.completed ? "completed-icon" : ""} />
            </button>
            <button className="action-button" onClick={() => deleteTask(task.id)}>
              <FaTrashAlt />
            </button>
          </div>
        </div>
      </div>
    ));
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

          <div className="nav-item active">
            <span className="nav-icon">📝</span>
            <span className="nav-text">Add Task</span>
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

        {/* Add Task & Logout Buttons */}
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
        <div className="container">
          <header className="app-header">
            <div className="app-branding">
              <h1 className="app-title">AI Task Manager</h1>
              <p className="app-subtitle">Your intelligent productivity companion</p>
            </div>
            <div className="app-controls">
              <input
                type="text"
                placeholder="Search tasks..."
                className="search-input"
              />
              <button
                onClick={() => setShowAISuggestions((prev) => !prev)}
                className="ai-button"
              >
                <FaRobot />
                <span>AI Suggestions</span>
              </button>
            </div>
          </header>

          <div className="main-grid">
            {/* Add Task Form */}
            <form
              onSubmit={addNewTask}
              className="task-form"
            >
              <h2 className="form-title">Add New Task</h2>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={handleInputChange}
                className="form-input"
              />
              <textarea
                id="description"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
              ></textarea>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="form-input"
              />
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button
                type="submit"
                className="submit-button"
              >
                Add Task
              </button>
            </form>

            {/* Task List Section */}
            <div className="tasks-container">
              <div className="filter-bar">
                <div className="filter-buttons">
                  {["all", "today", "upcoming", "completed"].map((f) => (
                    <button
                      key={f}
                      className={`filter-button ${filter === f ? "active" : ""}`}
                      onClick={() => setFilter(f)}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="priority">Priority</option>
                  <option value="due-date">Due Date</option>
                  <option value="created">Recently Added</option>
                </select>
              </div>

              <div className="task-list">{renderTasks()}</div>
            </div>
          </div>

          {/* AI Suggestion Panel */}
          {showAISuggestions && (
            <div className="ai-suggestions">
              <h3 className="suggestions-title">AI Suggestions</h3>
              <p className="suggestion-item">
                You have 3 high priority tasks. Focus on them.
              </p>
              <p className="suggestion-item">
                "Complete project report" has been pending. Want to reschedule?
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddTask;