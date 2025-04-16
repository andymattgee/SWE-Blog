// React Hooks and Router imports
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Removed unused Route, Routes, Navigate

// Component imports
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PsychedelicPattern from '../components/PsychedelicPattern'; // Background pattern for dark mode
import BlockPattern from '../components/BlockPattern'; // Background pattern for light mode
import SpaceButton from '../components/SpaceButton'; // Custom button component
import GradientCard from '../components/GradientCard'; // Card for displaying technologies
import AboutCard from '../components/AboutCard'; // Card for the "About Me" section
import ProjectCard from '../components/ProjectCard'; // Card for displaying projects

// Image imports (Ensure these are used or remove if not)
import mountains from '../../public/images/mountains.jpg';
import fall from '../../public/images/fall-bg.jpg'; // Assuming 'computerGlasses' was replaced by 'fall'
import mtsRed from '../../public/images/mts_Red.jpg';
// import bannerTwo from '../../public/images/bannerTwo.jpg'; // Removed unused import


/**
 * The Home component is the main page of the application.
 * It displays a welcome message with the user's name, multiple content sections,
 * and a reusable footer component.
 */

const Home = () => {
  // React Router navigation hook
  const navigate = useNavigate();
  // State for storing the user's name (currently fetched from localStorage, consider context)
  const [userName, setUserName] = useState('');
  // Ref for the technology cards scrolling container
  const techScrollRef = useRef(null);
  // Ref for the interval controlling the auto-scroll
  const scrollIntervalRef = useRef(null);
  // State to pause auto-scrolling on hover
  const [isPaused, setIsPaused] = useState(false);
  // State to track the current theme (light/dark)
  // Initializes based on the value stored in localStorage or defaults to false (light)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark'; // Returns true if 'dark', false otherwise
  });

  // Effect hook to retrieve the user's name from localStorage on component mount.
  // Note: This approach might be less robust than using UserContext if the name needs to be reactive elsewhere.
  useEffect(() => {
    // Retrieve user information from localStorage
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  // Effect hook to synchronize the theme state with changes made in other tabs or by the ThemeSwitch component.
  useEffect(() => {
    // Handler for the 'storage' event, which fires when localStorage changes in another tab/window.
    const handleStorageChange = () => {
      const updatedTheme = localStorage.getItem('theme');
      setIsDarkMode(updatedTheme === 'dark');
    };
    window.addEventListener('storage', handleStorageChange);

    // Handler for a custom 'themeChanged' event dispatched by ThemeSwitch.
    // This ensures theme updates are reflected immediately within the same tab.
    const handleThemeChange = () => {
       const updatedTheme = localStorage.getItem('theme');
       setIsDarkMode(updatedTheme === 'dark');
    };
    window.addEventListener('themeChanged', handleThemeChange);

    // Cleanup function: Remove event listeners when the component unmounts to prevent memory leaks.
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []); // Empty dependency array means this runs once on mount to set up listeners

  // Effect hook to manage the auto-scrolling behavior of the "Technologies I Work With" section.
  useEffect(() => {
    // Get the DOM element for the scrollable container.
    const scrollContainer = techScrollRef.current;
    
    if (scrollContainer) { // Only proceed if the container ref is available
      // Function to initiate the auto-scroll interval.
      const startAutoScroll = () => {
        if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current); // Clear any existing interval
        
        // Set up the interval to increment scrollLeft periodically.
        scrollIntervalRef.current = setInterval(() => {
          // Only scroll if not paused and the container exists.
          if (!isPaused && scrollContainer) {
            scrollContainer.scrollLeft += 1; // Adjust this value for scroll speed

            // Check if the scroll has reached the end.
            // scrollWidth is the total width of the content, clientWidth is the visible width.
            if (scrollContainer.scrollLeft >= (scrollContainer.scrollWidth - scrollContainer.clientWidth)) {
              // Reset scroll position to the beginning for a seamless loop.
              scrollContainer.scrollLeft = 0;
            }
          }
        }, 30); // Adjust timing for slower/faster scroll
      };
      
      startAutoScroll(); // Initialize the scrolling when the component mounts or isPaused changes.
      
      // Event handlers to pause scrolling when the mouse enters the container
      // and resume when it leaves.
      const handleMouseEnter = () => setIsPaused(true); // Set state to pause
      const handleMouseLeave = () => setIsPaused(false);
      
      // Attach event listeners to the scroll container.
      scrollContainer.addEventListener('mouseenter', handleMouseEnter);
      scrollContainer.addEventListener('mouseleave', handleMouseLeave);
      
      // Cleanup function for this effect.
      return () => {
        // Clear the interval timer when the component unmounts or isPaused changes.
        if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
        // Remove event listeners to prevent memory leaks.
        if (scrollContainer) { // Check if scrollContainer still exists before removing listeners
           scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
           scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    }
  }, [isPaused]);

  // Static data for the "Featured Projects" section.
  // In a real application, this might be fetched from an API.
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
      image: fall,
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

  // Render the Home page component structure.
  return (
    // Main container div with minimum height and flex column layout.
    // Background color is handled by Tailwind's dark mode class.
    <div className="min-h-screen flex flex-col dark:bg-black">
      <Navbar />

      {/* Hero Section: Full-width banner with dynamic background pattern */}
      <section className="py-0 w-full bg-white dark:bg-black"> {/* Section background */}
        <div className="relative h-[50vh] w-full overflow-hidden">
          {/* Render different background patterns based on the current theme (dark/light) */}
          {isDarkMode ? <PsychedelicPattern /> : <BlockPattern />}
          {/* Semi-transparent overlay to improve text readability over the background pattern */}
          <div className="absolute inset-0 bg-black bg-opacity-10 dark:bg-opacity-40 z-10"></div>
          {/* Centered content container within the hero section */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="max-w-7xl w-full mx-auto px-4 md:px-8 text-center">
              {/* Main heading */}
              <h1 className="text-purple-700 dark:text-white text-4xl md:text-6xl font-bold mb-4">
                Welcome to Console.Blog( )
              </h1>
              {/* Subheading/tagline */}
              <p className="text-purple-600 dark:text-white text-xl md:text-2xl"> {/* Text color adapts to theme */}
              A place to think, build, break things, and reflect — in code and in life.
              </p>
              {/* Call to action button container */}
              <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
                <SpaceButton text="READ BLOG" to="/entries" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "Why This App?" Section: Explains the project's origin and purpose */}
      <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto text-center"> {/* Centered content */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">Why This App?</h2>
        <div className="h-1 w-20 bg-purple-500 mx-auto mb-8"></div> {/* Accent line */}
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          This application began as a personal project focused on reinforcing and deepening my understanding of the MERN stack (MongoDB, Express.js, React, Node.js). What started as a simple blog platform has gradually evolved, with new features and functionalities being added incrementally over time as I continue to explore and learn. It serves as both a practical learning tool and a space for experimentation. Originally, the vision also included incorporating elements of a personal resume/profile site suitable for sharing with recruiters. However, the focus shifted towards a dedicated blog, though some remnants of the initial profile concept might still be visible on this page.
        </p>
      </section>

      {/* "About Me" Section: Displays the AboutCard component */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto"> {/* Wider content area */}
        <div className="flex justify-center">
          <AboutCard />
        </div>
      </section>

      {/* "Technologies I Work With" Section: Features an auto-scrolling display of tech cards */}
      <section className="py-16 px-4 md:px-8 bg-gray-100 dark:bg-gray-900 dark:bg-opacity-50"> {/* Section-specific background */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">Technologies I Work With</h2>
            <div className="h-1 w-20 bg-purple-500 mx-auto"></div> {/* Accent line */}
            <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm italic">Hover over card for details</p>
          </div>
          
          <div className="relative"> {/* Relative positioning for the fade overlays */}
            {/* Horizontal scrolling container for technology cards */}
            <div
              ref={techScrollRef} // Assign ref for controlling scroll
              className="overflow-x-auto scrollbar-hide pb-12 pt-6" // Enable horizontal scroll, hide scrollbar
              style={{ minHeight: '290px', scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Ensure height and hide scrollbar cross-browser
            >
              {/* Flex container for the cards, ensuring they don't wrap */}
              <div className="flex space-x-12 min-w-max px-8 py-2">
                {/* Map over technology data to render GradientCard components */}
                {[
                  { title: "JavaScript", subtitle: "Language (ES6+)", highlight: "Web Foundation" },
                  { title: "React", subtitle: "Frontend Library", highlight: "Component-Based UI" },
                  { title: "Next.js", subtitle: "React Framework", highlight: "SSR & SSG" },
                  { title: "HTML", subtitle: "Markup Language", highlight: "Web Structure" },
                  { title: "CSS", subtitle: "Styling Language", highlight: "Web Design" },
                  { title: "Tailwind CSS", subtitle: "CSS Framework", highlight: "Utility-First" },
                  { title: "Node.js", subtitle: "Backend Runtime", highlight: "JavaScript Server" },
                  { title: "Express.js", subtitle: "Node.js Framework", highlight: "Web Applications" },
                  { title: "Webpack", subtitle: "Module Bundler", highlight: "Asset Management" },
                  { title: "React Router", subtitle: "Routing Library", highlight: "Client-Side Nav" },
                  { title: "NoSQL", subtitle: "Database Type", highlight: "Flexible Data (e.g., MongoDB)" },
                  { title: "Postman", subtitle: "API Platform", highlight: "API Testing & Dev" },
                  { title: "OAuth", subtitle: "Authorization", highlight: "Secure Delegation" },
                  { title: "NextAuth", subtitle: "Auth for Next.js", highlight: "Easy Authentication" },
                  { title: "Redis", subtitle: "In-Memory Store", highlight: "Caching & Sessions" },
                  { title: "Docker", subtitle: "Containerization", highlight: "App Deployment" },
                  { title: "SQL", subtitle: "Database Language", highlight: "Relational Data" },
                ].map((tech, index) => (
                  <GradientCard
                    key={index}
                    title={tech.title}
                    subtitle={tech.subtitle}
                    highlight={tech.highlight}
                  />
                ))}
              </div>
            </div>
            {/* Left and right fade overlays to visually indicate more content */}
            {/* Gradient matches the section's background color */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-gray-100 dark:from-gray-900 to-transparent w-12 h-full pointer-events-none"></div> {/* Left fade */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-gray-100 dark:from-gray-900 to-transparent w-12 h-full pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* "Featured Projects" Section: Displays project cards */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto"> {/* Wider content area */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">Featured Projects</h2>
          <div className="h-1 w-20 bg-purple-500 mx-auto"></div> {/* Accent line */}
        </div>
        
        {/* Grid-like layout for project cards */}
        <div className="flex flex-wrap justify-center gap-16 mt-10">
          {/* Map over the projects data to render ProjectCard components */}
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

      {/* "Let's Work Together" Call to Action Section */}
      <section className="py-16 px-4 md:px-8 bg-gray-100 dark:bg-gray-900 dark:bg-opacity-50"> {/* Section-specific background */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">Let's Work Together</h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            Interested in collaborating or have questions about my work?
            Feel free to reach out and let's start a conversation.
          </p>
          {/* Link styled as a button to navigate to the Contact page */}
          <Link to="/contactPage" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            Get in Touch
          </Link>
        </div>
      </section>

      {/* LogLocalStorage component removed */}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
