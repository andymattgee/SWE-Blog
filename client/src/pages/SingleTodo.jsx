import React,{useState,useEffect} from 'react';
import axios from "axios";
import NavBar from '../components/navbar';
import { useNavigate, useParams } from 'react-router-dom';


const SingleTodo = () => {
    const [todo, setTodo] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    const getTodo = async () => {
        console.log('enter getTodo block from singleTodo.js');
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`http://localhost:3333/api/todos/${id}`,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });
        console.log("axios data (GET) ->", data);
        setTodo(data[0]);
    };

    //create a function to edit a todo
    
    //when first coming to this page, id like to render the to do and then immediately edit it
    useEffect(() => {
        getTodo();
        
    }, []);


    
    const renderTodo = () => {
        if(!todo) {
            return <div>Loading to do....</div>
        }

        return (
            <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-bold text-center mb-4">Todo Details</h2>
              <div className="flex flex-col items-center justify-center">
                <p className="text-center mb-2">
                  <span className="text-lg font-bold">Title:</span> {todo.title}
                </p>
                <p className="text-center mb-2">
                  <span className="text-lg font-bold">Notes:</span> {todo.notes}
                </p>
                <p className="text-center mb-2">
                  <span className="text-lg font-bold">Priority:</span> {todo.priority}
                </p>
                <p className="text-center mb-2">
                  <span className="text-lg font-bold">Status:</span> {todo.status}
                </p>
                <p className="text-center mb-2">
                  <span className="text-lg font-bold">Date:</span> {todo.date}
                </p>
                <div className="flex justify-center mt-4">
                  {/* <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => deleteTodo()}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => console.log('Edit')}
                  >
                    Edit
                  </button> */}
                </div>
              </div>
            </div>
          )
        }

  return (
      <div>
    <h1>Single Todo</h1>
        <NavBar/>
        {renderTodo()}
    </div>
  )
}

export default SingleTodo;