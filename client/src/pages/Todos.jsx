import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/navbar';
import { Link, useNavigate } from 'react-router-dom';
import TodoList from '../components/TodoList';


const Todos = () => {
    const navigate = useNavigate();
    const [todos, setTodos] = useState([]);
    const [completedTodos, setCompletedTodos] = useState([]);
    const [incompleteTodos, setIncompleteTodos] = useState([]);

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
            // console.log('response.data ->', response.data.data);
            const todoList = response.data.data;
            setTodos(todoList);

            setCompletedTodos(todoList.filter((todo) => todo.status === "Completed"));

            const sortedIncompleteTodos = todoList.filter((todo) => todo.status !== "Completed")
            .sort((a, b) => {
                const priorityOrder = ["High", "Medium", "Low"];
                return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
            });
        setIncompleteTodos(sortedIncompleteTodos);

            // setIncompleteTodos(todoList.filter((todo) => todo.status !== "Completed"));

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
            console.log('enter deleteTodo block');
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



    //function that will map through todos and display them in a list
    //make sure to include all properties such as title, createdAt, etc.
    // const displayTodos = todos.map((todo) => {

    //     return (
    //         <div
    //             //conditional statement to change background color based on priority
    //             className={`flex flex-col items-left justify-center max-w-sm mx-auto p-4 border border-black hover:bg-gray-100 ${todo.priority === "High" ? "bg-red-200" : todo.priority === "Medium" ? "bg-yellow-200" : "bg-green-200"
    //                 }`}
    //         >
    //             {/* <Link to={`/SingleTodo/${todo._id}`} key={todo._id}> */}
    //             <li key={todo._id} className="py-2 px-4  hover:bg-gray-100 hover:border-purple-500">
    //                 <p className="text-gray-600 text-xl">
    //                     <span className="font-bold">Title:</span> {todo.title}
    //                 </p>
    //                 <p className="text-gray-600 text-sm">
    //                     <span className="font-bold">Priority:</span> {todo.priority}
    //                 </p>
    //                 <p className="text-gray-600 text-sm">
    //                     <span className="font-bold">Status:</span> {todo.status}
    //                 </p>
    //                 <p className="text-gray-600 text-sm">
    //                     <span className="font-bold">Date Created:</span> {new Date(todo.date).toLocaleDateString()}
    //                 </p>
    //                 <p className="text-gray-600 text-xs">
    //                     <span className="font-bold">Notes:</span> {todo.notes}
    //                 </p>
    //                 <div className="flex justify-center mt-4">
    //                     <button
    //                         className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
    //                         onClick={() => {
    //                             if (window.confirm(`Are you sure you want to delete this task?`)) {
    //                                 // Call the function to delete the todo and navigate back to the todos page
    //                                 deleteTodo(todo._id);
    //                                 navigate('/Todos');
    //                                 getTodos();
    //                             }
    //                         }}

    //                     >
    //                         Delete
    //                     </button>
    //                     <button
    //                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    //                         onClick={() => navigate(`/SingleTodo/${todo._id}`)}
    //                     >
    //                         Edit
    //                     </button>
    //                 </div>
    //             </li>
    //             {/* </Link> */}
    //         </div>
    //     );
    // });



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
