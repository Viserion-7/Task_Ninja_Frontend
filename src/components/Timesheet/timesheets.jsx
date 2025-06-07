// src/components/Timesheets/Timesheets.jsx
import React, { useEffect, useState } from 'react';
import './timesheets.css';

const Timesheets = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // You can replace this with real data from localStorage or API
    const sampleLogs = [
      { taskId: 1000, taskTitle: 'Task 1', date: '2025-06-07', duration: 30, description: 'Worked on part 1' },
      { taskId: 1001, taskTitle: 'Task 2', date: '2025-06-06', duration: 45, description: 'Worked on part 2' },
      { taskId: 1002, taskTitle: 'Task 3', date: '2025-06-05', duration: 60, description: 'Worked on part 3' },
      { taskId: 1003, taskTitle: 'Task 4', date: '2025-06-04', duration: 75, description: 'Worked on part 4' },
      { taskId: 1004, taskTitle: 'Task 5', date: '2025-06-03', duration: 90, description: 'Worked on part 5' },
      { taskId: 1005, taskTitle: 'Task 6', date: '2025-06-02', duration: 105, description: 'Worked on part 6' },
      { taskId: 1006, taskTitle: 'Task 7', date: '2025-06-01', duration: 120, description: 'Worked on part 7' }
    ];
    setLogs(sampleLogs);
  }, []);

  return (
    <div className="timesheet-container">
      <h2>Daily Task Timesheet</h2>
      <table className="timesheet-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Task</th>
            <th>Description</th>
            <th>Duration (min)</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.taskId}>
              <td>{log.date}</td>
              <td>{log.taskTitle}</td>
              <td>{log.description}</td>
              <td>{log.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Timesheets;