import React, { useState, useEffect } from "react";
import { FaRobot, FaCheckCircle, FaTrashAlt, FaCalendar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import taskService from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import './AddTask.css';

const AddTask = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("priority");
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // Get tomorrow's date at 9 AM as default
  const getTomorrowAt9AM = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: getTomorrowAt9AM(),
    priority: "Normal",
    category: ""
  });

  useEffect(() => {
    // Fetch categories when component mounts
    const fetchCategories = async () => {
      try {
        const categoriesData = await taskService.getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      }
    };

    // Fetch existing tasks
    const fetchTasks = async () => {
      try {
        const tasksData = await taskService.getAllTasks();
        setTasks(tasksData);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks');
      }
    };

    fetchCategories();
    fetchTasks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addNewTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert("Title is required");
    if (!formData.due_date) return alert("Due date is required");
    
    setLoading(true);
    setError(null);
    
    try {
      // Set the time to 9 AM in local timezone
      const dueDate = new Date(formData.due_date);
      dueDate.setHours(9, 0, 0, 0);
      
      // Convert to UTC for API
      const utcDate = new Date(
        dueDate.getTime() - (dueDate.getTimezoneOffset() * 60000)
      );

      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        due_date: utcDate.toISOString(), // Send in UTC ISO format
        category: formData.category || null,
        is_completed: false
      };

      console.log('Local date:', dueDate.toString());
      console.log('UTC date:', utcDate.toISOString());

      // Create the task
      const newTask = await taskService.createTask(taskData);
      
      // Update local state
      setTasks(prevTasks => [newTask, ...prevTasks]);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        due_date: getTomorrowAt9AM(),
        priority: "Normal",
        category: ""
      });
      
      alert("Task created successfully!");
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const task = tasks.find(t => t.id === id);
      const updatedTask = await taskService.updateTask(id, {
        ...task,
        is_completed: !task.is_completed
      });
      
      setTasks(prevTasks => prevTasks.map(t =>
        t.id === id ? updatedTask : t
      ));
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm("Delete this task?")) {
      try {
        await taskService.deleteTask(id);
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      } catch (err) {
        console.error('Error deleting task:', err);
        setError('Failed to delete task');
      }
    }
  };

  const renderTasks = () => {
    let filtered = [...tasks];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (filter === "today") {
      filtered = filtered.filter(t => {
        const taskDate = new Date(t.due_date);
        return taskDate >= today && taskDate < new Date(today.getTime() + 24*60*60*1000);
      });
    } else if (filter === "upcoming") {
      filtered = filtered.filter(t => {
        if (!t.is_completed) {
          if (!t.due_date) return true;
          return new Date(t.due_date) > new Date();
        }
        return false;
      });
    } else if (filter === "completed") {
      filtered = filtered.filter(t => t.is_completed);
    }

    if (sortBy === "priority") {
      const order = { High: 1, Normal: 2, Low: 3 };
      filtered.sort((a, b) => order[a.priority] - order[b.priority]);
    } else if (sortBy === "due-date") {
      filtered.sort((a, b) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
      });
    } else {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return filtered.map((task) => (
      <div
        key={task.id}
        className={`task-card ${task.priority.toLowerCase()}-priority ${task.is_completed ? "completed" : ""}`}
      >
        <div className="task-content">
          <div className="task-info">
            <h4 className="task-title">{task.title}</h4>
            {task.description && <p className="task-description">{task.description}</p>}
            <div className="task-date">
              <FaCalendar className="calendar-icon" />
              <span>
                {task.due_date ? new Date(task.due_date).toLocaleString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }) : "No due date"}
              </span>
            </div>
            {task.category_name && (
              <div className="task-category">
                Category: {task.category_name}
              </div>
            )}
          </div>
          <div className="task-actions">
            <button 
              className="action-button" 
              onClick={() => toggleComplete(task.id)}
              title={task.is_completed ? "Mark as incomplete" : "Mark as complete"}
            >
              <FaCheckCircle className={task.is_completed ? "completed-icon" : ""} />
            </button>
            <button 
              className="action-button" 
              onClick={() => deleteTask(task.id)}
              title="Delete task"
            >
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
          <button className="sidebar-btn logout" onClick={logout}>
            Logout
          </button>
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
                required
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
                id="due_date"
                name="due_date"
                type="date"
                value={formData.due_date}
                onChange={handleInputChange}
                className="form-input"
                required
                min={new Date().toISOString().split('T')[0]}
              />
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
              </select>

              <select
                id="category"
                name="category"
                value={formData.category || ""}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Add Task'}
              </button>
              {error && <div className="error-message">{error}</div>}
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
