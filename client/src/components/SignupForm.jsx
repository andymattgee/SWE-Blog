import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Renamed component to SignupForm
const SignupForm = ({ onSubmit, onNavigateToLogin }) => {
  // State for relevant fields (email, password, confirmPassword)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // State for first/last name (currently unused for submission)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (password !== confirmPassword) {
      alert("Passwords don't match!"); // Basic validation
      return;
    }
    // Submit only email and password as requested
    // Pass all required fields to the onSubmit handler
    onSubmit(firstName, lastName, email, password);
  };

  const handleSigninClick = (e) => {
    e.preventDefault(); // Prevent default link behavior
    onNavigateToLogin();
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Register </p>
        <p className="message">Signup now and get full access to our app. </p>
        <div className="flex">
          <label>
            {/* First name input (value controlled, but not submitted) */}
            <input
              className="input"
              type="text"
              placeholder=" " /* Use space for floating label */
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <span>Firstname</span>
          </label>
          <label>
            {/* Last name input (value controlled, but not submitted) */}
            <input
              className="input"
              type="text"
              placeholder=" " /* Use space for floating label */
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <span>Lastname</span>
          </label>
        </div>
        <label>
          {/* Email input */}
          <input
            className="input"
            type="email"
            placeholder=" " /* Use space for floating label */
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span>Email</span>
        </label>
        <label>
          {/* Password input */}
          <input
            className="input"
            type="password"
            placeholder=" " /* Use space for floating label */
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span>Password</span>
        </label>
        <label>
          {/* Confirm password input */}
          <input
            className="input"
            type="password"
            placeholder=" " /* Use space for floating label */
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span>Confirm password</span>
        </label>
        <button type="submit" className="submit">Submit</button>
        <p className="signin">Already have an acount ? <a href="#" onClick={handleSigninClick}>Signin</a> </p>
        {/* The div containing icons is removed below */}
      </form>
      {/* Removed the #link-circle div and its contents */}
    </StyledWrapper>
  );
}

// Paste the StyledWrapper definition here
const StyledWrapper = styled.div`
  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 350px;
    /* background-color: #fff; */ /* Remove background for transparency */
    padding: 20px;
    border-radius: 20px;
    position: relative;
    /* CSS for #link-circle and children removed */
  }

  .title {
    font-size: 28px;
    color: royalblue;
    font-weight: 600;
    letter-spacing: -1px;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 30px;
  }

  .title::before,.title::after {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    border-radius: 50%;
    left: 0px;
    background-color: royalblue;
  }

  .title::before {
    width: 18px;
    height: 18px;
    background-color: royalblue;
  }

  .title::after {
    width: 18px;
    height: 18px;
    animation: pulse 1s linear infinite;
  }

  .message, .signin {
    color: rgba(88, 87, 87, 0.822);
    font-size: 14px;
  }

  .signin {
    text-align: center;
  }

  .signin a {
    color: royalblue;
    cursor: pointer; /* Add cursor */
  }

  .signin a:hover {
    text-decoration: underline royalblue;
  }

  .flex {
    display: flex;
    width: 100%;
    gap: 6px;
  }

  .form label {
    position: relative;
  }

  .form label .input {
    width: 100%;
    padding: 10px 10px 20px 10px;
    outline: 0;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.7); /* Slightly transparent input background */
  }

  .form label .input + span {
    position: absolute;
    left: 10px;
    top: 15px;
    color: grey;
    font-size: 0.9em;
    cursor: text;
    transition: 0.3s ease;
  }

  .form label .input:placeholder-shown + span {
    top: 15px;
    font-size: 0.9em;
  }

  /* Use :not(:placeholder-shown) instead of :focus or :valid for floating label */
  .form label .input:not(:placeholder-shown) + span {
    top: 0px;
    font-size: 0.7em;
    font-weight: 600;
  }

  /* Keep green color for valid state if desired, but floating is handled above */
   .form label .input:valid + span {
     color: green;
   }

  .submit {
    border: none;
    outline: none;
    background-color: royalblue;
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    transform: .3s ease;
    cursor: pointer; /* Add cursor */
  }

  .submit:hover {
    background-color: rgb(56, 90, 194);
  }

  @keyframes pulse {
    from {
      transform: scale(0.9);
      opacity: 1;
    }

    to {
      transform: scale(1.8);
      opacity: 0;
    }
  }
`;

// Renamed export
export default SignupForm;