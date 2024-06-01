import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const navbar = () => {
    return (
        // <div >
        //     <ul className='flex justify-around'>
        //         <li><a href='/Home'>Home</a></li>
        //         <li><a href='/Entries' className='border border-2'>Go To Blog Entries</a></li>
        //         <li>Logout</li>
        //     </ul>
        // </div>
        <nav className="bg-inherit p-4 ">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/Home" className="text-red-500 text-2xl">Home</Link>
                <Link to="/entries" className="text-red-500 text-2xl">Blog Entries</Link>
                <Link to="/APITestPage" className="text-red-500 text-2xl">API Page</Link>
                <Link to="/test1" className="text-red-500 text-2xl">Contact Me</Link>
                <Link to="/" className="text-red-500 text-2xl">Logout</Link>
            </div>
        </nav>
    )
}

export default navbar