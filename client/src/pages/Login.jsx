import React from 'react'
import { Link, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import LogLocalStorage from '../components/LogLocalStorage';
import { useUser } from '../context/UserContext';
import axios from 'axios';

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
    try {
      const response = await axios.post('http://localhost:3333/api/users/login', {
        userName: data.userName,
        password: data.password
      });
      
      // The response directly contains user and token
      const { user, token } = response.data;
      
      // If we got here, the login was successful
      localStorage.setItem('token', token);
      const userData = {
        userName: user.userName,
        entriesCount: user.entries?.length || 0,
        tasksCount: user.todos?.length || 0
      };
      updateUserData(userData);
      navigate("/Home");
    } catch (error) {
      console.error('Login error:', error);
    }

    reset({userName:'', password: ''});
}

  return (


    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-tr from-cyan-600 via-blue-700 to-indigo-800">

      <h1 className="text-white text-5xl font-bold font-serif mb-10">Engineering Blog & Task Tracker</h1>

<form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-300 font-medium mb-1">Username</label>
                        <input
                            id="username"
                            type="text"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            {...register("userName", { required: true })}
                        />
                        {errors.userName && <span className="text-red-500">Username is required</span>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-300 font-medium mb-1">Password</label>
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
                        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 border border-white"
                    >
                        Log In
                    </button>
                </form>
      <button
        type="button" class="text-white bg-blue-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 mt-5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
        onClick={handleSignupButton} >
        Signup Here
      </button>
      <div className="absolute bottom-4 right-4">
        <LogLocalStorage />
      </div>
    </div>
  )
}

export default Login
