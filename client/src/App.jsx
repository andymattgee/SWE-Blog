import React from 'react';
import {Link,Route,Routes,Navigate,useNavigate} from 'react-router-dom';

import Home from "./pages/Home.jsx";
import Test1 from "./pages/Test1.jsx";
import Test2 from "./pages/Test2.jsx";
import APITestPage from "./pages/APITestPage.jsx";
import Entries from "./pages/Entries.jsx";

const App = () => {
    const navigate = useNavigate();
  const handleHomeClick = () => {
    navigate('/');
  }

  return (
    <div>
<button onClick={handleHomeClick}>Go Home</button>
    <Routes>
        <Route path ="/" element={<Home/>}/>
        <Route path ="/test1" element={<Test1/>}/>
        <Route path ="/test2" element={<Test2/>}/>
        <Route path ="/APITestPage" element={<APITestPage/>}/>
        <Route path ="/Entries" element={<Entries/>}/>
    </Routes>
   
    </div>
  )
}

export default App