import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import axios from "axios";


//import pages
import Login from './pages/Login';
import Register from './pages/Register';
import DashBoard from './pages/DashBoard';

function App() {
  const [user,setUser] = useState(null);
  const [error,setError] = useState("");
  useEffect(()=>{
      const fetchUser = async()=>{
        const token = localStorage.getItem("token");
        if(token){
          try{
            const res = await axios.get('/api/users/me',{
              headers:{Authorization:`Bearer ${token}`}
            })
            setUser(res.data);
          }
          catch(err){
            setError("Failed to fetch user token");
            localStorage.removeItem("token");
          }
        }
      };
      fetchUser();
    },[]);

  
  return (
    <Router>
      <Navbar user={user} setUser={setUser}/>
      <div className="pt-16">
        <Routes>
          <Route path="/login" element={<Login setUser={setUser}/>}/>
          <Route path="/register" element={<Register setUser={setUser}/>}/>
          <Route path="/dashboard" element={<DashBoard user={user} setUser={setUser}/>}/>
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"}/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App
