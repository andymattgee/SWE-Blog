import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


const SingleEntry = () => {
    const [entry,setEntry] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams();

    const backToEntries = () => {
        navigate('/Entries')
    }
   
    const getEntry = async () => {
        const  {data}  = await axios.get(`http://localhost:3333/entries/${id}`,
            { headers: { Accept: 'application/json' } });
        console.log("axios data (GET) ->", data);
    
        setEntry(data[0]);
    };

    useEffect(  () => {
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
                <p>{entry.title}</p>
                <h2>Professional</h2>
                <p>{entry.professionalContent}</p>
                <br/>
                <h2>Personal</h2>
                <p>{entry.personalContent}</p>
            </div>
        );
    };

    return (
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
           
        </div>

    )
}

export default SingleEntry