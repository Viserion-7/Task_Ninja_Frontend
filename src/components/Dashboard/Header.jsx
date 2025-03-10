import React from "react";
import "./Header.css"; // Optional styling

const Header = () => {
  return (
    <header className="dashboard-header">
      <h1>Welcome, User</h1>
      <button className="add-task-btn">+ New Task</button>
    </header>
  );
};

export default Header;