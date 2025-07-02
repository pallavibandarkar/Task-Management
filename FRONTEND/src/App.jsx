import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router'
import AuthPage from './compoenets/AuthPage/AuthPage';
import Dashboard from './compoenets/DashBoard/DashBoard';
import { ToastContainer } from 'react-toastify';

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      console.log("Logged in user")
      setUser(JSON.parse(userData));
    }
  }, []);
  return (
    <div>
      {!user ? (
        <AuthPage setUser={setUser} />
        ) : (
        <Dashboard user={user} setUser={setUser}/>
        )}
      <ToastContainer/>
    </div>
  )
}

export default App
