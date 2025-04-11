import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import axios from 'axios';

// Navbar component for the application
const Navbar = () => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // State for user dropdown
    const navigate = useNavigate(); // Hook to programmatically navigate
    const userMenuRef = useRef(null); // Ref for user dropdown

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
            <nav className="sticky top-0 left-0 w-full bg-black bg-opacity-100  shadow-md z-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo/Title */}
                        <Link to="/Home" className="text-blue-500 text-2xl md:text-3xl font-bold ">
                            Tech Talk
                        </Link>

                        {/* Horizontal Navigation Links */}
                        <div className="hidden md:flex items-center space-x-6">
                            <NavLink to="/Home" className={({ isActive }) => isActive ? "text-blue-500 font-semibold" : "text-blue-700 hover:text-blue-900"}>Home</NavLink>
                            <NavLink to="/entries" className={({ isActive }) => isActive ? "text-blue-500 font-semibold" : "text-blue-700 hover:text-blue-900"}>Blog</NavLink>
                            <NavLink to="/news" className={({ isActive }) => isActive ? "text-blue-500 font-semibold" : "text-blue-700 hover:text-blue-900"}>News</NavLink>
                            <NavLink to="/chat" className={({ isActive }) => isActive ? "text-blue-500 font-semibold" : "text-blue-700 hover:text-blue-900"}>Chat</NavLink>
                            <NavLink to="/ContactPage" className={({ isActive }) => isActive ? "text-blue-500 font-semibold" : "text-blue-700 hover:text-blue-900"}>Contact Me</NavLink>
                        </div>

                        {/* User Icon and Dropdown */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={toggleUserMenu}
                                className="text-blue-700 hover:text-blue-800 focus:outline-none"
                            >
                                <FaUser size={24} />
                            </button>

                            {/* User Dropdown Menu */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white bg-opacity-95 rounded-md shadow-lg py-1 border border-gray-300">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-blue-700 hover:bg-blue-100 hover:text-blue-900"
                                        onClick={closeUserMenu}
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            closeUserMenu();
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-100 hover:text-blue-900"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
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