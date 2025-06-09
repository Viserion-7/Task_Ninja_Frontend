import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import taskService from "../../services/taskService";
import aiService from "../../services/aiService";
import "./AddTask.css";

const AddTask = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatingSubtasks, setGeneratingSubtasks] = useState(false);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "Normal",
    category: "",
  });

  const [subtasks, setSubtasks] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await taskService.getCategories();
        setCategories(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, category: data[0].id }));
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const generateSubtasks = async () => {
    if (!formData.title) {
      setError("Please enter a task title first");
      return;
    }

    setGeneratingSubtasks(true);
    setError("");

    try {
      const generated = await aiService.generateSubtasks(
        formData.title,
        formData.description
      );
      setSubtasks(generated);
    } catch (err) {
      setError("Failed to generate subtasks. Please try again.");
      console.error("Subtask generation error:", err);
    } finally {
      setGeneratingSubtasks(false);
    }
  };

  const updateSubtask = (index, field, value) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index] = {
      ...updatedSubtasks[index],
      [field]: value,
    };
    setSubtasks(updatedSubtasks);
  };

  const removeSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, { title: "", duration: 30 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create main task first and get its ID
      const taskResponse = await taskService.createTask(formData);
      const taskId = taskResponse.id;

      // Create each subtask with the task ID
      if (subtasks.length > 0) {
        const subtaskPromises = subtasks.map((subtask) => {
          // Ensure duration is a number and valid
          const duration =
            typeof subtask.duration === "number" ? subtask.duration : 30;
          return taskService.createSubtask(taskId, {
            title: subtask.title,
            duration: duration,
          });
        });

        await Promise.all(subtaskPromises);
      }

      navigate("/dashboard");
    } catch (err) {
      setError("Failed to create task. Please try again.");
      console.error("Task creation error:", err);
    } finally {
      setLoading(false);
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
          <div className="nav-item">
            <span className="nav-icon">📊</span>
            <button className="nav-text" onClick={() => navigate("/dashboard")}>
              Dashboard
            </button>
          </div>
          <div className="nav-item active">
            <span className="nav-icon">📝</span>
            <span className="nav-text">Add Task</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">✓</span>
            <button className="nav-text" onClick={() => navigate("/todo")}>
              To Do
            </button>
          </div>
          <div className="nav-item">
            <span className="nav-icon">👨🏻‍💼</span>
            <span className="nav-text">Profile</span>
          </div>
        </div>
        <div className="sidebar-actions">
          <button className="sidebar-btn logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="add-task-container">
          <h1>Create New Task</h1>
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="task-form">
            {/* Main Task Fields */}
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="datetime-local"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subtasks Section */}
            <div className="subtasks-section">
              <div className="subtasks-header">
                <h2>Subtasks</h2>
                <button
                  type="button"
                  onClick={generateSubtasks}
                  disabled={generatingSubtasks}
                  className="generate-btn"
                >
                  {generatingSubtasks ? "Generating..." : "Generate with AI"}
                </button>
              </div>

              <div className="subtasks-list">
                {subtasks.map((subtask, index) => (
                  <div key={index} className="subtask-item">
                    <input
                      type="text"
                      value={subtask.title}
                      onChange={(e) =>
                        updateSubtask(index, "title", e.target.value)
                      }
                      placeholder="Subtask title"
                    />
                    <input
                      type="number"
                      value={subtask.duration}
                      onChange={(e) =>
                        updateSubtask(
                          index,
                          "duration",
                          parseInt(e.target.value)
                        )
                      }
                      placeholder="Duration (minutes)"
                      min="1"
                    />
                    <button
                      type="button"
                      onClick={() => removeSubtask(index)}
                      className="remove-btn"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addSubtask}
                className="add-subtask-btn"
              >
                + Add Subtask
              </button>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
