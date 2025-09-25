import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = ({setUser}) => {

  const [error,setError] = useState("");
  const [formData,setFormData] = useState({
    username:"",
    email:"",
    password:"",
    confirmPassword:"",
  });
  const navigate = useNavigate();
  
  const handleChange = (e)=>{
    setFormData({...formData,[e.target.name]:e.target.value});
    if(error)setError("");
  }


  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(formData.password !== formData.confirmPassword){
      setError("Passwords do not match");
      return;
    }
    try{
      const res =  await axios.post("/api/users/register",{
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      localStorage.setItem("token",res.data.token);
      console.log(res.data);
      setUser(res.data);
      navigate('/login');
    }catch(err){
      setError(err.response?.data?.message || "Registration failed");
    }
  }

  return (
<div className="flex items-center justify-center bg-gray-200 w-full min-h-[calc(100vh-4rem)] overflow-hidden">
  
        <div className='bg-white rounded-md p-8 shadow-lg'>
          
          <h1 className='text-3xl text-gray-700 font-bold text-center mb-8' >Register</h1>
          <div>
              <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>

                <input type="text" 
                  onChange = {handleChange} 
                  name = "username" 
                  value = {formData.username} 
                  placeholder='Enter user name'
                  required 
                  className='text-gray-600 w-80 outline-none shadow text-md px-3 py-2 rounded-sm placeholder:text-gray-300 focus:bg-gray-50'
                />

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

                 <input type="password" 
                  name = "confirmPassword"
                  value={formData.confirmPassword}
                  placeholder='Re-Enter Password'
                  onChange={handleChange}
                  required 
                  autoComplete='off'
                  className='text-gray-600 w-80 outline-none shadow text-md px-3 py-2 rounded-sm placeholder:text-gray-300 focus:bg-gray-50'
                />
               <p className="text-center text-red-500  h-4">{error || ""}</p>

                <button type="submit" 
                  className='bg-indigo-400 rounded-md px-3 py-2 text-white text-xl font-bold hover:bg-indigo-500 transition'>Register
                </button>
               </form>

          </div>      
        </div>

    </div>
  )
}

export default Register;
