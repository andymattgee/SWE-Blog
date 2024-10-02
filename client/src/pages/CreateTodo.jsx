import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';
import axios from 'axios';

const Todo = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [priority, setPriority] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log(`Title: ${title}, Notes: ${notes}, Priority: ${priority}, Status: ${status}, Date: ${new Date()}`);
        
        // Add Todo logic here using axios, first make sure to check for token in local storage
        try {
            console.log('enter try block');
            const token = localStorage.getItem('token');
            console.log('token ->', token);
            const response = await axios.post('http://localhost:3333/api/todos', {
                title,
                notes,
                priority,
                status,
                date: new Date(),
                user: localStorage.getItem('userId')
            },{
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log('response from axios req ->', response.data);

            setTitle('');
            setNotes('');
            setPriority('');
            setStatus('');
            navigate('/todos');
        } catch (error)  {
            console.log('Error from catch of axios req');
            console.log(error);
        };

    
    };

    return (
        <div>
            <NavBar />

            <div className="flex justify-center items-center h-screen">
                <div className="w-1/2 p-4 bg-white rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold mb-4 text-center">Todo Page</h1>

                    <form onSubmit={handleSubmit} className="flex flex-col">

                        <label className="text-lg mb-2">
                            Task/Title:
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 border border-gray-400 rounded-lg"
                            />
                        </label>

                        <label className="text-lg mb-2">
                            Creation Date:
                            <input
                                type="date"
                                className="w-full p-2 border border-gray-400 rounded-lg"
                            />

                            </label>
                        <br />

                        <label className="text-lg mb-2">
                            Priority:
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full p-2 border border-gray-400 rounded-lg"
                            >
                                <option value="">Select Priority</option>
                                <option value="High">High</option>
                                <option value="Low">Low</option>
                            </select>
                        </label>

                        <br />

                        <label className="text-lg mb-2">
                            Status:
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full p-2 border border-gray-400 rounded-lg"
                            >
                                <option value="">Select Status</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </label>

                        <br />

                        <label className="text-lg mb-2">
                            Additional Notes:
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full p-2 border border-gray-400 rounded-lg"
                            />
                        </label>

                        <br />

                        <button
                            type="submit"
                            className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-purple-800"
                        >
                            Submit
                        </button>

                    </form>

                </div>
            </div>
        </div>
    );
};

export default Todo;