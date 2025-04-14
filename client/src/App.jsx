//this page is main entry point for the application.

//Import necessary dependencies and components
import React from 'react';
import {Link,Route,Routes,Navigate,useNavigate} from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../public/styles/styles.css";


//importing all the 'pages' (components) from other .JSX files 
import Login from './pages/Login.jsx';
import Home from "./pages/Home.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import Chat from "./pages/Chat.jsx";
import Entries from "./pages/Entries.jsx"
import Signup from './pages/Signup.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
// import Todos from './pages/Todos.jsx';
import UserProfile from './components/UserProfile.jsx';


/**
 * Main application component that defines the routing structure.
 * It uses React Router DOM for navigation and route guarding.
 */
const App = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate
  const token = localStorage.getItem('token'); // Retrieve authentication token from local storage

  return (
    <UserProvider>
      <div>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
        {token ? (
          // Routes accessible when the user is authenticated
          <>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<PrivateRoute element={<Home />} />} />
            <Route path="/contactpage" element={<PrivateRoute element={<ContactPage />} />} />
            <Route path="/chat" element={<PrivateRoute element={<Chat />} />} />
            <Route path="/entries" element={<PrivateRoute element={<Entries />} />} />
            {/* <Route path="/todos" element={<PrivateRoute element={<Todos />} />} /> */}
            <Route path="/profile" element={<PrivateRoute element={<UserProfile />} />} />
            
          </>
        ) : (
          // Routes accessible when the user is not authenticated
          <>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </>
        )}
        </Routes>
      </div>
    </UserProvider>
  );
};

export default App