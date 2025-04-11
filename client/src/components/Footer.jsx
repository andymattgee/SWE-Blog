import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer component that can be reused across all pages of the application.
 * Includes navigation links, social media icons, and copyright information.
 * 
 * @returns {JSX.Element} The Footer component
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    // Footer: Light gray bg, dark text in light mode; original dark in dark mode
    <footer className="bg-gray-100 text-gray-800 border-t border-gray-200 dark:bg-gray-900 dark:text-white dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation Links */}
          <div>
            {/* Headings: Darker purple in light mode */}
            <h3 className="text-lg font-semibold mb-4 text-purple-600 dark:text-purple-400">Navigation</h3>
            <ul className="space-y-2">
              {/* Links: Inherit text color, darker purple hover in light mode */}
              <li><Link to="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Home</Link></li>
              <li><Link to="/entries" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Blog</Link></li>
              <li><Link to="/contactPage" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          {/* Social Media Links */}
          <div>
            {/* Headings: Darker purple in light mode */}
            <h3 className="text-lg font-semibold mb-4 text-purple-600 dark:text-purple-400">Connect</h3>
            <div className="flex space-x-4">
              {/* Social Links: Inherit text color, darker purple hover in light mode */}
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                <i className="fab fa-github text-xl"></i>
                <span className="ml-2">GitHub</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                <i className="fab fa-linkedin text-xl"></i>
                <span className="ml-2">LinkedIn</span>
              </a>
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            {/* Headings: Darker purple in light mode */}
            <h3 className="text-lg font-semibold mb-4 text-purple-600 dark:text-purple-400">Contact</h3>
            {/* Contact Text: Inherits color from footer */}
            <p className="mb-2">Email: example@email.com</p>
            <p>Location: Portland, OR</p>
          </div>
        </div>
        
        {/* Copyright */}
        {/* Copyright: Lighter border, medium gray text in light mode */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {currentYear} Tech Blog. All rights reserved.</p>
          <p className="mt-2">Built with React, Express, and MongoDB</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
