import React from 'react'
import {Link,Route,Routes,Navigate,useNavigate} from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const handleEnterButton = () => {
navigate("/Home")
    }

  return (
    <div>Login Page
        <button onClick={handleEnterButton} >Enter Button</button>
    </div>
  )
}

export default Login