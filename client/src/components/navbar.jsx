import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import axios from 'axios';

// Navbar component for the application
const Navbar = () => {
    // State to manage the open/closed state of the mobile menu
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate(); // Hook to programmatically navigate
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
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
            <nav className="sticky top-0 left-0 w-full bg-black bg-opacity-100  shadow-md z-50">
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
                <div 
                    ref={menuRef}
                    className={`${isOpen ? 'block' : 'hidden'} bg-white bg-opacity-95 shadow-lg absolute right-0 w-1/6 rounded-lg border-2 border-gray-700`}
                >
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
                                to="/news" 
                                className="text-blue-700 hover:text-blue-900 text-lg font-medium"
                                onClick={closeMenu} // Close menu on link click
                            >
                                News
                            </Link>
                            
                            <Link 
                                to="/chat" 
                                className="text-blue-700 hover:text-blue-900 text-lg font-medium"
                                onClick={closeMenu} // Close menu on link click
                            >
                                Chat
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
            {/* Remove spacer div since it's creating extra space */}
        </>
    );
}

export default Navbar;