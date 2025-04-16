import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const LoginForm = ({ onLogin, onForgotPassword, onNavigateToSignup, onSocialClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleLoginSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    onLogin(email, password);
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault(); // Prevent default link behavior if needed
    onForgotPassword();
  };

  const handleSignupClick = (e) => {
    e.preventDefault(); // Prevent default link behavior
    onNavigateToSignup();
  };

  const handleSocialIconClick = (platform) => {
    onSocialClick(platform);
  };


  return (
    <StyledWrapper>
      {/* Use onSubmit on the form element */}
      <form className="form" onSubmit={handleLoginSubmit}>
        <div id="login-area">
          <p>LOGIN</p>
          <p id="behind">Log in to your account</p>
        </div>
        <div id="email-area">
          <input
            placeholder="EMAIL"
            id="email"
            className="input"
            type="email" // Change type to email
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Add onChange
            required // Add required attribute
          />
        </div>
        <div id="password-area">
          <input
            placeholder="PASSWORD"
            id="password"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Add onChange
            required // Add required attribute
          />
          {/* Use onClick for the link */}
          <a href="#" onClick={handleForgotPasswordClick}>Forgot password?</a>
        </div>
        <div id="footer-area">
          {/* Button type should be submit */}
          <button type="submit">Log In</button>
          <div id="text-inside">
            <p>Don't have an account?</p>
            {/* Use onClick for the link */}
            <a id="link" href="#" onClick={handleSignupClick}>Sign Up</a>
          </div>
        </div>
        <div id="background-color" />
        <div id="whitefilter" />
        <div id="link-circle">
          
        </div>
      </form>
    </StyledWrapper>
  );
}

// Paste the StyledWrapper definition here
const StyledWrapper = styled.div`
  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* background-color: white; */ /* Ensure solid white background is removed */
    /* background-color: rgba(255, 255, 255, 0.1); */ /* Ensure subtle transparent white is also removed */
    width: 15.5em;
    height: 22.5em;
    border: 2px solid #1f2937; /* Changed border color */
    border-bottom-left-radius: 1.5em;
    border-top-right-radius: 1.5em;
    box-shadow:
      -10px 0px 0px #1f2937, /* Changed shadow color */
      -10px 5px 5px rgb(0, 0, 0, 0.2);
    overflow: hidden;
    position: relative;
    transition: all 0.25s ease;
  }

  #login-area,
  #email-area,
  #password-area,
  #footer-area {
    position: relative;
    z-index: 2;
  }

  #login-area {
    width: 100%;
    height: 3.5em;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }

  #login-area p {
    top: 0.35em;
    font-size: 1.5em;
    font-weight: bold;
    position: absolute;
    z-index: 2;
  }

  #login-area #behind {
    top: 60%;
    font-size: 1em;
    font-weight: bold;
    position: absolute;
    z-index: 1;
  }

  #behind {
    position: absolute;
    left: 1em;
    color: #4b5563; /* Changed text color */
  }

  #email-area {
    width: 100%;
    padding-left: 10%;
    padding-right: 10%;
    height: 5em;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 1em;
    transition: all 0.25s ease;
  }

  #email-area input {
    width: 100%;
    border: 2px solid #4b5563; /* Changed border color */
    border-radius: 0.5em;
    height: 2.5em;
    padding-left: 1em;
    font-size: 0.95em;
    font-weight: 100;
    transition: all 0.5s ease;
    outline: none;
    box-shadow: 0px 5px 5px -3px rgb(0, 0, 0, 0.2);
  }

  #password-area {
    width: 100%;
    padding-left: 10%;
    padding-right: 10%;
    height: 6em;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex-direction: column;
    transition: all 0.25s ease;
  }

  #password-area input {
    width: 100%;
    border: 2px solid #4b5563; /* Changed border color */
    font-size: 0.95em;
    border-radius: 0.5em;
    height: 2.5em;
    padding-left: 1em;
    transition: all 0.25s ease;
    outline: none;
    box-shadow: 0px 5px 5px -3px rgb(0, 0, 0, 0.2);
  }

  #password-area a {
    padding-top: 0.5em;
    font-size: 0.8em;
    font-weight: bold;
    transition: all 0.25s ease;
    color: purple; /* Changed link color to purple */
    cursor: pointer; /* Add cursor pointer */
  }

  #footer-area {
    margin-top: 0%;
    padding-top: 0%;
    width: 100%;
    padding-left: 10%;
    padding-right: 10%;
    height: 7em;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #4b5563; /* Changed text color */
    transition: all 0.25s ease;
  }

  #footer-area button {
    width: 100%;
    border: 2px solid #3b82f6; /* Changed border to blue */
    border-radius: 0.5em;
    height: 2.5em;
    padding-left: 1em;
    font-size: 0.95em;
    font-weight: 100;
    transition: all 0.25s ease;
    color: white;
    font-weight: bold;
    background-color: #3b82f6; /* Changed background to blue */
    box-shadow: 0px 5px 5px -3px rgb(0, 0, 0, 0.2);
    cursor: pointer; /* Add cursor pointer */
  }

  #footer-area p,
  #footer-area a {
    font-size: 0.8em;
    transition: all 0.25s ease;
  }

  #text-inside {
    padding-top: 0.5em;
    display: flex;
  }

  #link {
    padding-left: 0.1em;
    font-weight: bold;
    color: purple; /* Changed link color to purple */
    cursor: pointer; /* Add cursor pointer */
  }

  #background-color {
    width: 100%;
    height: 3.5em;
    background-color: #4b5563; /* Changed background color */
    position: absolute;
    top: 0em;
    z-index: 1;
    transition: all 0.5s ease;
    box-shadow: inset 5px 0px #1f2937; /* Changed shadow color */
  }

  #link-circle {
    width: 100%;
    height: 4.5em;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding-left: 15%;
    padding-right: 15%;
  }

  #link-circle svg {
    transition: all 0.25s ease;
  }

  #whitefilter {
    width: 3.5em;
    height: 3.5em;
    top: 2.5px;
    right: 2.5px;
    position: absolute;
    z-index: 2;
    border-top-right-radius: 1.25em;
    box-shadow: 35px -35px 0px -1px white;
  }

  ::placeholder {
    color: #4b5563; /* Changed placeholder color */
    font-weight: bold;
  }

  .form:hover {
    width: 16em;
    height: 23em;
  }

  #email-area:hover ~ #background-color {
    height: 4.2em;
    transform: translateY(4em);
  }

  #email-area:hover,
  #password-area:hover,
  #footer-area:hover {
    padding-left: 5%;
    padding-right: 5%;
  }

  #email-area:hover p {
    color: white;
  }

  #email-area:hover input {
    color: white;
    border: 2px solid white;
    background-color: #4b5563; /* Changed background color */
    height: 3em;
  }

  #email-area:hover ::placeholder {
    color: white;
  }

  #password-area:hover ~ #background-color {
    height: 5.5em;
    transform: translateY(7.8em);
  }

  #footer-area:hover ~ #background-color {
    height: 5.9em;
    transform: translateY(13.2em);
  }

  #password-area:hover p {
    color: white;
  }

  #password-area:hover a {
    color: white;
    padding-right: 5%;
  }

  #password-area:hover input {
    color: white;
    border: 2px solid white;
    background-color: #4b5563; /* Changed background color */
    height: 3em;
  }

  #password-area:hover ::placeholder {
    color: white;
  }

  #footer-area:hover p,
  #footer-area:hover a {
    color: white;
  }

  #footer-area:hover button {
    border: 2px solid white;
    background-color: #3b82f6; /* Changed background to blue */
    height: 3em;
  }

  #footer-area button:active {
    color: #3b82f6; /* Changed text color to blue */
    background-color: white;
    width: 90%;
  }

  #link-circle svg:hover {
    transform: scale(1.25);
    margin: 0.5em;
  }
`;

export default LoginForm;