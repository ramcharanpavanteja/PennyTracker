import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/logo.svg";
import { MdPerson } from "react-icons/md";
import { MdLogout } from 'react-icons/md';

const Navbar = ({user,setUser}) => {
  const navigate = useNavigate();
  const [open,setopen] = useState(false);

  const handleLogout = ()=>{
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  }
  const handleOnclick = ()=>{
    setopen(!open);
  }
  
  return (
    <nav className='w-full h-16 bg-gray-800 fixed top-0 shadow-md z-50'>
      <div className='flex justify-between px-6 py-3  transition-all ease-in-out delay-75'>
          <div className='flex space-x-2 items-center'>
            <img src={logo} alt="" className='w-8 h-8' />
            <h1 className='text-white font-bold text-lg '>PennyTracker</h1>
          </div>
          <ul className='flex space-x-8 list-none'>
            {
                user?(
                  <li>
                    <button onClick={handleOnclick}><div className=' bg-white rounded-full p-1'><MdPerson size={25}/> </div></button>
                    {open && (
                        <div className="absolute right-0 mt-4 w-40 bg-cyan-50 shadow-md rounded-md">
                            <ul className='text-center pl-2' >
                              <li className='flex gap-3 justify-items-start items-center hover:bg-gray-100 p-1'>
                                <MdPerson/>
                                <p className='capitalize'>{user.username}</p>
                              </li>
                              <li className='flex gap-3 justify-start items-center hover:bg-gray-100 p-1'>
                               <MdLogout className='text-red-600'/> 
                               <button onClick={handleLogout}>
                                   Logout
                                </button> 
                              </li>
                            </ul>
                            
                        </div>
                    )}
                  </li>
                ):(
                  <li >
                      <Link className='font-medium text-gray-50 text-md cursor-pointer hover:hover:text-gray-300' to="/login">Login</Link >
                </li>)
             }                    
          </ul>
      </div>      
    </nav>
  )
}

export default Navbar
