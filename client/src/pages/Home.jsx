import React from 'react'
import {Link,Route,Routes,Navigate,useNavigate} from 'react-router-dom';


const Home = () => {

  const navigate = useNavigate();
    
    const handleClick = () =>{
        navigate('/test1');
    }
    const handleClick2 = () =>{
        navigate('/test2');
    }
    const handleAPIClick = () =>{
        navigate('/APITestPage');
    }

  return (
    <div style={{color:'red'}}>
        <h2>
            Currently in home component
        </h2>
        <button onClick={handleClick}>Button to Test1</button>
        <br></br>
        <button onClick={handleClick2}>Button to Test2</button>
        <br></br>
        <button onClick={handleAPIClick}>Button to API test Page </button>
    </div>
    
  )
}

export default Home