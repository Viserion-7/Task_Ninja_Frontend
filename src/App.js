import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginSignup from "./components/LoginSignup/LoginSignup";
import Dashboard from "./components/Dashboard/Dashboard";
import AddTask from "./components/Dashboard/AddTask";
import Profile from "./components/Profile/profile";
import Todo from "./components/ToDo/todo";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginSignup />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/add-task" element={
        <PrivateRoute>
          <AddTask />
        </PrivateRoute>
      } />
      <Route path="/todo" element={
        <PrivateRoute>
          <Todo />
        </PrivateRoute>
      } />
      <Route path="/profile" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
