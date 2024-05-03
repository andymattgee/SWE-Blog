import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
// import Form from "../components/Form";


const Entries = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);


    const getEntries = async () => {
        const { data } = await axios.get('http://localhost:3333/entries',
            { headers: { Accept: 'application/json' } });
        console.log('axios entry data ->', data.data);
        setEntries(data.data);
    }
    useEffect(() => {
        getEntries();
    }, []);


    const deleteEntry = async (id) => {
        //window pop up that checks to make sure you want to delete the entry 
        if (window.confirm('Are you sure you want to delete this entry?')) {
            try {
                await axios.delete(`http://localhost:3333/entries/${id}`);
                console.log("Entry deleted with id:", id);
                getEntries();
            } catch (error) {
                console.error("Error deleting entry:", error);
                // Handle error scenarios here, potentially setting an error state to show to the user.
            }
        }
    };

    const handleNewEntry = () => {
        navigate('/NewEntry')
    };
    const handleHomeButton = () => {
        navigate('/Home');
    }
    const handleViewEntry = (id) => {
        navigate(`/SingleEntry/${id}`);
        // console.log('params id ->', id);
    }

    const newEntries = entries.map(({ _id, title, createdAt, personalContent, professionalContent }) => {
        return (

            <div key={_id}
                // className="flex flex-col  items-start border-4 border-indigo-500 p-3"
                className="w-full md:w-1/3 px-2 mb-4"
            >
                <div className="border border-indigo-500 p-3">
                    <ul>
                        <li className="text-l text-blue-700">{title}</li>
                        {/* <li>{createdAt}</li> */}
                        {/* <li>Professional: <br />{professionalContent}</li> */}
                        {/* <li>Personal: <br />{personalContent}</li> */}
                    </ul>
                    <button
                        className="text-white bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-5 mt-5 w-2/5 self-center"
                        onClick={() => handleViewEntry(_id)}
                    >
                        View Entry
                    </button>
                    {/* <button
                        className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-5 mt-5 w-2/5 self-center"
                        onClick={() => deleteEntry(_id)}>
                        Delete post above
                    </button> */}
                </div>
            </div>
        )
        //.reverse to prepend entries to top, sure there's a better way but i'm tired right now
    }).reverse();

    return (

        <div>
            <button
                className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                onClick={handleHomeButton}>Back Home</button>
            <button
                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                onClick={handleNewEntry}>Make New Entry</button>
            <br />
            {/* Entries here: */}
<div className="flex flex-wrap -mx-2">

            {newEntries}
</div>
            <br />
            <br />
        </div>
    )
}

export default Entries;

