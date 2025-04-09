import React from 'react';
import styled from 'styled-components';

const GradientCard = ({ title, subtitle, highlight }) => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="card-content">
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
  
  .card {
    position: relative;
    width: 190px;
    height: 254px;
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  .card-content {
    position: absolute;
    inset: 5px;
    background-color: rgb(0, 0, 0);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
    gap: 12px;
    border-radius: 10px;
    color: #ffffff;
    z-index: 2;
    overflow: hidden;
  }

  .card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 15px;
    padding: 2px; /* Border thickness */
    background: linear-gradient(-45deg, #40c9ff 0%, #e81cff 100%);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: 1;
    pointer-events: none;
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .card::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 15px;
    background: linear-gradient(-45deg, #00dbde 0%, #fc00ff 100%);
    z-index: 0;
    opacity: 0.5;
    filter: blur(15px);
    transition: filter 0.6s ease, opacity 0.6s ease;
  }

  .heading {
    font-size: 24px;
    text-transform: uppercase;
    font-weight: 800;
    color: #ffffff;
    text-align: center;
    transition: transform 0.3s ease;
    margin-bottom: 10px;
    z-index: 2;
  }

  .additional-info {
    position: absolute;
    width: 100%;
    padding: 0 15px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
    text-align: center;
    z-index: 1;
  }

  .additional-info p {
    font-size: 18px;
    margin: 5px 0;
    color: #ffffff;
  }

  .additional-info p:last-child {
    color: #40c9ff;
    font-weight: 600;
    margin-top: 10px;
  }

  /* Hover effects */
  .card:hover .heading {
    transform: translateY(-40px);
  }

  .card:hover .additional-info {
    opacity: 1;
    transform: translateY(20px);
  }

  .card:hover::after {
    filter: blur(50px);
    opacity: 1;
  }

  .card:hover::before {
    background: linear-gradient(-45deg, #40c9ff 0%, #e81cff 100%);
    transform: rotate(-90deg) scaleX(1.34) scaleY(0.77);
  }

  .card:hover {
    transform: scale(1.05);
  }
`;

export default GradientCard; 