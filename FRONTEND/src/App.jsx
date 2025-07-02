import { useState, useEffect } from 'react'
import { Route, Routes , useNavigate, Navigate} from 'react-router'
import AuthPage from './compoenets/AuthPage/AuthPage';
import Dashboard from './compoenets/DashBoard/DashBoard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
      navigate("/dashboard"); 
    } else {
      navigate("/welcome"); 
    }
  }, []);
  return (
    <>
      <Routes>
        <Route
          path="/welcome"
          element={<AuthPage setUser={setUser} />}
        />

        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to="/welcome" />
            )
          }
        />

        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/welcome"} />}
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
    
  )
}

export default App
