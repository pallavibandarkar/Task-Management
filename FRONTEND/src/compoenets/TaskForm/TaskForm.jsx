import React, { useState, useEffect } from 'react';
import './TaskForm.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const TaskForm = ({ user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('To Do');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8080/user/getUsers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!title.trim() || !description.trim() || !assignedTo.trim()) {
    toast.warn('Please fill all required fields ⚠️');
    return;
  }

  const token = localStorage.getItem('token');

  try {
    const response = await axios.post(
      'http://localhost:8080/task',
      {
        title,
        description,
        assignedTo,
        status,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success('Task Created Successfully ');
    setTitle('');
    setDescription('');
    setAssignedTo('');
    setStatus('To Do');
  } catch (error) {
    console.error('Error:', error);
    toast.error('Something went wrong ');
  }
};

    
       

  return (
    <>
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        required
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        required
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      <select
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
        required
      >
        <option value="">Select user</option>
        {users.map((user) => (
          <option key={user._id} value={user.username}>
            {user.username}
          </option>
        ))}
      </select>

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

      <button type="submit">Create Task</button>

    </form>
    <ToastContainer/>
    </>
  );
};

export default TaskForm;
