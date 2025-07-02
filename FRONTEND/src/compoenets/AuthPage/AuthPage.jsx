import React, { useState } from 'react';
import axios from 'axios';
import './AuthPage.css'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AuthPage = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || (!isLogin && !form.username)) {
    toast.error("Please fill all required fields");
    return;
  }

  if (form.password.length < 6) {
  toast.error("Password must be at least 6 characters long");
  return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    toast.error("Invalid email format");
    return;
  }

    const url = isLogin
      ? 'http://localhost:8080/user/login'
      : 'http://localhost:8080/user/register';

    const data = isLogin
      ? { email: form.email, password: form.password }
      : form;

    try {
      const res = await axios.post(url, data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setMsg(`${isLogin ? 'Login' : 'Signup'} successful`);
      toast.success(`${isLogin ? 'Login' : 'Signup'} successful`)
      setForm({ username: "", email: "", password: "" });
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error occurred ');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Signup'}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            
          />
          <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
        </form>

        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span onClick={() => setIsLogin(!isLogin)} className="toggle-link">
            {isLogin ? 'Signup' : 'Login'}
          </span>
        </p>

        {msg && <p className="msg">{msg}</p>}
        <ToastContainer />
      </div>
    </div>
  );
};

export default AuthPage;
