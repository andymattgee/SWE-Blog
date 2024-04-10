import React from 'react'
import {Link,Route,Routes,Navigate,useNavigate} from 'react-router-dom';
// import Test1 from "./pages/Test1.jsx";

const Home = () => {

  const navigate = useNavigate();
    
    const handleClick = () =>{
        navigate('/test1');
    }

  return (
    <div style={{color:'red'}}>
        <h2>
            this is from home comp
        </h2>
        <button onClick={handleClick}>Button to Test1</button>
    </div>
    
  )
}

export default Home