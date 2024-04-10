import React from 'react';
import {Link,Route,Routes,Navigate,useNavigate} from 'react-router-dom';

import Home from "./pages/Home.jsx";
import Test1 from "./pages/Test1.jsx";


const App = () => {
    
  return (
    <div>
        <h3>
          This text will appear on every page due to front end routing
        </h3>
        
    <Routes>
        <Route path ="/" element={<Home/>}/>
        <Route path ="/test1" element={<Test1/>}/>
    </Routes>
   
    </div>
  )
}

export default App