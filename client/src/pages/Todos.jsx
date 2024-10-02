import React, { useState } from 'react'
import NavBar from '../components/navbar';
import { useNavigate } from 'react-router-dom';

const Todos = () => {
    const navigate = useNavigate();
    const createTodo = async () => {
        navigate('/CreateTodo');
    };

    return (
        <div>
            <NavBar />
            <div>
                Todos (List of ToDos to go here)
            </div>
            <button className='focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900' onClick={createTodo}>Create ToDo</button>
        </div>
    )
}

export default Todos
