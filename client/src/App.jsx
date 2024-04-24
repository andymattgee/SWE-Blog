import React from 'react';
import {Link,Route,Routes,Navigate,useNavigate} from 'react-router-dom';
// import "../public/styles/styles.css";

import Home from "./pages/Home.jsx";
import Test1 from "./pages/Test1.jsx";
import Test2 from "./pages/Test2.jsx";
import APITestPage from "./pages/APITestPage.jsx";
import Entries from "./pages/Entries.jsx";
import NewEntry from './pages/NewEntry.jsx';

const App = () => {
    const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };
  const newEntry = () => {
    navigate("/NewEntry")
  }

  return (
    <div>
<button onClick={handleHomeClick}>Go Home</button>
<button onClick={newEntry}>Make New Entry Here</button>
    <Routes>
        <Route path ="/" element={<Home/>}/>
        <Route path ="/test1" element={<Test1/>}/>
        <Route path ="/test2" element={<Test2/>}/>
        <Route path ="/APITestPage" element={<APITestPage/>}/>
        <Route path ="/Entries" element={<Entries/>}/>
        <Route path ="/NewEntry" element={<NewEntry/>}/>
    </Routes>
   
    </div>
  )
}

export default App