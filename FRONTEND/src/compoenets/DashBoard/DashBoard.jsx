import React, { useState, useEffect, useRef } from 'react';
import './DashBoard.css';
import TaskForm from '../TaskForm/TaskForm';
import TaskList from '../TaskList/TaskList';
import axios from 'axios';

const DashBoard = ({ user, setUser }) => {
  const [showForm, setShowForm] = useState(false);
  const [createdCount, setCreatedCount] = useState(0);
  const [assignedCount, setAssignedCount] = useState(0);



  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Fetch counts for display
  useEffect(() => {
    const fetchTaskCounts = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8080/task', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const tasks = response.data.tasks || [];

        const created = tasks.filter(
          (task) => task.createdBy?.username === user.username
        ).length;

        const assigned = tasks.filter(
          (task) => task.assignedTo === user.username
        ).length;

        setCreatedCount(created);
        setAssignedCount(assigned);
      } catch (err) {
        console.error('Error fetching task counts:', err);
      }
    };

    fetchTaskCounts();
  }, [user]);

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h2 className="logo">Task Manager</h2>
        <div className="nav-right">
          <span className="username">{user.username}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="left-panel">
          <div className="panel-header">
            <h3>Assigned by Me ({createdCount})</h3>
            <button className="toggle-form-btn" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Hide Form' : 'Create Task'}
            </button>
          </div>
          {showForm && <TaskForm user={user} />}
          <TaskList  user={user} type="createdBy" />
        </div>

        <div className="right-panel">
          <h3>Tasks Assigned to Me ({assignedCount})</h3>
          <TaskList user={user} type="assignedTo" />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
