import React from 'react'
import { Link, Route, Routes, Navigate, useNavigate } from 'react-router-dom';


const Login = () => {
  const navigate = useNavigate();
  const handleEnterButton = () => {
    navigate("/Home")
  }
  const handleSignupButton = () => {
    navigate("/Signup")
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-blue-700 via-blue-800 to-gray-900">
      <h1 className="mb-10 text-white">Login Page - Landing Page</h1>
      <button
        type="button" class="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-8 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 "
        onClick={handleEnterButton} >
        Enter Button / Login
      </button>
      <button
        type="button" class="text-white bg-blue-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
        onClick={handleSignupButton} >
        Signup Here
      </button>
    </div>
  )
}

export default Login

