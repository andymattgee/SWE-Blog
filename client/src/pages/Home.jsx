import React, { useEffect, useState } from 'react'
import { Link, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';
import LogLocalStorage from '../components/LogLocalStorage';
import stars from '../../public/videos/starryVideo.mp4'
import mountains from '../../public/images/mountains.jpg';
import computerGlasses from '../../public/images/computer_glasses.jpg';
import mtsRed from '../../public/images/mts_Red.jpg';
import bannerOne from '../../public/images/bannerOne.jpg';
import bannerTwo from '../../public/images/bannerTwo.jpg';

/**
 * The Home component is the main page of the application.
 * It displays a welcome message with the user's name, a button to navigate to the Test2 page,
 * and a LogLocalStorage component to display the user's information stored in local storage.
 */

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  /**
   * Retrieve user information from localStorage and update the state
   */
  useEffect(() => {
    // Retrieve user information from localStorage
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  /**
   * Navigate to the Test2 page when the button is clicked
   */
  const handleTest2 = () => {
    navigate('/test2');
  }

  return (
    <div className="min-h-screen relative [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <NavBar />

      {/* Banner Section */}
      <div className="relative h-[50vh] w-full mx-auto mt-0">
        <img 
          src={bannerOne} 
          alt="Banner" 
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50">
          <h2 className="text-white text-2xl font-bold">
            Welcome to {userName}'s Tech Blog
          </h2>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col items-center justify-center px-5 py-12">
        <h2 className="text-white bg-clip-text text-6xl font-bold text-center mb-10">
          Info about me will go here
        </h2>
      </div>

      {/* LogLocalStorage positioned at bottom right */}
      <div className="fixed bottom-8 right-8">
        <LogLocalStorage />
      </div>
    </div>
  );
}

export default Home