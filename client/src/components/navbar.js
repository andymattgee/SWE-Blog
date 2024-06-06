import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// create button with logout functionality and tie func to onClick
const navbar = () => {
    const navigate = useNavigate();
    const logout = async () => {
        const token = localStorage.getItem('token');
        //this will not be needed once I add protected routes
        if (!token) {
            console.log('no token');
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
          // Clear localStorage and navigate to login page
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          navigate('/');
        } catch (error) {
          console.error('Error logging out:', error);
        }
      }

    return (
    
        <nav className="bg-inherit p-4 ">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/Home" className="text-red-500 text-2xl">Home</Link>
                <Link to="/entries" className="text-red-500 text-2xl">Blog Entries</Link>
                <Link to="/APITestPage" className="text-red-500 text-2xl">API Page</Link>
                <Link to="/ContactPage" className="text-red-500 text-2xl">Contact Me</Link>
                {/* <Link to="/" className="text-red-500 text-2xl">Logout</Link> */}
                <button onClick={logout} className="text-red-500 text-2xl">Logout</button>
            </div>
        </nav>
    )
}

export default navbar