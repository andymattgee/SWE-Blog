import React from 'react';
import { Link, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";


const Signup = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleHomeButton = () => {
        navigate("/Home")
    };


    const onSubmit = data => {
        console.log(data);
    }

    return (

        <div>

            <div className="flex flex-col items-center justify-center h-screen bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-blue-700 via-blue-800 to-gray-900">
            <h1 className="flex flex-col items-center justify-center text-2xl font-bold text-white mb-10">Under Construction</h1>
                <h1 className="mb-8 text-2xl font-bold text-white">Sign Up Here</h1>
                <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 font-medium mb-1">Username</label>
                        <input
                            id="username"
                            type="text"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            {...register("username", { required: true })}
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
                        Sign Up
                    </button>
                </form>
                <button onClick={handleHomeButton}
                    className="mt-20 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm h-20 px-10 py-2.5 text-center me-2 mb-2 "
                >
                    Home
                </button>
            </div>

        </div>
    )
}

export default Signup