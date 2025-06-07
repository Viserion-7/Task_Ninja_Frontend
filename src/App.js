import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginSignup from "./components/LoginSignup/LoginSignup";
import Dashboard from "./components/Dashboard/Dashboard";
import AddTask from "./components/Dashboard/AddTask";
import Profile from "./components/Profile/profile";
import Todo from "./components/ToDo/todo";
import Timesheet from "./components/Timesheet/timesheets";


const PrivateRoute = ({ element }) => {
  const isAuthenticated = true;
  return isAuthenticated ? element : <Navigate to="/" />;
};

function App() {
  const isAuthenticated = "true";

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/add-task" element={isAuthenticated ? <AddTask /> : <Navigate to="/" />} />
        <Route path="/todo" element={isAuthenticated ? <Todo /> : <Navigate to="/" />} />
        <Route path="/timesheets" element={isAuthenticated ? <Timesheet /> : <Navigate to="/" />} />

        <Route path="/profile" element={<Profile />} /> {/* New profile route */}
      </Routes>
    </Router>
  );
}

export default App;