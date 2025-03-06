import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const logout = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('no token, returning to login/sign up page');
            navigate('/');
            return;
        };
    
        try {
            console.log('user with token, start log out process...')
            await axios.post('http://localhost:3333/api/users/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            localStorage.clear();
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    const closeMenu = () => {
        setIsOpen(false);
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

                        {/* Hamburger Button */}
                        <button
                            onClick={toggleMenu}
                            className="text-blue-700 hover:text-blue-800 focus:outline-none"
                        >
                            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`${isOpen ? 'block' : 'hidden'} bg-white bg-opacity-95 shadow-lg absolute right-0 w-1/5`}>
                    <div className="container mx-auto px-4 py-2">
                        <div className="flex flex-col space-y-4 pb-4">
                            <Link 
                                to="/Home" 
                                className="text-blue-700 hover:text-blue-900 text-lg font-medium text-right"
                                onClick={closeMenu}
                            >
                                Home
                            </Link>
                            <Link 
                                to="/entries" 
                                className="text-blue-700 hover:text-blue-900 text-lg font-medium text-right"
                                onClick={closeMenu}
                            >
                                Blog Entries
                            </Link>
                            <Link 
                                to="/ContactPage" 
                                className="text-blue-700 hover:text-blue-900 text-lg font-medium text-right"
                                onClick={closeMenu}
                            >
                                Contact Me
                            </Link>
                            <Link 
                                to="/APITestPage" 
                                className="text-blue-700 hover:text-blue-900 text-lg font-medium text-right"
                                onClick={closeMenu}
                            >
                                API Page
                            </Link>
                            <Link 
                                to="/Todos" 
                                className="text-blue-700 hover:text-blue-900 text-lg font-medium text-right"
                                onClick={closeMenu}
                            >
                                ToDo List
                            </Link>
                            <button 
                                onClick={() => {
                                    logout();
                                    closeMenu();
                                }} 
                                className="text-blue-700 hover:text-blue-900 text-lg font-medium text-right"
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