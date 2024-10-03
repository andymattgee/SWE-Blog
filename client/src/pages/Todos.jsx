import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/navbar';
import { Link, useNavigate } from 'react-router-dom';


const Todos = () => {
    const navigate = useNavigate();
    const [todos, setTodos] = useState([]);

    const createTodo = async () => {
        navigate('/CreateTodo');
    };

    //create function to retrieve todos from db and incorporate on useEffect to populat a list of todos upon first render
    const getTodos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3333/api/todos', {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('response.data ->', response.data.data);
            setTodos(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getTodos();
    }, []);

    //create function to delete todos
    const deleteTodo = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:3333/api/todos/${id}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('response.data ->', response.data.data);
            // getTodos();
        } catch (error) {
            console.log(error);
        }
    }
    //function that will map through todos and display them in a list
    //make sure to include all properties such as title, createdAt, etc.
    const displayTodos = todos.map((todo) => {

        return (
            <div>
                {/* <Link to={`/SingleTodo/${todo._id}`} key={todo._id}> */}
                    <li key={todo._id} className="py-2 px-4 border-b border-gray-200 hover:bg-gray-100">
                        <p className="text-gray-600">
                            <span className="font-bold">Title:</span> {todo.title}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-bold">Notes:</span> {todo.notes}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-bold">Priority:</span> {todo.priority}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-bold">Status:</span> {todo.status}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-bold">Date:</span> {todo.date}
                        </p>
                        <div className="flex justify-center mt-4">
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                                onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete this task?`)) {
                                        // Call the function to delete the todo and navigate back to the todos page
                                        deleteTodo(todo._id);
                                        navigate('/Todos');  
                                        getTodos();                   
                                    }
                                }}
                                
                            >
                                Delete
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => navigate(`/SingleTodo/${todo._id}`)}
                            >
                                Edit
                            </button>
                        </div>
                    </li>
                {/* </Link> */}
            </div>
        );
    });



    return (
        <div>
            <NavBar />
            <div>
                Todos
            </div>
            <button className='focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900' onClick={createTodo}>Create ToDo</button>

            <div>
                <h1>TODO List   </h1>
                <ul>
                    {displayTodos}
                </ul>
            </div>
        </div>
    )
}

export default Todos
