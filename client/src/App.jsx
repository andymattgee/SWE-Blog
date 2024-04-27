import React from 'react';
import {Link,Route,Routes,Navigate,useNavigate} from 'react-router-dom';
import "../public/styles/styles.css";

import Login from './pages/Login.jsx';
import Home from "./pages/Home.jsx";
import Test1 from "./pages/Test1.jsx";
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
{/* <button onClick={handleHomeClick}>Go Home</button>
<button onClick={newEntry}>Make New Entry Here</button> */}
    <Routes>
    <Route path ="/" element={<Login/>}/>
        <Route path ="/Home" element={<Home/>}/>
        <Route path ="/test1" element={<Test1/>}/>
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