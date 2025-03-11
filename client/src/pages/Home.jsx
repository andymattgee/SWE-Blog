import React, { useEffect, useState } from 'react'
import { Link, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';
import Footer from '../components/Footer';
import LogLocalStorage from '../components/LogLocalStorage';
import stars from '../../public/videos/starryVideo.mp4'
import mountains from '../../public/images/mountains.jpg';
import computerGlasses from '../../public/images/computer_glasses.jpg';
import mtsRed from '../../public/images/mts_Red.jpg';
import bannerOne from '../../public/images/bannerOne.jpg';
import bannerTwo from '../../public/images/bannerTwo.jpg';

/**
 * The Home component is the main page of the application.
 * It displays a welcome message with the user's name, multiple content sections,
 * and a reusable footer component.
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

  return (
    <div className="min-h-screen flex flex-col [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <NavBar />

      {/* Hero Banner Section */}
      <div className="relative h-[50vh] w-full mx-auto mt-0">
        <img 
          src={bannerOne} 
          alt="Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
              Welcome to {userName ? userName + "'s" : "My"} Tech Blog
            </h1>
            <p className="text-white text-xl md:text-2xl">
              Exploring Software Engineering, Web Development, and Technology
            </p>
            <div className="mt-8">
              <Link to="/entries" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors mr-4">
                Read Blog
              </Link>
              <Link to="/contact" className="bg-transparent hover:bg-white hover:text-purple-700 text-white font-bold py-3 px-6 rounded-lg border border-white transition-colors">
                Contact Me
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* About Me Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">About Me</h2>
          <div className="h-1 w-20 bg-purple-500 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-gray-800 bg-opacity-50 p-8 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">Who I Am</h3>
            <p className="text-gray-300 mb-4">
              This section will contain information about your background, education, and personal interests.
              Share your journey into software engineering and what drives your passion for technology.
            </p>
            <p className="text-gray-300">
              You can include details about your hobbies, values, and what makes you unique as a developer.
            </p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 p-8 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">My Skills</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-white">Frontend Development</span>
                  <span className="text-purple-400">90%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-white">Backend Development</span>
                  <span className="text-purple-400">85%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-white">Database Management</span>
                  <span className="text-purple-400">80%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-16 px-4 md:px-8 bg-gray-900 bg-opacity-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Technologies I Work With</h2>
            <div className="h-1 w-20 bg-purple-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Technology Cards */}
            <div className="bg-gray-800 p-6 rounded-lg text-center hover:transform hover:scale-105 transition-transform">
              <div className="text-4xl text-purple-400 mb-4">
                <i className="fab fa-react"></i>
              </div>
              <h3 className="text-xl font-semibold text-white">React</h3>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg text-center hover:transform hover:scale-105 transition-transform">
              <div className="text-4xl text-purple-400 mb-4">
                <i className="fab fa-node-js"></i>
              </div>
              <h3 className="text-xl font-semibold text-white">Node.js</h3>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg text-center hover:transform hover:scale-105 transition-transform">
              <div className="text-4xl text-purple-400 mb-4">
                <i className="fas fa-database"></i>
              </div>
              <h3 className="text-xl font-semibold text-white">MongoDB</h3>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg text-center hover:transform hover:scale-105 transition-transform">
              <div className="text-4xl text-purple-400 mb-4">
                <i className="fab fa-js"></i>
              </div>
              <h3 className="text-xl font-semibold text-white">JavaScript</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Highlight Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Projects</h2>
          <div className="h-1 w-20 bg-purple-500 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Project Cards */}
          <div className="bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden border border-gray-700">
            <img src={mountains} alt="Project 1" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Project One</h3>
              <p className="text-gray-300 mb-4">
                Description of your first featured project. Highlight the technologies used and your role.
              </p>
              <a href="#" className="text-purple-400 hover:text-purple-300">Learn more →</a>
            </div>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden border border-gray-700">
            <img src={computerGlasses} alt="Project 2" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Project Two</h3>
              <p className="text-gray-300 mb-4">
                Description of your second featured project. Highlight the technologies used and your role.
              </p>
              <a href="#" className="text-purple-400 hover:text-purple-300">Learn more →</a>
            </div>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden border border-gray-700">
            <img src={mtsRed} alt="Project 3" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Project Three</h3>
              <p className="text-gray-300 mb-4">
                Description of your third featured project. Highlight the technologies used and your role.
              </p>
              <a href="#" className="text-purple-400 hover:text-purple-300">Learn more →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 px-4 md:px-8 bg-gray-900 bg-opacity-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Let's Work Together</h2>
          <p className="text-xl text-gray-300 mb-8">
            Interested in collaborating or have questions about my work?
            Feel free to reach out and let's start a conversation.
          </p>
          <Link to="/contact" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            Get in Touch
          </Link>
        </div>
      </section>

      {/* LogLocalStorage positioned at bottom right */}
      <div className="fixed bottom-8 right-8 z-10">
        <LogLocalStorage />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home