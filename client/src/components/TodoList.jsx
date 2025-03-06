import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const TodoList = ({ todo, onDeleteTodo }) => {
    console.log('todo from TodoList component ->', todo);
    const navigate = useNavigate();

    /**
     * A function that prompts a user to confirm they want to delete the todo, and
     * if confirmed, calls the onDeleteTodo function with the todo's id.
     * @param {string} id - The id of the todo to delete
     */
    const handleDelete = (id) => {
        // confirm that the user wants to delete the todo
        if (window.confirm("Are you sure you want to delete this todo?")) {
            // call the onDeleteTodo function with the todo's id
            onDeleteTodo(id);
        }
    };

    

    return (
        <div>
            {todo.map((todo) => (
                <div
                    //conditional statement to change background color based on priority
                    className={`flex flex-col items-left justify-center max-w-sm rounded-lg shadow-lg  w-2/3 my-4 mx-auto p-4 border border-black hover:bg-blue-300 ${todo.priority === "High" ? "bg-red-200" : todo.priority === "Medium" ? "bg-yellow-200" : "bg-green-200"
                        }`}
                >
                    <p className="text-gray-600 text-xl">
                        <span className="font-bold">Title:</span> {todo.title}
                    </p>
                    <p className="text-gray-600 text-sm">
                        <span className="font-bold">Date Created:</span> {new Date(todo.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 text-sm">
                        <span className="font-bold">Status:</span> {todo.status}
                    </p>
                    <p className="text-gray-600 text-sm">
                        <span className="font-bold">Priority:</span> {todo.priority}
                    </p>
                    <p className="text-gray-600 text-xs">
                        <span className="font-bold">Notes:</span> {todo.notes}
                    </p>

                    <div className="flex justify-center mt-4">
                        {/* <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                            onClick={() => handleDelete(todo._id)}
                        >
                            Delete
                        </button> */}
                        <button
                            className="bg-yellow-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded border border-black"
                            onClick={() => navigate(`/SingleTodo/${todo._id}`)}
                        >
                            Edit | Delete
                        </button>

                        

                    </div>

                </div>
            ))}



        </div>
    );
};

export default TodoList