import React, { useEffect, useState } from 'react'
import { Link, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';
import LogLocalStorage from '../components/LogLocalStorage';
import stars from '../../public/videos/starryVideo.mp4'
import mountains from '../../public/images/mountains.jpg';


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


  const handleTest2 = () => {
    navigate('/test2');
  }


  return (


    <div>
      <div className='bg-transparent'>

        <NavBar />
      </div>
      <div className="h-screen relative  inset-0 flex flex-col justify-center items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] z-0">




        <h2 className="z-10 text-white bg-clip-text text-6xl font-bold text-center mb-10">
          Welcome to the Home Page {userName}
        </h2>
        <br />
        <div className="z-10 flex flex-row items-center justify-center ">
          {/* <button
            className="mt-20 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm h-20 px-10 py-2.5 text-center me-2 mb-1"
            onClick={handleTest2}
          >
            Button to Test2
          </button> */}
          <br />

          <LogLocalStorage />

          
        </div>
      </div>


        <div class="flex justify-center ">
          <article class="max-w-sm w-full bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-600">
            <div className="max-w-full">
              {mountains && <img src={mountains} alt="mountains" className="max-w-full h-auto" />}

            </div>

            <div class="flex flex-col gap-1 mt-4 px-4">
              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-50">Title</h2>
              <span class="font-normal text-gray-600 dark:text-gray-300">Blog Article</span>
              <span class="font-semibold text-gray-800 dark:text-gray-50">Data Here</span>
            </div>

            <div class="mt-4 p-4 border-t border-gray-200 dark:border-gray-500">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-50">Text below Line</h3>
            </div>
          </article>
        </div>


    </div>
  );

}

export default Home