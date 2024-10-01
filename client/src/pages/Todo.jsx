import React from 'react'
import NavBar from '../components/navbar'

const Todo = () => {
    return (
        <div>
            <NavBar />
            <h1>
                Todo List to go here
            </h1>
            <ul>
                <li>Todo 1</li>
                <li>Todo 2</li>
                <li>Todo 3</li>
            </ul>
        </div>
    )
}

export default Todo;