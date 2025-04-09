import React, { useEffect, useState, useRef } from 'react'
import { Link, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LogLocalStorage from '../components/LogLocalStorage';
import PsychedelicPattern from '../components/PsychedelicPattern';
import SpaceButton from '../components/SpaceButton';
import GradientCard from '../components/GradientCard';
import AboutCard from '../components/AboutCard';
import stars from '../../public/videos/starryVideo.mp4'
import mountains from '../../public/images/mountains.jpg';
import computerGlasses from '../../public/images/computer_glasses.jpg';
import mtsRed from '../../public/images/mts_Red.jpg';
import bannerTwo from '../../public/images/bannerTwo.jpg';

/**
 * The Home component is the main page of the application.
 * It displays a welcome message with the user's name, multiple content sections,
 * and a reusable footer component.
 */

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const techScrollRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

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

  // Initialize auto-scrolling for technologies section
  useEffect(() => {
    const scrollContainer = techScrollRef.current;
    
    if (scrollContainer) {
      // Start auto-scrolling
      const startAutoScroll = () => {
        if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
        
        scrollIntervalRef.current = setInterval(() => {
          if (!isPaused && scrollContainer) {
            scrollContainer.scrollLeft += 1; // Smooth, slow scrolling
            
            // Reset scroll when we reach the end to create an infinite loop effect
            if (scrollContainer.scrollLeft >= 
                (scrollContainer.scrollWidth - scrollContainer.clientWidth)) {
              scrollContainer.scrollLeft = 0;
            }
          }
        }, 30); // Adjust timing for slower/faster scroll
      };
      
      startAutoScroll();
      
      // Add hover handlers to pause/resume scrolling
      const handleMouseEnter = () => setIsPaused(true);
      const handleMouseLeave = () => setIsPaused(false);
      
      scrollContainer.addEventListener('mouseenter', handleMouseEnter);
      scrollContainer.addEventListener('mouseleave', handleMouseLeave);
      
      // Cleanup
      return () => {
        if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [isPaused]);

  return (
    <div className="min-h-screen flex flex-col [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <Navbar />

      {/* Hero Banner Section */}
      <div className="relative h-[50vh] w-full mx-auto mt-0 bg-black overflow-hidden">
        {/* Psychedelic Pattern Background */}
        <div className="absolute inset-0 w-screen h-full">
          <PsychedelicPattern />
        </div>
        
        {/* Content Overlay with higher z-index */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
          <div className="text-center">
            <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
              Welcome to {userName ? userName + "'s" : "My"} Tech Blog
            </h1>
            <p className="text-white text-xl md:text-2xl">
              Exploring Software Engineering, Web Development, and Technology
            </p>
            <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
              <SpaceButton text="READ BLOG" to="/entries" />
              {/* <Link to="/contactPage" className="bg-transparent hover:bg-white hover:text-purple-700 text-white font-bold py-3 px-6 rounded-lg border border-white transition-colors">
                Contact Me
              </Link> */}
            </div>
          </div>
        </div>
      </div>

      {/* About Me Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        {/* <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">About Me</h2>
          <div className="h-1 w-20 bg-purple-500 mx-auto"></div>
        </div> */}
        
        <div className="flex justify-center">
          <AboutCard />
        </div>
      </section>

      {/* Technologies Section with auto-scroll */}
      <section className="py-16 px-4 md:px-8 bg-gray-900 bg-opacity-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Technologies I Work With</h2>
            <div className="h-1 w-20 bg-purple-500 mx-auto"></div>
            <p className="text-gray-300 mt-4 text-sm italic">Hover over card for details</p>
          </div>
          
          <div className="relative">
            {/* Scrollable container with auto-scroll */}
            <div 
              ref={techScrollRef}
              className="overflow-x-auto scrollbar-hide pb-12 pt-6" 
              style={{ minHeight: '290px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex space-x-12 min-w-max px-8 py-2">
                {/* Technology Cards */}
                <GradientCard 
                  title="React"
                  subtitle="Frontend Library"
                  highlight="Component-based"
                />
                
                <GradientCard 
                  title="Node.js"
                  subtitle="Backend Runtime"
                  highlight="JavaScript everywhere"
                />
                
                <GradientCard 
                  title="MongoDB"
                  subtitle="Database"
                  highlight="NoSQL, Document-based"
                />
                
                <GradientCard 
                  title="JavaScript"
                  subtitle="Programming Language"
                  highlight="Web Development"
                />
                
                <GradientCard 
                  title="Next.js"
                  subtitle="React Framework"
                  highlight="SSR & Static Generation"
                />
                
                <GradientCard 
                  title="TypeScript"
                  subtitle="JavaScript Superset"
                  highlight="Type Safety"
                />
                
                <GradientCard 
                  title="TailwindCSS"
                  subtitle="CSS Framework"
                  highlight="Utility-first"
                />
                
                <GradientCard 
                  title="GraphQL"
                  subtitle="Query Language"
                  highlight="Efficient data fetching"
                />
                
                <GradientCard 
                  title="AWS"
                  subtitle="Cloud Services"
                  highlight="Scalable infrastructure"
                />
              </div>
            </div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-gray-900 to-transparent w-12 h-full pointer-events-none"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-gray-900 to-transparent w-12 h-full pointer-events-none"></div>
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
          <Link to="/contactPage" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
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