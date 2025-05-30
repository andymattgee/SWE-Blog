import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const AboutCard = () => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="content">
          <p className="heading">About Me</p>
          <p className="para">
          I’m a physical therapist assistant who’s pivoting into tech — I’ve always loved designing things and being creative, and web development just clicked for me. I’ve been diving into full-stack development but find myself especially excited about front-end work where I can make things look and feel just right. Right now, I’m building a personal blog app and working with a small team on a fashion project that uses AI to help people organize their closets. I’m learning a ton and having fun creating things that (hopefully) make life a little cooler and easier.

          </p>
          <Link to="/contactPage">
            <button className="btn">Contact Me</button>
          </Link>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 740px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    padding: 32px;
    overflow: hidden;
    border-radius: 10px;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.320, 1);
    /* Light mode background */
    background-color: rgba(255, 255, 255, 0.9);
    border: 1px solid #e5e7eb; /* Light border for definition */
    margin: 0 auto;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    /* Light mode text */
    color: #1f2937;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.320, 1);
    z-index: 2;
  }

  .content .heading {
    font-weight: 700;
    font-size: 32px;
  }

  .content .para {
    line-height: 1.6;
    font-size: 18px;
  }

  .content .btn {
    /* Light mode button text */
    color: #ffffff; /* Keep button text white initially */
    text-decoration: none;
    padding: 12px 24px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    background: linear-gradient(-45deg, #7e22ce 0%, #a855f7 100%);
    border-radius: 5px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
  }

  .card::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(-45deg, #7e22ce 0%, #a855f7 100%);
    z-index: 1;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.320, 1);
  }

  .card:hover::before {
    height: 100%;
  }

  .card:hover {
    box-shadow: none;
  }

  .card:hover .btn {
    color: #212121;
    background: #e8e8e8;
  }

  .content .btn:hover {
    outline: 2px solid #e8e8e8;
    background: transparent;
    /* Light mode button hover text */
    color: #1f2937;
  }

  .content .btn:active {
    box-shadow: none;
  }

  /* Dark mode overrides */
  html.dark & {
    .card {
      background-color: rgba(17, 17, 17, 0.8); /* Original dark background */
      border: none; /* Remove light border in dark mode */
    }

    .content {
      color: #e8e8e8; /* Original dark text */
    }

    .content .btn {
      color: #e8e8e8; /* Original dark button text */
    }
    
    .card:hover .btn {
      color: #212121; /* Original dark hover button text */
      background: #e8e8e8; /* Original dark hover button background */
    }

    .content .btn:hover {
      outline: 2px solid #e8e8e8; /* Original dark hover button outline */
      background: transparent; /* Original dark hover button background */
      color: #e8e8e8; /* Original dark hover button text */
    }
  }
`;

export default AboutCard; 