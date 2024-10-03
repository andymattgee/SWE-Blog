import React,{useState,useEffect} from 'react';
import axios from "axios";
import NavBar from '../components/navbar';
import { useNavigate, useParams } from 'react-router-dom';


const SingleTodo = () => {
    const [todo, setTodo] = useState({});
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [priority, setPriority] = useState('');
    const [status, setStatus] = useState('');

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
        setTitle(data[0].title);
        setNotes(data[0].notes);
        setPriority(data[0].priority);
        setStatus(data[0].status);
    };

    //create a function to edit a todo
    
    //when first coming to this page, id like to render the to do and then immediately edit it
    useEffect(() => {
        getTodo();
        
    }, []);

const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('enter handleSubmit block');
    console.log('title, notes, priority, status ->', title, notes, priority, status);
    // const token = localStorage.getItem('token');
    // const { data } = await axios.patch(`http://localhost:3333/api/todos/${id}`,
    //     {
    //         title,
    //         notes,
    //         priority,
    //         status
    //     },
    //     {
    //         headers: {
    //             Accept: 'application/json',
    //             Authorization: `Bearer ${token}`,
    //         }
    //     }
    // );
    // console.log("axios data (PATCH) ->", data);
    // navigate('/todos');
}
    
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
    <div>
    <h3> Edit to go here</h3>

    <form onSubmit={handleSubmit} className="w-8/12">
                <div className="mb-4 ">
                    <label htmlFor="title">Title: </label>
                    <br />
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="border-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="profContent"> Notes: </label>
                    <br />
                    <textarea
                        id="notes"
                        name="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        required
                        rows={10}
                        className="border-2 w-full p-4"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="priority">Priority: 
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
                    {/* <br />
                    <textarea
                        id="priority"
                        name="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        required
                        rows={10}
                        className="border-2 w-full p-4"
                    /> */}
                </div>

                <div className="mb-4">
                    <label htmlFor="status">Status 
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
                    {/* <br />
                    <textarea
                        id="status"
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                        rows={10}
                        className="border-2 w-full p-4"
                    /> */}
                </div>

                <div className="">
                    <button
                        type="submit"
                        className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 h-20 w-full"
                    >
                        Save Changes
                    </button>
                </div>

            </form>

    </div>
    </div>
  )
}

export default SingleTodo;