import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaTrashAlt,
  FaCalendar,
  FaEdit,
  FaSearch,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import taskService from "../../services/taskService";
import { useAuth } from "../../context/AuthContext";
import SubtaskSidebar from "./SubtaskSidebar";
import "./todo.css";

const TodoTasks = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Load tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await taskService.getAllTasks();
        setTasks(tasksData);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks");
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
      const task = tasks.find((t) => t.id === id);
      const updatedTask = await taskService.updateTask(id, {
        ...task,
        is_completed: !task.is_completed,
      });

      // Update tasks list
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === id ? updatedTask : t))
      );

      // Refetch tasks to ensure proper update
      const tasksData = await taskService.getAllTasks();
      setTasks(tasksData);
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.deleteTask(id);
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      } catch (err) {
        console.error("Error deleting task:", err);
        setError("Failed to delete task");
      }
    }
  };

  const openSubtasks = (task) => {
    setSelectedTask(task);
    setSidebarOpen(true);
  };

  const getDaysUntilDue = (due_date) => {
    if (!due_date) return null;
    const today = new Date();
    const due = new Date(due_date);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTaskStatus = (task) => {
    const daysUntil = getDaysUntilDue(task.due_date);
    if (daysUntil === null) return "no-date";
    if (daysUntil < 0) return "overdue";
    if (daysUntil === 0) return "due-today";
    if (daysUntil <= 2) return "due-soon";
    return "upcoming";
  };

  const filterTasks = () => {
    let filtered = tasks.filter((task) => !task.is_completed);

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (task.description &&
            task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    const today = new Date().toISOString().split("T")[0];
    if (filter === "today") {
      filtered = filtered.filter((t) => {
        const taskDate = t.due_date
          ? new Date(t.due_date).toISOString().split("T")[0]
          : null;
        return taskDate === today;
      });
    } else if (filter === "overdue") {
      filtered = filtered.filter((t) => {
        const taskDate = t.due_date
          ? new Date(t.due_date).toISOString().split("T")[0]
          : null;
        return taskDate && taskDate < today;
      });
    } else if (filter === "upcoming") {
      filtered = filtered.filter((t) => {
        const taskDate = t.due_date
          ? new Date(t.due_date).toISOString().split("T")[0]
          : null;
        return taskDate && taskDate > today;
      });
    } else if (filter === "high-priority") {
      filtered = filtered.filter((t) => t.priority === "High");
    }

    return filtered;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#ff4757";
      case "Normal":
        return "#ffa502";
      case "Low":
        return "#2ed573";
      default:
        return "#747d8c";
    }
  };

  const renderTaskCard = (task) => {
    const status = getTaskStatus(task);
    const daysUntil = getDaysUntilDue(task.due_date);

    return (
      <div key={task.id} className={`todo-card ${status}`}>
        <div className="todo-card-header">
          <div
            className="priority-indicator"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          >
            {task.priority.charAt(0)}
          </div>
          <div className="task-category">{task.category_name || "General"}</div>
          <div className="task-actions">
            <button
              className="action-btn edit"
              onClick={() => openSubtasks(task)}
            >
              <FaEdit />
            </button>
            <button
              className="action-btn complete"
              onClick={() => toggleComplete(task.id)}
            >
              <FaCheckCircle />
            </button>
            <button
              className="action-btn delete"
              onClick={() => deleteTask(task.id)}
            >
              <FaTrashAlt />
            </button>
          </div>
        </div>

        <div className="todo-card-content">
          <h3 className="task-title">{task.title}</h3>
          <p className="task-description">{task.description}</p>
        </div>

        <div className="todo-card-footer">
          <div className="task-date">
            <FaCalendar className="date-icon" />
            <span>
              {task.due_date
                ? new Date(task.due_date).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "No due date"}
            </span>
            {status === "overdue" && (
              <FaExclamationTriangle className="warning-icon" />
            )}
            {status === "due-today" && <FaClock className="clock-icon" />}
          </div>
          {daysUntil !== null && (
            <div className={`days-until ${status}`}>
              {daysUntil < 0
                ? `${Math.abs(daysUntil)} days overdue`
                : daysUntil === 0
                ? "Due today"
                : `${daysUntil} days left`}
            </div>
          )}
        </div>
      </div>
    );
  };

  const stats = (() => {
    const incomplete = tasks.filter((t) => !t.is_completed);
    const high = incomplete.filter((t) => t.priority === "High").length;
    const today = new Date().toISOString().split("T")[0];
    const overdue = incomplete.filter((t) => {
      const taskDate = t.due_date
        ? new Date(t.due_date).toISOString().split("T")[0]
        : null;
      return taskDate && taskDate < today;
    }).length;
    const dueToday = incomplete.filter((t) => {
      const taskDate = t.due_date
        ? new Date(t.due_date).toISOString().split("T")[0]
        : null;
      return taskDate === today;
    }).length;
    return { total: incomplete.length, high, overdue, dueToday };
  })();

  const filteredTasks = filterTasks();

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
          <div className="nav-item">
            <span className="nav-icon">📊</span>
            <button className="nav-text" onClick={() => navigate("/dashboard")}>
              Dashboard
            </button>
          </div>
          <div className="nav-item">
            <span className="nav-icon">📝</span>
            <button className="nav-text" onClick={() => navigate("/add-task")}>
              Add Task
            </button>
          </div>
          <div className="nav-item active">
            <span className="nav-icon">✓</span>
            <span className="nav-text">To Do</span>
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

      {/* Main Content */}
      <div className="main-content">
        <div className="todo-header">
          <h1 className="page-title">Todo Tasks</h1>
          <p className="page-subtitle">Manage your pending tasks efficiently</p>
          {error && <div className="error-message">{error}</div>}
          {loading && <div className="loading-message">Loading tasks...</div>}
          <div className="current-time">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
            |
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
          </div>
          <div className="stat-card due-today">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <div className="stat-number">{stats.dueToday}</div>
              <div className="stat-label">Due Today</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="todo-controls">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-controls">
            <div className="filter-buttons">
              {["all", "today", "overdue", "upcoming", "high-priority"].map(
                (key) => (
                  <button
                    key={key}
                    className={`filter-button ${
                      filter === key ? "active" : ""
                    }`}
                    onClick={() => setFilter(key)}
                  >
                    {key.replace("-", " ").toUpperCase()}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Task Grid */}
        <div className="todo-grid">
          {filteredTasks.length ? (
            filteredTasks.map(renderTaskCard)
          ) : (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <h3>No tasks found</h3>
              <p>
                {searchTerm
                  ? "No tasks match your search."
                  : "You have no pending tasks!"}
              </p>
              <button
                className="add-task-btn"
                onClick={() => navigate("/add-task")}
              >
                Add Task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Subtask Sidebar */}
      <SubtaskSidebar
        isOpen={sidebarOpen}
        task={selectedTask}
        onClose={() => {
          setSidebarOpen(false);
          setSelectedTask(null);
        }}
        onSubtaskChange={() => {
          const fetchTasks = async () => {
            try {
              const tasksData = await taskService.getAllTasks();
              setTasks(tasksData);
            } catch (err) {
              console.error("Error fetching tasks:", err);
              setError("Failed to load tasks");
            }
          };
          fetchTasks();
        }}
      />
    </div>
  );
};

export default TodoTasks;
