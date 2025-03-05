import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';
import fallImage from '../../public/images/fall-bg.jpg';
import beachIMG from '../../public/images/beach.jpg';
import mountains from '../../public/images/mountains.jpg';


/**
 * Entries component that displays a list of blog entries fetched from the server.
 * Provides navigation to create a new entry and view individual entry details.
 */
const Entries = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [error, setError] = useState(null);

    /**
     * Fetches the list of entries from the server and updates the state.
     */
    const getEntries = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:3333/entries', {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            setEntries(data.data);
        } catch (error) {
            console.error('Error fetching entries:', error);
            setError("Error fetching entries in FrontEnd. Please fix your shit");
        }
    };

    // Fetch entries on component mount
    useEffect(() => {
        getEntries();
    }, []);

    /**
     * Navigates to the NewEntry page for creating a new entry.
     */
    const handleNewEntry = () => {
        navigate('/NewEntry');
    };

    /**
     * Navigates to the Home page.
     */
    const handleHomeButton = () => {
        navigate('/Home');
    };

    // Maps each entry to a formatted JSX element for display
    const newEntries = entries.map(({ _id, title, createdAt }) => {
        const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

        return (
            <div className="w-full flex items-center justify-center" key={_id}>
                <Link to={`/SingleEntry/${_id}`} className="w-full px-2 mb-4">
                    <article className="max-w-sm w-full bg-white rounded-lg shadow-lg overflow-hidden dark:bg-amber-50 hover:bg-cyan-600 transition duration-300 ease-in-out transform hover:scale-105 h-96">
                        <div className="max-w-full">
                            {mountains && <img src={mountains} alt="mountains" className="max-w-full h-auto" />}
                        </div>
                        <div className="flex flex-col gap-1 mt-4 px-4">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-black">{title}</h2>
                        </div>
                        <div className="mt-4 p-4 border-t border-black">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-black">{formattedDate}</h3>
                        </div>
                    </article>
                </Link>
            </div>
        );
    }).reverse();

    return (
        <div style={{
            background: 'linear-gradient(to bottom, white, #3498DB, #2C3E50)',
            height: '100%',
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden'
        }}>
                <NavBar />
            <div className="px-6 flex flex-col items-center">
                <br />
                <h1 className="text-4xl font-bold text-center mb-5"> Blog Entries</h1>
                <h5>Click entries to view details</h5>
                <button
                    className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-xl w-1/3 px-5 py-2.5 text-center mb-2"
                    onClick={handleNewEntry}>
                    Make New Entry
                </button>
                <div className="grid grid-cols-3 gap-4">
                    {newEntries}
                </div>
                <button
                    className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-xl w-1/3 px-5 py-2.5 text-center mb-2"
                    onClick={handleNewEntry}>
                    Make New Entry
                </button>
            </div>
        </div>
    );
}

export default Entries;

