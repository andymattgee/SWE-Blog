import React from 'react';
import styled from 'styled-components';

const GradientCard = ({ title, subtitle, highlight }) => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="black-box">
          <p className="heading">{title}</p>
          <div className="additional-info">
            <p>{subtitle}</p>
            <p>{highlight}</p>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  padding: 5px;
  margin: 5px 0;
  position: relative;
  
  .card {
    position: relative;
    width: 190px;
    height: 254px;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    cursor: pointer;
    overflow: visible;
    z-index: 2;
    isolation: isolate;
  }

  .black-box {
    position: absolute;
    inset: 0;
    /* Light mode background */
    background-color: #f9fafb; /* Light gray */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
    gap: 12px;
    border-radius: 15px;
    /* Light mode text */
    color: #1f2937; /* Dark gray */
    z-index: 3;
    transition: background-color 0.3s ease;
  }

  .card::before {
    content: "";
    position: absolute;
    inset: 0;
    left: -5px;
    top: -5px;
    margin: auto;
    width: 200px;
    height: 264px;
    border-radius: 15px;
    background: linear-gradient(-45deg, #40c9ff 0%, #e81cff 100%);
    z-index: -10;
    pointer-events: none;
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .card::after {
    content: "";
    z-index: -1;
    position: absolute;
    inset: 0;
    background: linear-gradient(-45deg, #00dbde 0%, #fc00ff 100%);
    transform: translate3d(0, 0, 0) scale(0.95);
    filter: blur(20px);
    transition: filter 0.6s ease;
  }

  .heading {
    font-size: 24px;
    text-transform: uppercase;
    font-weight: 800;
    /* Light mode heading text */
    color: #1f2937; /* Dark gray */
    text-align: center;
    transition: transform 0.3s ease;
    margin-bottom: 10px;
    z-index: 3;
  }

  .additional-info {
    position: absolute;
    width: 100%;
    padding: 0 15px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
    text-align: center;
    z-index: 3;
  }

  .additional-info p {
    font-size: 18px;
    margin: 5px 0;
    /* Light mode additional info text */
    color: #374151; /* Medium gray */
  }

  .additional-info p:last-child {
    color: #40c9ff;
    font-weight: 600;
    margin-top: 10px;
  }

  /* Hover effects */
  .card:hover .black-box {
    background-color: transparent;
  }

  .card:hover .heading {
    transform: translateY(-40px);
    /* Light mode hover heading text */
    color: #1f2937; /* Dark gray */
  }

  .card:hover .additional-info {
    opacity: 1;
    transform: translateY(20px);
  }

  .card:hover::after {
    filter: blur(50px);
  }

  .card:hover::before {
    transform: rotate(-90deg) scaleX(1.34) scaleY(0.77);
  }

  .card:hover {
    background-image: linear-gradient(-45deg, #40c9ff 0%, #e81cff 100%);
    transform: scale(1.02);
  }

  /* Dark mode overrides */
  html.dark & {
    .black-box {
      background-color: #000; /* Original dark background */
      color: #ffffff; /* Original dark text */
    }

    .heading {
      color: #ffffff; /* Original dark heading text */
    }

    .additional-info p {
      color: #ffffff; /* Original dark additional info text */
    }
    
    .additional-info p:last-child {
      color: #40c9ff; /* Keep original highlight color */
    }

    .card:hover .heading {
      color: #ffffff; /* Original dark hover heading text */
    }
  }
`;

export default GradientCard; 