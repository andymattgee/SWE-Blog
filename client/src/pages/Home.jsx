import React, { useEffect, useState, useRef } from 'react'
import { Link, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LogLocalStorage from '../components/LogLocalStorage';
import PsychedelicPattern from '../components/PsychedelicPattern';
import BlockPattern from '../components/BlockPattern'; // Import the new pattern
import SpaceButton from '../components/SpaceButton';
import GradientCard from '../components/GradientCard';
import AboutCard from '../components/AboutCard';
import ProjectCard from '../components/ProjectCard';
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
  // Initialize theme state directly from localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

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

  // Effect to listen for theme changes from other tabs/sources
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedTheme = localStorage.getItem('theme');
      setIsDarkMode(updatedTheme === 'dark');
    };
    // Listen to storage event for changes
    window.addEventListener('storage', handleStorageChange);
    // Also listen to a custom event that ThemeSwitch could dispatch
    // This handles changes within the same tab more reliably
    const handleThemeChange = () => {
       const updatedTheme = localStorage.getItem('theme');
       setIsDarkMode(updatedTheme === 'dark');
    }
    window.addEventListener('themeChanged', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []); // Empty dependency array means this runs once on mount to set up listeners

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

  // Project data
  const projects = [
    {
      title: "Project One",
      image: mountains,
      projectUrl: "https://github.com",
      types: [
        { name: "React", bgColor: "rgba(97, 218, 251, 0.2)", textColor: "#2196f3" },
        { name: "Frontend", bgColor: "#e6f7ff", textColor: "#0078d7" }
      ]
    },
    {
      title: "Project Two",
      image: computerGlasses,
      projectUrl: "https://github.com",
      types: [
        { name: "Node.js", bgColor: "rgba(104, 159, 56, 0.2)", textColor: "#388e3c" },
        { name: "Backend", bgColor: "#e8f5e9", textColor: "#2e7d32" }
      ]
    },
    {
      title: "Project Three",
      image: mtsRed,
      projectUrl: "https://github.com",
      types: [
        { name: "MongoDB", bgColor: "rgba(76, 175, 80, 0.2)", textColor: "#2e7d32" },
        { name: "Database", bgColor: "#fafafa", textColor: "#424242" }
      ]
    }
  ];

  return (
    // Main div: White background default (light), black background dark
    <div className="min-h-screen flex flex-col dark:bg-black">
      <Navbar />

      {/* Hero Section: White bg light, black bg dark */}
      <section className="py-0 w-full bg-white dark:bg-black">
        <div className="relative h-[50vh] w-full overflow-hidden">
          {/* Conditionally render background pattern based on theme */}
          {isDarkMode ? <PsychedelicPattern /> : <BlockPattern />}
          {/* Overlay */}
          {/* Overlay - Ensure it's above the pattern */}
          <div className="absolute inset-0 bg-black bg-opacity-10 dark:bg-opacity-40 z-10"></div>
          {/* Content */}
          {/* Content - Ensure it's above the overlay and pattern */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="max-w-7xl w-full mx-auto px-4 md:px-8 text-center">
              {/* Light mode: Purple text */}
              <h1 className="text-purple-700 dark:text-white text-4xl md:text-6xl font-bold mb-4">
                Welcome to {userName ? userName + "'s" : "my"} Blog
              </h1>
              {/* Light mode: Lighter purple text */}
              <p className="text-purple-600 dark:text-white text-xl md:text-2xl">
                Exploring Software Engineering, Web Development, and Technology
              </p>
              <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
                <SpaceButton text="READ BLOG" to="/entries" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section: Inherits background from main div */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex justify-center">
          <AboutCard />
        </div>
      </section>

      {/* Technologies Section: Light gray bg light, original dark gray bg dark */}
      <section className="py-16 px-4 md:px-8 bg-gray-100 dark:bg-gray-900 dark:bg-opacity-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">Technologies I Work With</h2>
            <div className="h-1 w-20 bg-purple-500 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm italic">Hover over card for details</p>
          </div>
          
          <div className="relative">
            {/* Scrollable container */}
            <div 
              ref={techScrollRef}
              className="overflow-x-auto scrollbar-hide pb-12 pt-6" 
              style={{ minHeight: '290px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex space-x-12 min-w-max px-8 py-2">
                {/* Technology Cards */}
                <GradientCard title="React" subtitle="Frontend Library" highlight="Component-based" />
                <GradientCard title="Node.js" subtitle="Backend Runtime" highlight="JavaScript everywhere" />
                <GradientCard title="MongoDB" subtitle="Database" highlight="NoSQL, Document-based" />
                <GradientCard title="JavaScript" subtitle="Programming Language" highlight="Web Development" />
                <GradientCard title="Next.js" subtitle="React Framework" highlight="SSR & Static Generation" />
                <GradientCard title="TypeScript" subtitle="JavaScript Superset" highlight="Type Safety" />
                <GradientCard title="TailwindCSS" subtitle="CSS Framework" highlight="Utility-first" />
                <GradientCard title="GraphQL" subtitle="Query Language" highlight="Efficient data fetching" />
                <GradientCard title="AWS" subtitle="Cloud Services" highlight="Scalable infrastructure" />
              </div>
            </div>
            {/* Fades: Adapt to section background */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-gray-100 dark:from-gray-900 to-transparent w-12 h-full pointer-events-none"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-gray-100 dark:from-gray-900 to-transparent w-12 h-full pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Projects Section: Inherits background from main div */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">Featured Projects</h2>
          <div className="h-1 w-20 bg-purple-500 mx-auto"></div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-16 mt-10">
          {projects.map((project, index) => (
            <ProjectCard 
              key={index}
              title={project.title}
              image={project.image}
              projectUrl={project.projectUrl}
              types={project.types}
            />
          ))}
        </div>
      </section>

      {/* Contact CTA Section: Light gray bg light, original dark gray bg dark */}
      <section className="py-16 px-4 md:px-8 bg-gray-100 dark:bg-gray-900 dark:bg-opacity-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">Let's Work Together</h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
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

export default Home;
