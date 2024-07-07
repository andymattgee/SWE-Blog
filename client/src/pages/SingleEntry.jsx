import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/navbar';


const SingleEntry = () => {
    const [entry, setEntry] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams();

    const backToEntries = () => {
        navigate('/Entries')
    }

    const getEntry = async () => {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`http://localhost:3333/entries/${id}`,
            { headers: { 
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
             } 
            });
        console.log("axios data (GET) ->", data);

        setEntry(data[0]);
    };

    const deleteEntry = async (id) => {
        const token = localStorage.getItem('token');
        //window pop up that checks to make sure you want to delete the entry 
        if (window.confirm('Are you sure you want to delete this entry?')) {
            try {
                await axios.delete(`http://localhost:3333/entries/${id}`,
                    { headers:{
                        Authorization:`Bearer ${token}`
                    }

                    }
                );
                console.log("Entry deleted with id:", id);
                // console.log("Entry id ->", id);
                // getEntries();
                navigate('/Entries')
            } catch (error) {
                console.error("Error deleting entry:", error);
                // Handle error scenarios here, potentially setting an error state to show to the user.
            }
        }
    };
    const editEntry = (id) => {
        console.log('id ->', id);
    };

    useEffect(() => {
        getEntry();
    }, []);

    useEffect(() => {
        console.log("Updated info / State:", entry);
    }, [entry]);

    const renderEntry = () => {
        if (!entry) {
            return <div>Loading...</div>;
        }

        return (
            <div className="flex flex-col items-center border-4 border-indigo-500 p-4">
                <p className="text-3xl font-bold mb-5">{entry.title}</p>
                <h1 className="text-xl font-bold">Professional</h1>
                <p>{entry.professionalContent}</p>
                <br />
                <h2 className="text-xl font-bold">Personal</h2>
                <p>{entry.personalContent}</p>
            </div>
        );
    };

    return (
        <div>
            <NavBar/>
        <div className="flex flex-col items-center justify-center w-11/12">
            <button
                className="text-white bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-5 mt-5 w-2/5 self-center"
                onClick={backToEntries}
                >
                Back To List of Entries
            </button>
            <div className="w-11/12 md:w-8/12 lg:w-6/12">

                {renderEntry()}

            </div>
            <button
                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-5 mt-5 w-2/5 self-center"
                onClick={() => deleteEntry(id)}>
                Delete Post
            </button>
            <button
                className="text-white bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-5 w-2/5 self-center"
                onClick={() => editEntry(id)}>
                Edit Post
            </button>
                    </div>
        </div>

    )
}

export default SingleEntry