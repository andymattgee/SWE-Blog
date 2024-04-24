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
            <button onClick={handleHomeButton}>Back Home</button>
            <br/>
            Entries here:
            {newEntries}
            <br />
            <br />
            <button onClick={handleNewEntry}>Make New Entry</button>
        </div>
    )
}

export default Entries;

