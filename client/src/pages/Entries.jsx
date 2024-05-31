import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';


const Entries = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [error, setError] = useState(null);

    const getEntries = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('token from entries fetch req ->', token);
            const { data } = await axios.get('http://localhost:3333/entries', {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}` //This will include token in the headers
                }
            });
            console.log('axios entry data ->', data.data);
            setEntries(data.data);
        } catch (error) {
            console.error('Error fetching entries:', error);
            setError("Error fetching entries in FrontEnd. Please fix your shit")
        }
    }
    useEffect(() => {
        getEntries();
    }, []);


    // const deleteEntry = async (id) => {
    //     //window pop up that checks to make sure you want to delete the entry 
    //     if (window.confirm('Are you sure you want to delete this entry?')) {
    //         try {
    //             await axios.delete(`http://localhost:3333/entries/${id}`);
    //             console.log("Entry deleted with id:", id);
    //             getEntries();
    //         } catch (error) {
    //             console.error("Error deleting entry:", error);
    //             // Handle error scenarios here, potentially setting an error state to show to the user.
    //         }
    //     }
    // };

    const handleNewEntry = () => {
        navigate('/NewEntry')
    };
    const handleHomeButton = () => {
        navigate('/Home');
    }
    // const handleViewEntry = (id) => {
    //     navigate(`/SingleEntry/${id}`);
    // }

    const newEntries = entries.map(({ _id, title }) => {
        return (

            <Link to={`/SingleEntry/${_id}`} key={_id}
                className="w-full md:w-1/3 px-2 mb-4 ">

                {/* <div className="border border-2 border-indigo-500 p-3 rounded-md hover:bg-gray-100 transition duration-300 ease-in-out"> */}
                <div className="border border-2 border-indigo-500 p-3 rounded-md 
                    hover:bg-indigo-200 transition duration-300 ease-in-out transform hover:scale-105">


                    <ul>
                        <li className="text-l text-slate-800">{title}</li>
                    </ul>
                </div>
            </Link>
        )
        //.reverse to prepend entries to top, sure there's a better way but i'm tired right now
    }).reverse();

    return (

        <div className="px-6">
            <button
                className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                onClick={handleHomeButton}>Back Home</button>
            <button
                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                onClick={handleNewEntry}>Make New Entry</button>
            <br />
            <h2 className="text-4xl font-bold  text-center mb-5"> Clicky entry to view details</h2>
            <div className="flex flex-wrap -mx-2">

                {newEntries}
            </div>
            <br />
            <br />
        </div>
    )
}

export default Entries;

