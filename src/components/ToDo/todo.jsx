import React, { useState, useEffect } from "react";
import {
  FaCheckCircle, FaTrashAlt, FaCalendar, FaEdit, FaSearch, FaClock, FaExclamationTriangle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import taskService from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import './todo.css';

const TodoTasks = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("priority");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await taskService.getAllTasks();
        setTasks(tasksData);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

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
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.deleteTask(id);
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      } catch (err) {
        console.error('Error deleting task:', err);
        setError('Failed to delete task');
      }
    }
  };

  const startEditing = (task) => {
    setEditingTask({ ...task });
  };

  const saveEdit = async () => {
    try {
      const updatedTask = await taskService.updateTask(editingTask.id, {
        ...editingTask,
        due_date: new Date(editingTask.due_date).toISOString()
      });
      
      setTasks(prevTasks => prevTasks.map(task =>
        task.id === editingTask.id ? updatedTask : task
      ));
      
      setEditingTask(null);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTaskStatus = (task) => {
    const daysUntil = getDaysUntilDue(task.dueDate);
    if (daysUntil === null) return "no-date";
    if (daysUntil < 0) return "overdue";
    if (daysUntil === 0) return "due-today";
    if (daysUntil <= 2) return "due-soon";
    return "upcoming";
  };

  const filterTasks = () => {
    let filtered = tasks.filter(task => !task.completed);

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const today = new Date().toISOString().split("T")[0];
    if (filter === "today") {
      filtered = filtered.filter((t) => t.dueDate === today);
    } else if (filter === "overdue") {
      filtered = filtered.filter((t) => t.dueDate && t.dueDate < today);
    } else if (filter === "upcoming") {
      filtered = filtered.filter((t) => t.dueDate && t.dueDate > today);
    } else if (filter === "high-priority") {
      filtered = filtered.filter((t) => t.priority === "high");
    }

    if (sortBy === "priority") {
      const order = { high: 1, medium: 2, low: 3 };
      filtered.sort((a, b) => order[a.priority] - order[b.priority]);
    } else if (sortBy === "due-date") {
      filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else {
      filtered.sort((a, b) => b.createdAt - a.createdAt);
    }

    return filtered;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "#ff4757";
      case "medium": return "#ffa502";
      case "low": return "#2ed573";
      default: return "#747d8c";
    }
  };

  const renderTaskCard = (task) => {
    const status = getTaskStatus(task);
    const daysUntil = getDaysUntilDue(task.dueDate);

    return (
      <div key={task.id} className={`todo-card ${status}`}>
        <div className="todo-card-header">
          <div className="priority-indicator" style={{ backgroundColor: getPriorityColor(task.priority) }}>
            {task.priority.charAt(0).toUpperCase()}
          </div>
          <div className="task-category">
            {task.categories?.length > 0 
              ? task.categories.map(cat => cat.name).join(', ') 
              : "General"
            }
          </div>
          <div className="task-actions">
            <button className="action-btn edit" onClick={() => startEditing(task)}><FaEdit /></button>
            <button className="action-btn complete" onClick={() => toggleComplete(task.id)}><FaCheckCircle /></button>
            <button className="action-btn delete" onClick={() => deleteTask(task.id)}><FaTrashAlt /></button>
          </div>
        </div>

        <div className="todo-card-content">
          <h3 className="task-title">{task.title}</h3>
          <p className="task-description">{task.description}</p>
        </div>

        <div className="todo-card-footer">
          <div className="task-date">
            <FaCalendar className="date-icon" />
            <span>{task.dueDate || "No due date"}</span>
            {status === "overdue" && <FaExclamationTriangle className="warning-icon" />}
            {status === "due-today" && <FaClock className="clock-icon" />}
          </div>
          {daysUntil !== null && (
            <div className={`days-until ${status}`}>
              {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` :
                daysUntil === 0 ? "Due today" :
                  `${daysUntil} days left`}
            </div>
          )}
        </div>
      </div>
    );
  };

  const stats = (() => {
    const incomplete = tasks.filter(t => !t.completed);
    const high = incomplete.filter(t => t.priority === "high").length;
    const overdue = incomplete.filter(t => t.dueDate && t.dueDate < new Date().toISOString().split("T")[0]).length;
    const dueToday = incomplete.filter(t => t.dueDate === new Date().toISOString().split("T")[0]).length;
    return { total: incomplete.length, high, overdue, dueToday };
  })();

  const filteredTasks = filterTasks();

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo"><h1>TASK<span className="logo-highlight">Y.</span></h1></div>
        <div className="nav-menu">
          <div className="nav-item"><span className="nav-icon">📊</span><button className="nav-text" onClick={() => navigate("/dashboard")}>Dashboard</button></div>
          <div className="nav-item"><span className="nav-icon">📝</span><button className="nav-text" onClick={() => navigate("/add-task")}>Add Task</button></div>
          <div className="nav-item"><span className="nav-icon">✓</span><span className="nav-text">To Do</span></div>
          <div className="nav-item"><span className="nav-icon">⚙️</span><button className="nav-text" onClick={() => navigate("/profile")}>Settings</button></div>
        </div>
        <div className="sidebar-actions">
          <button className="sidebar-btn" onClick={() => navigate("/add-task")}>+ Add Task</button>
          <button className="sidebar-btn logout" onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="todo-header">
          <h1 className="page-title">Todo Tasks</h1>
          <p className="page-subtitle">Manage your pending tasks efficiently</p>
          {error && <div className="error-message">{error}</div>}
          {loading && <div className="loading-message">Loading tasks...</div>}
          <div className="current-time">
            {currentTime.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', year: 'numeric' })} | 
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card total"><div className="stat-icon">📋</div><div className="stat-content"><div className="stat-number">{stats.total}</div><div className="stat-label">Total Tasks</div></div></div>
          <div className="stat-card high-priority"><div className="stat-icon">🔥</div><div className="stat-content"><div className="stat-number">{stats.high}</div><div className="stat-label">High Priority</div></div></div>
          <div className="stat-card overdue"><div className="stat-icon">⚠️</div><div className="stat-content"><div className="stat-number">{stats.overdue}</div><div className="stat-label">Overdue</div></div></div>
          <div className="stat-card due-today"><div className="stat-icon">⏰</div><div className="stat-content"><div className="stat-number">{stats.dueToday}</div><div className="stat-label">Due Today</div></div></div>
        </div>

        {/* Controls */}
        <div className="todo-controls">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
          </div>
          <div className="filter-controls">
            <div className="filter-buttons">
              {["all", "today", "overdue", "upcoming", "high-priority"].map(key => (
                <button key={key} className={`filter-button ${filter === key ? "active" : ""}`} onClick={() => setFilter(key)}>{key.replace('-', ' ').toUpperCase()}</button>
              ))}
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="priority">Sort by Priority</option>
              <option value="due-date">Sort by Due Date</option>
              <option value="created">Sort by Created</option>
            </select>
          </div>
        </div>

        {/* Task Grid */}
        <div className="todo-grid">
          {filteredTasks.length ? filteredTasks.map(renderTaskCard) : (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <h3>No tasks found</h3>
              <p>{searchTerm ? "No tasks match your search." : "You have no pending tasks!"}</p>
              <button className="add-task-btn" onClick={() => navigate("/add-task")}>Add Task</button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <h3>Edit Task</h3>
              <button className="close-btn" onClick={cancelEdit}>×</button>
            </div>
            <div className="modal-content">
              <input type="text" value={editingTask.title} onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })} className="edit-input" />
              <textarea value={editingTask.description} onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} className="edit-textarea" />
              <input type="date" value={editingTask.dueDate} onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })} className="edit-input" />
              <select value={editingTask.priority} onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })} className="edit-select">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
              <button className="save-btn" onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoTasks;
