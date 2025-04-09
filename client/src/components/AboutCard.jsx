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
            I'm a passionate software engineer and web developer with a focus on creating elegant, 
            user-friendly solutions to complex problems. My journey in tech has led me through various 
            technologies and frameworks, allowing me to build versatile and responsive applications.
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
    background-color: rgba(17, 17, 17, 0.8);
    margin: 0 auto;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    color: #e8e8e8;
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
    color: #e8e8e8;
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
    color: #e8e8e8;
  }

  .content .btn:active {
    box-shadow: none;
  }
`;

export default AboutCard; 