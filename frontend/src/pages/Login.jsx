import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import wallet from "../assets/wallet.png";
import coin from "../assets/coin.png";

const Login = ({setUser}) => {

  const [error,setError] = useState("");
  const [formData,setFormData] = useState({
    email:"",
    password:"",
  });
  const navigate = useNavigate();
  
  const handleChange = (e)=>{
    setFormData({...formData,[e.target.name]:e.target.value});
    if(error)setError("");
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      const res =  await axios.post("/api/users/login",formData);
      localStorage.setItem("token",res.data.token);
      setUser(res.data);
      navigate('/');
    }catch(err){
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
<div className="relative flex items-center justify-center bg-gray-50 w-full min-h-[calc(100vh-4rem)] overflow-hidden">
  <img src={coin} alt="coin" className="absolute w-10 h-10 top-0 left-50 animate-fall1" />
  <img src={coin} alt="coin" className="absolute w-10 h-10 top-0 left-80 animate-fall2" />
  <img src={coin} alt="coin" className="absolute w-10 h-10 top-0 left-10 animate-fall2" />
  <img src={coin} alt="coin" className="absolute w-10 h-10 top-0 left-70 animate-fall1" />
  <img src={coin} alt="coin" className="absolute w-10 h-10 top-0 left-10 animate-fall3" />

  <div className="absolute bottom-0 left-0 w-full h-1/3 bg-indigo-300 rounded-tr-[60%] lg:rounded-tr-[80%] ">
    <h1 className='absolute left-25 top-20 text-3xl font-bold font-poppins text-left text-white'>Track your Income </h1>
  </div>


        <div className='relative bg-white rounded-md p-8 shadow-lg z-0'>
          
          <h1 className='text-3xl text-gray-700 font-bold text-center mb-8' >Login</h1>
          <div>
              <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>

                <input type="email" 
                  onChange = {handleChange} 
                  name = "email" 
                  value = {formData.email} 
                  placeholder='Enter email'
                  required 
                  className='text-gray-600 w-80 outline-none shadow text-md px-3 py-2 rounded-sm placeholder:text-gray-300 focus:bg-gray-50'
                />

                <input type="password" 
                  name = "password"
                  value={formData.password}
                  placeholder='Enter Password'
                  onChange={handleChange}
                  required 
                  autoComplete='off'
                  className='text-gray-600 w-80 outline-none shadow text-md px-3 py-2 rounded-sm placeholder:text-gray-300 focus:bg-gray-50'
                />
               <p className="text-center text-red-500  h-4">{error || ""}</p>

                <button type="submit" 
                  className='bg-indigo-400 rounded-md px-3 py-2 text-white text-xl font-bold hover:bg-indigo-500 transition'>Login
                </button>
                <p className='text-gray-600 text-center'>Not registered yet? <Link to="/register" className='text-blue-400'>SignUp</Link></p>
               </form>

          </div>      
        </div>

    </div>
  )
}

export default Login;
