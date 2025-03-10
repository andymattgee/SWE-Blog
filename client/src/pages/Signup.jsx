import React from 'react';
import { Link, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from 'axios';

const Signup = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [error, setError] = React.useState(null);

    const handleHomeButton = () => {
        navigate("/Home")
    };

    const onSubmit = async (data) => {
        try {
            const result = await axios.post('http://localhost:3333/api/users/signup', {
                userName: data.userName,
                password: data.password
            });

            if (result.data.success) {
                navigate('/');
            }
        } catch (error) {
            console.error('Signup error:', error);
            setError('Error creating account');
        }
    };

    return (

        <div>

            <div className="flex flex-col items-center justify-center h-screen bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-blue-700 via-blue-800 to-gray-900">
                <h1 className="flex flex-col items-center justify-center text-2xl font-bold text-white mb-10">Under Construction</h1>
                <h1 className="mb-8 text-2xl font-bold text-white">Sign Up Here</h1>

                <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="userName" className="block text-gray-700 font-medium mb-1">UserName</label>
                        <input
                            id="userName"
                            type="text"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            {...register("userName", { required: true })}
                        />
                        {errors.userName && <span className="text-red-500">UserName is required</span>}
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
                    {error && <span className="text-red-500">{error}</span>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <Link to="/" className="text-white hover:text-blue-200 text-sm underline">
                        Already a member? Login here
                    </Link>
                </div>

            </div>

        </div>
    )
}

export default Signup