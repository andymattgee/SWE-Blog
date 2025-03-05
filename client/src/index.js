// Import the necessary dependencies
import React from 'react';
import App from './App.jsx';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';

// Create a root element for the React application
const root = createRoot(document.getElementById('root'));

// Render the App component within the BrowserRouter
// This sets up the routing for the application
root.render(
    <BrowserRouter>
        {/* Render the App component */}
        <App/>
    </BrowserRouter>
);