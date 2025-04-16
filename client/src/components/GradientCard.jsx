import React from 'react';
import styled from 'styled-components';

/**
 * GradientCard component displays a card with a gradient border effect on hover.
 * It shows a title initially, and reveals subtitle and highlight text on hover.
 * Includes dark mode support.
 *
 * @param {object} props - The component props.
 * @param {string} props.title - The main title displayed on the card.
 * @param {string} props.subtitle - The subtitle text revealed on hover.
 * @param {string} props.highlight - The highlight text revealed on hover (typically styled differently).
 */
const GradientCard = ({ title, subtitle, highlight }) => {
  return (
    // Styled component wrapper for positioning and potential margins
    <StyledWrapper>
      {/* The main card element with relative positioning for pseudo-elements */}
      <div className="card">
        {/* Inner container for the card content, initially opaque */}
        <div className="black-box">
          {/* The main title, visible initially */}
          <p className="heading">{title}</p>
          {/* Container for additional info, hidden initially, revealed on hover */}
          <div className="additional-info">
            <p>{subtitle}</p>
            <p>{highlight}</p>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

// Styled component definition using styled-components
const StyledWrapper = styled.div`
  padding: 5px; /* Padding around the card */
  margin: 5px 0; /* Margin for spacing */
  position: relative; /* Needed for absolute positioning of pseudo-elements */

  /* Base styles for the card container */
  .card {
    position: relative; /* Context for absolute positioned children and pseudo-elements */
    width: 190px;
    height: 254px;
    background-color: transparent; /* Initially transparent, gradient applied on hover */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    cursor: pointer;
    overflow: visible; /* Allow pseudo-elements to extend beyond bounds */
    z-index: 2; /* Ensure card is above background elements */
    isolation: isolate; /* Create a new stacking context */
    transition: transform 0.3s ease, background-image 0.6s ease; /* Smooth transitions */
  }

  /* Inner box containing the text content */
  .black-box {
    position: absolute; /* Position within the card */
    inset: 0; /* Fill the card */
    /* Light mode default background */
    background-color: #f9fafb; /* Light gray */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
    gap: 12px; /* Space between elements if multiple were visible */
    border-radius: 15px;
    /* Light mode default text color */
    color: #1f2937; /* Dark gray */
    z-index: 3; /* Ensure text is above the card background/gradient */
    transition: background-color 0.3s ease; /* Smooth transition for hover effect */
  }

  /* ::before pseudo-element: Creates the gradient border effect */
  .card::before {
    content: "";
    position: absolute;
    inset: 0;
    left: -5px; /* Offset to create border thickness */
    top: -5px;  /* Offset to create border thickness */
    margin: auto; /* Center the pseudo-element */
    width: 200px; /* Slightly larger than the card */
    height: 264px; /* Slightly larger than the card */
    border-radius: 15px;
    background: linear-gradient(-45deg, #40c9ff 0%, #e81cff 100%); /* Gradient definition */
    z-index: -10; /* Position behind the card content */
    pointer-events: none; /* Allow clicks to pass through */
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Complex transition for hover effect */
  }

  /* ::after pseudo-element: Creates the blurred glow effect */
  .card::after {
    content: "";
    z-index: -1; /* Position behind the card content but above ::before */
    position: absolute;
    inset: 0;
    background: linear-gradient(-45deg, #00dbde 0%, #fc00ff 100%); /* Different gradient for glow */
    transform: translate3d(0, 0, 0) scale(0.95); /* Slightly smaller and prepared for 3D transforms */
    filter: blur(20px); /* Initial blur */
    transition: filter 0.6s ease; /* Smooth transition for blur effect */
  }

  /* Styles for the main heading text */
  .heading {
    font-size: 24px;
    text-transform: uppercase;
    font-weight: 800;
    /* Light mode heading color */
    color: #1f2937; /* Dark gray */
    text-align: center;
    transition: transform 0.3s ease; /* Smooth transition for hover effect */
    margin-bottom: 10px; /* Space below heading */
    z-index: 3; /* Ensure heading is above background */
  }

  /* Styles for the container holding subtitle and highlight */
  .additional-info {
    position: absolute; /* Position within black-box */
    width: 100%; /* Take full width */
    padding: 0 15px; /* Horizontal padding */
    opacity: 0; /* Hidden initially */
    transform: translateY(20px); /* Start slightly lower */
    transition: all 0.3s ease; /* Smooth fade-in and slide-up transition */
    text-align: center;
    z-index: 3; /* Ensure info is above background */
  }

  /* Styles for paragraphs within additional-info */
  .additional-info p {
    font-size: 18px;
    margin: 5px 0;
    /* Light mode additional info text color */
    color: #374151; /* Medium gray */
  }

  /* Styles specifically for the highlight text (last paragraph) */
  .additional-info p:last-child {
    color: #40c9ff; /* Highlight color */
    font-weight: 600;
    margin-top: 10px; /* Extra space above highlight */
  }

  /* --- Hover Effects --- */

  /* Make the inner box transparent on hover to reveal the gradient */
  .card:hover .black-box {
    background-color: transparent;
  }

  /* Move the heading up on hover */
  .card:hover .heading {
    transform: translateY(-40px);
    /* Light mode hover heading color (remains dark gray) */
    color: #1f2937;
  }

  /* Fade in and move up the additional info on hover */
  .card:hover .additional-info {
    opacity: 1;
    transform: translateY(20px); /* Final position */
  }

  /* Increase the blur effect on hover */
  .card:hover::after {
    filter: blur(50px);
  }

  /* Animate the gradient border on hover */
  .card:hover::before {
    transform: rotate(-90deg) scaleX(1.34) scaleY(0.77);
  }

  /* Apply gradient background and slight scale to the card itself on hover */
  .card:hover {
    background-image: linear-gradient(-45deg, #40c9ff 0%, #e81cff 100%);
    transform: scale(1.02); /* Slight zoom effect */
  }

  /* --- Dark Mode Overrides --- */
  html.dark & {
    /* Dark mode background and text for the inner box */
    .black-box {
      background-color: #000; /* Black background */
      color: #ffffff; /* White text */
    }

    /* Dark mode heading color */
    .heading {
      color: #ffffff; /* White heading */
    }

    /* Dark mode additional info text color */
    .additional-info p {
      color: #ffffff; /* White text */
    }

    /* Keep highlight color consistent in dark mode */
    .additional-info p:last-child {
      color: #40c9ff;
    }

    /* Dark mode hover heading color */
    .card:hover .heading {
      color: #ffffff; /* White heading on hover */
    }
    /* Note: Hover background for black-box becomes transparent in both modes */
  }
`;

export default GradientCard;