import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/navbar';
import { Link, useNavigate } from 'react-router-dom';
import TodoList from '../components/TodoList';


/**
 * The Todos component is the main page of the application that displays the user's
 * to-do list. It retrieves the list of todos from the database and displays them
 * in two columns - one for completed and one for incomplete todos.
 *
 * The component also renders a button to create a new todo, which navigates to
 * the CreateTodo page.
 */

const Todos = () => {
    const navigate = useNavigate();
    const [todos, setTodos] = useState([]);
    const [completedTodos, setCompletedTodos] = useState([]);
    const [incompleteTodos, setIncompleteTodos] = useState([]);

    /**
     * Navigates to the CreateTodo page to create a new todo.
     */
    const createTodo = async () => {
        navigate('/CreateTodo');
    };

    /**
     * Retrieves the list of todos from the database and sets the state of the
     * todos, completedTodos and incompleteTodos arrays. It also calls
     * getTodos() on the first render to populate the list of todos.
     */
    const getTodos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3333/api/todos', {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            // console.log('response.data ->', response.data.data);
            const todoList = response.data.data;
            setTodos(todoList);

            setCompletedTodos(todoList.filter((todo) => todo.status === "Completed"));
            setIncompleteTodos(todoList.filter((todo) => todo.status !== "Completed"));

        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getTodos();
    }, []);

    /**
     * Deletes a todo from the database and re-retrieves the list of todos to
     * update the state of the component.
     * @param {string} id The id of the todo to delete.
     */
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
            getTodos();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <NavBar />
            <div className="flex justify-center mt-4 mb-4">
                <button className='focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-large rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900 w-1/2 border border-black ' onClick={createTodo}>Create ToDo</button>

            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h2 className="text-lg font-bold mb-2 text-center">Incomplete Todos</h2>
                    <TodoList todo={incompleteTodos} onDeleteTodo={deleteTodo} />
                </div>
                <div>
                    <h2 className="text-lg font-bold mb-2 text-center">Completed Todos</h2>
                    <TodoList todo={completedTodos} onDeleteTodo={deleteTodo} />
                </div>
            </div>


        </div>
    )
}

export default Todos
