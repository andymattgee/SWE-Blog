import React from 'react'
import { Link, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import LogLocalStorage from '../components/LogLocalStorage';
import { useUser } from '../context/UserContext';


const Login = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const { updateUserData } = useUser();

  const handleEnterButton = () => {
    navigate("/Home")
  }
  const handleSignupButton = () => {
    navigate("/Signup")
  };
  const onSubmit = async (data) => {
    // console.log('data.username ->', data.username);
    // console.log('data.password ->', data.password)

    //from the robot
    try {
      const response = await fetch('http://localhost:3333/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (response.ok) {
        console.log('Login successful:', result);
        // Save token to localStorage
        localStorage.setItem('token', result.token);
        
        // Store user data in context
        const userData = {
          userName: result.user.userName,
          entriesCount: 0,
          tasksCount: 0
        };

        updateUserData(userData);
        navigate("/Home");
      } else {
        console.error('Login failed:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }

    reset({username:'', password: ''});
}

  return (


    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-tr from-cyan-600 via-blue-700 to-indigo-800">

      <h1 className="text-white text-5xl font-bold font-serif mb-10">Engineering Blog</h1>

<form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 font-medium mb-1">Username</label>
                        <input
                            id="username"
                            type="text"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            {...register("userName", { required: true })}
                        />
                        {errors.username && <span className="text-red-500">Username is required</span>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            {...register("password", { required: true })}
                        />
                        {errors.password && <span className="text-red-500">Password is required</span>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                        Log In
                    </button>
                </form>
<h3 className="text-white mt-5">Not a Member? Sign up using button below</h3>
      <button
        type="button" class="text-white bg-blue-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 mt-5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
        onClick={handleSignupButton} >
        Signup Here
      </button>
      <LogLocalStorage/>
    </div>
  )
}

export default Login

