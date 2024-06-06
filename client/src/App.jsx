import React from 'react';
import {Link,Route,Routes,Navigate,useNavigate} from 'react-router-dom';
import "../public/styles/styles.css";

import Login from './pages/Login.jsx';
import Home from "./pages/Home.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import Test2 from "./pages/Test2.jsx";
import APITestPage from "./pages/APITestPage.jsx";
import Entries from "./pages/Entries.jsx";
import NewEntry from './pages/NewEntry.jsx';
import Signup from './pages/Signup.jsx';
import SingleEntry from './pages/SingleEntry.jsx';

const App = () => {
    const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/Home');
  };
  const newEntry = () => {
    navigate("/NewEntry")
  }

  return (
    <div>
{/* <button 
className="text-white bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-5 mt-5 w-2/5 self-center"
onClick={handleHomeClick}>Go Home</button> */}

    <Routes>
    <Route path ="/" element={<Login/>}/>
        <Route path ="/Home" element={<Home/>}/>
        <Route path ="/ContactPage" element={<ContactPage/>}/>
        <Route path ="/test2" element={<Test2/>}/>
        <Route path ="/APITestPage" element={<APITestPage/>}/>
        <Route path ="/Entries" element={<Entries/>}/>
        <Route path ="/NewEntry" element={<NewEntry/>}/>
        <Route path ="/Signup" element={<Signup/>}/>
        <Route path ="/SingleEntry/:id" element={<SingleEntry/>}/>
    </Routes>
   
    </div>
  )
}

export default App