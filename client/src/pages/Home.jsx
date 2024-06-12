import React, { useEffect, useState } from 'react'
import { Link, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';
import LogLocalStorage from '../components/LogLocalStorage';


const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Retrieve user information from localStorage
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleClick = () => {
    navigate('/ContactPage');
  }
  const handleTest2 = () => {
    navigate('/test2');
  }
  const handleAPIClick = () => {
    navigate('/APITestPage');
  }
  const handleViewEntries = () => {
    navigate('/Entries')
  }

  return (
    

    <div>
      <NavBar />
      <div className="h-screen relative  inset-0 flex flex-col justify-center items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] z-0">
        <h2 className="z-10 text-white bg-clip-text text-6xl font-bold text-center">
          Welcome to the Home Page {userName}
        </h2>
        <br />
        <div className="z-10 flex flex-row items-center justify-center ">
          {/* <button
            className="mt-20 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm h-20 px-10 py-2.5 text-center me-2 mb-1"
            onClick={handleClick}
          >
            Button to ContactPage
          </button>
          <br /> */}
          <button
            className="mt-20 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm h-20 px-10 py-2.5 text-center me-2 mb-1"
            onClick={handleTest2}
          >
            Button to Test2
          </button>
          <br />
          {/* <button
            className="mt-20 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm h-20 px-10 py-2.5 text-center me-2 mb-1"
            onClick={handleAPIClick}
          >
            Button to API test Page
          </button>
          <br />
          <button
            className="mt-20 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm h-20 px-10 py-2.5 text-center me-2 mb-1"
            onClick={handleViewEntries}
          >
            View Entries
          </button> */}
          <LogLocalStorage/>
        </div>
      </div>
    </div>
  );
  
}

export default Home