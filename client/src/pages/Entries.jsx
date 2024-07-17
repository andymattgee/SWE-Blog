import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';
import fallImage from '../../public/images/fall-bg.jpg';
import beachIMG from '../../public/images/beach.jpg';
import mountains from '../../public/images/mountains.jpg';


const Entries = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [error, setError] = useState(null);

    const getEntries = async () => {
        try {
            const token = localStorage.getItem('token');
            // console.log('token from entries fetch req ->', token);
            const { data } = await axios.get('http://localhost:3333/entries', {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}` //This will include token in the headers
                }
            });
            console.log('entries ->', data.data);
            setEntries(data.data);
        } catch (error) {
            console.error('Error fetching entries:', error);
            setError("Error fetching entries in FrontEnd. Please fix your shit")
        }
    }
    useEffect(() => {
        getEntries();
    }, []);


    const handleNewEntry = () => {
        navigate('/NewEntry')
    };
    const handleHomeButton = () => {
        navigate('/Home');
    }

    const newEntries = entries.map(({ _id, title, createdAt }) => {

        const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });


        return (
            // <Link to={`/SingleEntry/${_id}`} key={_id}
            //     className="w-full md:w-1/3 px-2 mb-4">

            //     <div className="border-2 border-blue-600 p-3 rounded-md bg-white bg-opacity-70
            //     hover:bg-indigo-200 transition duration-300 ease-in-out transform hover:scale-105 h-96 overflow-hidden ">
            //         <ul>
            //             <li className="text-l text-slate-800">{title}</li>
            //         </ul>
            //         <div className="max-w-full">
            //             {mountains && <img src={mountains} alt="mountains" className="max-w-full h-auto" />}
            //             <p>{formattedDate}</p>
            //         </div>
            //     </div>
            // </Link>

            <div class=" w-full flex items-center justify-center ">
                <Link to={`/SingleEntry/${_id}`} key={_id}
                    className="w-full  px-2 mb-4">
                    <article class="max-w-sm w-full bg-white rounded-lg shadow-lg overflow-hidden  dark:bg-amber-50 hover:bg-cyan-600 transition duration-300 ease-in-out transform hover:scale-105 h-96 ">
                        <div className="max-w-full">
                            {mountains && <img src={mountains} alt="mountains" className="max-w-full h-auto" />}
                        </div>
                        <div class="flex flex-col gap-1 mt-4 px-4">
                            <h2 class="text-lg font-semibold text-gray-800 dark:text-black">{title}</h2>
                            {/* <span class="font-normal text-gray-600 dark:text-gray-300">Blog Article</span> */}
                            {/* <span class="font-semibold text-gray-800 dark:text-gray-50">{formattedDate}</span> */}
                        </div>
                        <div class="mt-4 p-4 border-t border-black ">
                            <h3 class="text-lg font-semibold text-gray-800 dark:text-black">{formattedDate}</h3>
                        </div>
                    </article>
                </Link>
            </div>

        )
    }).reverse();
    //.reverse to prepend entries to top, sure there's a better way but i'm tired right now

    // const newCard =
    // <div class=" w-full flex items-center justify-center ">
    //     <Link {`/SingleEntry/${_id}`} key={_id}
    //         className="w-full md:w-1/3 px-2 mb-4">
    //         <article class="max-w-sm w-full bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-600 hover:bg-teal-900 transition duration-300 ease-in-out transform hover:scale-105 h-96 ">
    //             <div className="max-w-full">
    //                 {mountains && <img src={mountains} alt="mountains" className="max-w-full h-auto" />}
    //             </div>
    //             <div class="flex flex-col gap-1 mt-4 px-4">
    //                 <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-50">Title</h2>
    //                 <span class="font-normal text-gray-600 dark:text-gray-300">Blog Article</span>
    //                 <span class="font-semibold text-gray-800 dark:text-gray-50">Data Here</span>
    //             </div>
    //             <div class="mt-4 p-4 border-t border-gray-200 ">
    //                 <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-50">Text below Line</h3>
    //             </div>
    //         </article>
    //     </Link>
    // </div>

    return (
        <div style={{ backgroundImage: `url(${beachIMG})`, backgroundSize: 'cover' }}>

            <NavBar />
            

            {/* <div className="px-6 flex flex-col items-center" > */}
            <div className="px-6 flex flex-col items-center" >
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
    )
}

export default Entries;

