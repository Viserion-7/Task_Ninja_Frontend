import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("auth");
    if (!isAuthenticated) {
      navigate("/"); // Redirect to login page if not authenticated
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("auth"); // Remove authentication
    navigate("/"); // Redirect to login
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>My Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <div className="dashboard-content">
        <p>Welcome to your dashboard!</p>
      </div>
    </div>
  );
};

export default Dashboard;