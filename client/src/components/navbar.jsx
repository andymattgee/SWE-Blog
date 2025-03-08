import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import axios from 'axios';

// Navbar component for the application
const Navbar = () => {
    // State to manage the open/closed state of the mobile menu
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate(); // Hook to programmatically navigate

    /**
     * Handles user logout by sending a request to the server and clearing local storage.
     */
    const logout = async () => {
        const token = localStorage.getItem('token'); // Retrieve the authentication token
        if (!token) {
            console.log('no token, returning to login/sign up page');
            navigate('/'); // Navigate to the home page if no token is found
            return;
        }
    
        try {
            console.log('user with token, start log out process...');
            // Send a POST request to log out the user
            await axios.post('http://localhost:3333/api/users/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the request headers
                }
            });
            localStorage.clear(); // Clear local storage
            navigate('/'); // Navigate to the home page after logout
        } catch (error) {
            console.error('Error logging out:', error); // Log any errors that occur during logout
        }
    }

    /**
     * Toggles the mobile menu open/closed state.
     */
    const toggleMenu = () => {
        setIsOpen(!isOpen); // Toggle the state of the mobile menu
    }

    /**
     * Closes the mobile menu.
     */
    const closeMenu = () => {
        setIsOpen(false); // Set the mobile menu state to closed
    }

    return (
        <>
            <nav className="sticky top-0 left-0 w-full bg-white bg-opacity-90 shadow-md z-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo/Title */}
                        <Link to="/Home" className="text-2xl md:text-3xl font-bold text-blue-700">
                            Matt's Tech Journey
                        </Link>

                        <div className="flex items-center gap-4">
                            {/* User Profile Icon */}
                            <Link to="/profile" className="text-blue-700 hover:text-blue-800">
                                <FaUser size={24} />
                            </Link>

                            {/* Hamburger Button for mobile menu */}
                            <button
                                onClick={toggleMenu}
                                className="text-blue-700 hover:text-blue-800 focus:outline-none"
                            >
                                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`${isOpen ? 'block' : 'hidden'} bg-white bg-opacity-95 shadow-lg absolute right-0 w-1/6`}>
                    <div className="container mx-auto px-4 py-2">
                        <div className="flex flex-col items-center space-y-4 pb-4"> {/* Center items in the column */}
                            {/* Navigation Links */}
                            <Link 
                                to="/Home" 
                                className="text-blue-700 hover:text-blue-900 text-lg font-medium"
                                onClick={closeMenu} // Close menu on link click
                            >
                                Home
                            </Link>
                            <Link 
                                to="/entries" 
                                className="text-blue-700 hover:text-blue-900 text-lg font-medium"
                                onClick={closeMenu} // Close menu on link click
                            >
                                Blog 
                            </Link>
                            <Link 
                                to="/Todos" 
                                className="text-blue-700 hover:text-blue-900 text-lg font-medium"
                                onClick={closeMenu} // Close menu on link click
                            >
                                Tasks
                            </Link>
                            <Link 
                                to="/APITestPage" 
                                className="text-blue-700 hover:text-blue-900 text-lg font-medium"
                                onClick={closeMenu} // Close menu on link click
                            >
                                API Page
                            </Link>
                            <Link 
                                to="/ContactPage" 
                                className="text-blue-700 hover:text-blue-900 text-lg font-medium"
                                onClick={closeMenu} // Close menu on link click
                            >
                                Contact Me
                            </Link>
                            <button 
                                onClick={() => {
                                    logout(); // Call logout function
                                    closeMenu(); // Close menu after logout
                                }} 
                                className="text-blue-700 hover:text-blue-900 text-lg font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            {/* Spacer div to prevent content overlap */}
            <div className="h-16"></div>
        </>
    );
}

export default Navbar;