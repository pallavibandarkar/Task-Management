import React, { useEffect, useState } from 'react';
import './TaskList.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserAlt, FaClipboardList, FaTrashAlt, FaCheck } from 'react-icons/fa';


const TaskList = ({ user, type }) => {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [assignees, setAssignees] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:8080/task', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allTasks = response.data.tasks;
      const uniqueAssignees = [...new Set(allTasks.map((t) => t.assignedTo))];
      setAssignees(uniqueAssignees);

      let filteredTasks = allTasks;

      if (type === 'createdBy') {
        filteredTasks = filteredTasks.filter(
          (t) => t.createdBy?.username === user.username
        );
      } else if (type === 'assignedTo') {
        filteredTasks = filteredTasks.filter(
          (t) => t.assignedTo === user.username
        );
      }

      if (statusFilter) {
        filteredTasks = filteredTasks.filter((t) => t.status === statusFilter);
      }

      if (type === 'createdBy' && assigneeFilter) {
        filteredTasks = filteredTasks.filter(
          (t) => t.assignedTo === assigneeFilter
        );
      }

      setTasks(filteredTasks);
    } catch (err) {
      toast.error('Error fetching tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, assigneeFilter]);

  const handleDelete = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8080/task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      alert('Task deleted successfully');
      fetchTasks();
    } catch (err) {
      toast.error('Error deleting task')
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [taskId]: newStatus,
    }));
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
  const token = localStorage.getItem('token');
  const statusToSend = newStatus || tasks.find(t => t._id === taskId)?.status;

  try {
    await axios.put(
      `http://localhost:8080/task/${taskId}`,
      { status: statusToSend },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    setStatusUpdates((prev) => {
      const updated = { ...prev };
      delete updated[taskId];
      return updated;
    });
    toast.success('Status updated successfully')
    fetchTasks()
  } catch (err) {
    toast.error('Failed to update status');
  }
};


  return (
    <div className="task-list">
      <div className="filters">
        <select
          className="filter-dropdown"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        {type === 'createdBy' && (
          <select
            className="filter-dropdown"
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
          >
            <option value="">All Assignees</option>
            {assignees.map((assignee) => (
              <option key={assignee} value={assignee}>
                {assignee}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="task-grid">
        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="task-card">
              <h4>{task.title}</h4>
              <p>{task.description}</p>
              <p>
                <strong>Assigned To:</strong> {task.assignedTo}
              </p>
            
               
                <div>
  <strong>Status:</strong>{' '}
  {type === 'assignedTo' && user.username === task.assignedTo ? (
    task.status === 'Done' ? (
      <span style={{ color: 'green', fontWeight: 'bold' }}>Done</span>
    ) : (<>
      <select
        value={statusUpdates[task._id] ?? task.status}
        onChange={(e) => handleStatusChange(task._id, e.target.value)}
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <button className="update-btn" onClick={() => handleStatusUpdate(task._id, statusUpdates[task._id])}>
  <FaCheck />Update
</button>
      </>
    )
  ) : (
    <span>{task.status}</span>
  )}
      </div>
        {type === 'createdBy' && (
          <button
            onClick={() => handleDelete(task._id)}
            className="delete-btn"
          >
            <FaTrashAlt />Delete
          </button>
        )}
      </div>
          ))
        )}
      </div>
      <ToastContainer/>
    </div>
  );
};

export default TaskList;
