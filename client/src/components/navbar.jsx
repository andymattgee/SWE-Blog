import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Removed FaUser as it's replaced
import { useUser } from '../context/UserContext'; // Import useUser hook
import axios from 'axios';
import ThemeSwitch from './ThemeSwitch';
import logoSrc from '../../public/images/console-blog-logo.png'; // Import the logo

// Navbar component for the application
const Navbar = () => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // State for user dropdown
    const navigate = useNavigate(); // Hook to programmatically navigate
    const userMenuRef = useRef(null); // Ref for user dropdown
    const { userData } = useUser(); // Get user data from context

    // Close user dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    /**
     * Handles user logout by sending a request to the server and clearing local storage.
     */
    const logout = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }
    
        try {
            await axios.post('http://localhost:3333/api/users/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            window.location.href = '/';
        } catch (error) {
            console.error('Error logging out:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            window.location.href = '/';
        }
    }

    // Toggle user dropdown
    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    // Close user dropdown (e.g., after clicking a link)
    const closeUserMenu = () => {
        setIsUserMenuOpen(false);
    };

    return (
        <>
            <nav className="sticky top-0 left-0 w-full bg-white dark:bg-black dark:bg-opacity-100 shadow-md z-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo/Title */}
                        <Link to="/Home" className="flex items-center"> {/* Use flex to align image */}
                            <img
                                src={logoSrc} // Use the imported variable
                                alt="Console Blog Logo"
                                className="h-10 w-auto" // Adjust height as needed, width auto maintains aspect ratio
                            />
                        </Link>

                        {/* Horizontal Navigation Links */}
                        <div className="hidden md:flex items-center space-x-6">
                            <NavLink to="/Home" className={({ isActive }) => isActive ? "text-blue-600 dark:text-blue-500 font-semibold" : "text-blue-800 hover:text-blue-600 dark:text-blue-700 dark:hover:text-blue-500"}>Home</NavLink>
                            <NavLink to="/entries" className={({ isActive }) => isActive ? "text-blue-600 dark:text-blue-500 font-semibold" : "text-blue-800 hover:text-blue-600 dark:text-blue-700 dark:hover:text-blue-500"}>Blog</NavLink>
                            <NavLink to="/chat" className={({ isActive }) => isActive ? "text-blue-600 dark:text-blue-500 font-semibold" : "text-blue-800 hover:text-blue-600 dark:text-blue-700 dark:hover:text-blue-500"}>AI Chat</NavLink>
                            <NavLink to="/ContactPage" className={({ isActive }) => isActive ? "text-blue-600 dark:text-blue-500 font-semibold" : "text-blue-800 hover:text-blue-600 dark:text-blue-700 dark:hover:text-blue-500"}>Contact Me</NavLink>
                        </div>

                        {/* Wrapper for Theme Switch and User Icon */}
                        <div className="flex items-center space-x-4">
                            <ThemeSwitch />

                            {/* User Icon and Dropdown */}
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={toggleUserMenu}
                                    className="text-blue-800 hover:text-blue-600 dark:text-blue-700 dark:hover:text-blue-500 focus:outline-none"
                                >
                                    {/* Circular div for profile picture or placeholder */}
                                    {/* Increased size to match ThemeSwitch (approx. 44px) */}
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border border-gray-300 dark:border-grey-600">
                                        {userData && userData.image ? (
                                            // Display user's profile picture if available
                                            <img
                                                src={userData.image}
                                                alt="User profile"
                                                className="w-full h-full object-cover" // Ensure image covers the circle
                                            />
                                        ) : (
                                            // Fallback placeholder (e.g., gray circle or initials)
                                            <div className="w-full h-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center">
                                                {/* Optional: You could add initials here if needed */}
                                                {/* <span className="text-xs text-white">?</span> */}
                                            </div>
                                        )}
                                    </div>
                                </button>

                                {/* User Dropdown Menu */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white bg-opacity-95 dark:bg-gray-800 dark:bg-opacity-95 rounded-md shadow-lg py-1 border border-gray-300 dark:border-gray-600">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-blue-800 hover:bg-blue-100 hover:text-blue-600 dark:text-blue-300 dark:hover:bg-gray-700 dark:hover:text-blue-100"
                                            onClick={closeUserMenu}
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                closeUserMenu();
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-blue-800 hover:bg-blue-100 hover:text-blue-600 dark:text-blue-300 dark:hover:bg-gray-700 dark:hover:text-blue-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu (Optional - can be added back if needed for smaller screens) */}
                {/* <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}> ... mobile links ... </div> */}

            </nav>
            {/* Removed the old mobile menu structure */}
            {/* Remove spacer div since it's creating extra space */}
        </>
    );
}

export default Navbar;