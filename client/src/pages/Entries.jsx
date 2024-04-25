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

    const newEntries = entries.map(({ _id, title, createdAt, personalContent, professionalContent }) => {
        return (

            <div key={_id}
                style={{ border: 'solid' }}>
                <ul>
                    <li>Title: {title}</li>
                    <li>Date & Time: {createdAt}</li>
                    <li>Professional: <br />{professionalContent}</li>
                    <li>Personal: <br />{personalContent}</li>
                </ul>
                <button onClick={() => deleteEntry(_id)}>Delete post above</button>
            </div>
        )
        //.reverse to prepend entries to top, sure there's a better way but i'm tired right now
    }).reverse();

    return (

        <div>
            <button 
            class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={handleHomeButton}>Back Home</button>
            <button
            class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={handleNewEntry}>Make New Entry</button>
            <br/>
            Entries here:
            {newEntries}
            <br />
            <br />
        </div>
    )
}

export default Entries;

