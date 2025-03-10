import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-5 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Task Manager</h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link
              to="/tasks"
              className="block p-2 rounded hover:bg-gray-700 transition"
            >
              My Tasks
            </Link>
          </li>
          <li>
            <Link
              to="/analytics"
              className="block p-2 rounded hover:bg-gray-700 transition"
            >
              Analytics
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="block p-2 rounded hover:bg-gray-700 transition"
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;