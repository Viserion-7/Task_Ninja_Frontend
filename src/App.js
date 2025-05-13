import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginSignup from "./components/LoginSignup/LoginSignup";
import Dashboard from "./components/Dashboard/Dashboard";
import AddTask from "./components/Dashboard/AddTask";
const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("auth");
  return isAuthenticated ? element : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/addtask" element={<AddTask />} />
      </Routes>
    </Router>
  );
}

export default App;