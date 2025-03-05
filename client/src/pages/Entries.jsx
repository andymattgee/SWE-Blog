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
    // const [isListView, setIsListView] = useState(false);
    const [isListView, setIsListView] = useState(() => {
        const storedState = localStorage.getItem('isListView');
        return storedState === 'true';
      });
    

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
//     useEffect(() => {
//         localStorage.setItem('isListView', isListView.toString());
//   }, [isListView]);

//   const toggleListView = () => {
//     setIsListView(!isListView);
//   };

//     useEffect(() => {
//         getEntries();
//     }, []);
useEffect(() => {
    localStorage.setItem('isListView', isListView.toString());
    getEntries();
  }, [isListView]);

  
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

                <button
                    onClick={() => setIsListView(!isListView)}
                    className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-700 hover:to-green-700 border border-grey-500 text-white py-2 px-4 rounded"
                >
                    {isListView ? 'Change to Grid View' : 'Change to List View'}
                </button>

                <h5>Click entries to view details</h5>
                <button
                    className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-xl w-1/3 px-5 py-2.5 text-center mb-2"
                    onClick={handleNewEntry}>
                    Make New Entry
                </button>

                <div className={`${isListView ? "flex flex-col items-center w-full" : "grid grid-cols-3 gap-4"}`}>
                    {isListView ? (
                        <div className="w-full max-w-lg text-center">
                            <ul className="list-none w-full">
                                {entries.slice().reverse().map((entry) => (
                                    // <li key={entry._id} className="mb-4 p-4 border border-gray-300 rounded-lg bg-white shadow-lg hover:bg-gray-100 hover:border-gray-400 transition duration-300">
                                    //     <Link to={`/singleentry/${entry._id}`} className="block w-full">
                                    //         <span className="text-lg font-bold block">{entry.title}</span>
                                    //         <span className="text-sm text-gray-600 block">{new Date(entry.createdAt).toLocaleDateString()}</span>
                                    //     </Link>
                                    // </li>
                                    <li key={entry._id} className="mb-4 p-4 border border-gray-300 rounded-lg bg-white shadow-lg hover:bg-gray-100 hover:border-gray-400 transition duration-300">
                                        <Link to={`/singleentry/${entry._id}`} className="flex justify-between w-full">
                                            <span className="text-lg font-bold">{entry.title}</span>
                                            <span className="text-sm text-gray-600 block">{new Date(entry.createdAt).toLocaleDateString()}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        newEntries
                    )}
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

