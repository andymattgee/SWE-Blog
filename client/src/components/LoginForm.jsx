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
          {/* Add onClick handlers for social icons */}
          <svg onClick={() => handleSocialIconClick('facebook')} xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 24 24" fill="#4b5563" style={{ cursor: 'pointer' }}> {/* Changed fill */}
            <path d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm4 7.278V4.5h-2.286c-2.1 0-3.428 1.6-3.428 3.889v1.667H8v2.777h2.286V19.5h2.857v-6.667h2.286L16 10.056h-2.857V8.944c0-1.11.572-1.666 1.714-1.666H16z" /></svg>
          <svg onClick={() => handleSocialIconClick('instagram')} xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 24 24" fill="#4b5563" style={{ cursor: 'pointer' }}> {/* Changed fill */}
            <path d="M12 0c6.6274 0 12 5.3726 12 12s-5.3726 12-12 12S0 18.6274 0 12 5.3726 0 12 0zm3.115 4.5h-6.23c-2.5536 0-4.281 1.6524-4.3805 4.1552L4.5 8.8851v6.1996c0 1.3004.4234 2.4193 1.2702 3.2359.7582.73 1.751 1.1212 2.8818 1.1734l.2633.006h6.1694c1.3004 0 2.389-.4234 3.1754-1.1794.762-.734 1.1817-1.7576 1.2343-2.948l.0056-.2577V8.8851c0-1.2702-.4234-2.3589-1.2097-3.1452-.7338-.762-1.7575-1.1817-2.9234-1.2343l-.252-.0056zM8.9152 5.8911h6.2299c.9072 0 1.6633.2722 2.2076.8166.4713.499.7647 1.1758.8103 1.9607l.0063.2167v6.2298c0 .9375-.3327 1.6936-.877 2.2077-.499.4713-1.176.7392-1.984.7806l-.2237.0057H8.9153c-.9072 0-1.6633-.2722-2.2076-.7863-.499-.499-.7693-1.1759-.8109-2.0073l-.0057-.2306V8.885c0-.9073.2722-1.6633.8166-2.2077.4712-.4713 1.1712-.7392 1.9834-.7806l.2242-.0057h6.2299-6.2299zM12 8.0988c-2.117 0-3.871 1.7238-3.871 3.871A3.8591 3.8591 0 0 0 12 15.8408c2.1472 0 3.871-1.7541 3.871-3.871 0-2.117-1.754-3.871-3.871-3.871zm0 1.3911c1.3609 0 2.4798 1.119 2.4798 2.4799 0 1.3608-1.119 2.4798-2.4798 2.4798-1.3609 0-2.4798-1.119-2.4798-2.4798 0-1.361 1.119-2.4799 2.4798-2.4799zm4.0222-2.3589a.877.877 0 1 0 0 1.754.877.877 0 0 0 0-1.754z" /></svg>
          <svg onClick={() => handleSocialIconClick('linkedin')} xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 24 24" fill="#4b5563" style={{ cursor: 'pointer' }}> {/* Changed fill */}
            <path d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zM8.951 9.404H6.165V17.5H8.95V9.404zm6.841-.192c-1.324 0-1.993.629-2.385 1.156l-.127.181V9.403h-2.786l.01.484c.006.636.007 1.748.005 2.93l-.015 4.683h2.786v-4.522c0-.242.018-.484.092-.657.202-.483.66-.984 1.43-.984.955 0 1.367.666 1.408 1.662l.003.168V17.5H19v-4.643c0-2.487-1.375-3.645-3.208-3.645zM7.576 5.5C6.623 5.5 6 6.105 6 6.899c0 .73.536 1.325 1.378 1.392l.18.006c.971 0 1.577-.621 1.577-1.398C9.116 6.105 8.53 5.5 7.576 5.5z" />
          </svg>
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
    color: #4b5563; /* Changed link color */
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