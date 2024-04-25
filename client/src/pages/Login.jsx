import React from 'react'
import { Link, Route, Routes, Navigate, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const handleEnterButton = () => {
    navigate("/Home")
  }

  return (
    <div>Login Page
      <button 
       type="button" class="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900" 
      onClick={handleEnterButton} >
        Enter Button
      </button>
    </div>
  )
}

export default Login