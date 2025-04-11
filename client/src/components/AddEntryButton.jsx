import React from 'react';
import styled from 'styled-components';

const AddEntryButton = ({ onClick, theme = 'dark' }) => { // Default to dark if theme prop is not provided
  return (
    <StyledWrapper theme={theme}> {/* Pass theme prop here */}
      <button type="button" className="button" onClick={onClick}>
        <span className="button__text">Add Entry</span> {/* Changed text here */}
        <span className="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width={24} viewBox="0 0 24 24" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height={24} fill="none" className="svg"><line y2={19} y1={5} x2={12} x1={12} /><line y2={12} y1={12} x2={19} x1={5} /></svg></span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    /* Color variables based on theme */
    --main-focus: #a855f7; /* Purple for focus */
    --font-color: ${({ theme }) => (theme === 'light' ? '#374151' : '#dedede')}; /* Dark gray for light, light gray for dark */
    --bg-color-sub: ${({ theme }) => (theme === 'light' ? '#e5e7eb' : '#222')}; /* Light gray for light, dark gray for dark */
    --bg-color: ${({ theme }) => (theme === 'light' ? '#ffffff' : '#111827')}; /* White for light, dark gray for dark */
    --main-color: ${({ theme }) => (theme === 'light' ? '#a855f7' : '#ffffff')}; /* Purple for light, white for dark */
    position: relative;
    width: 150px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
    background-color: var(--bg-color);
    border-radius: 10px;
    overflow: hidden;
  }

  .button, .button__icon, .button__text {
    transition: all 0.3s;
  }

  .button .button__text {
    transform: translateX(25px); /* Adjusted for "Add Entry" */
    color: var(--font-color);
    font-weight: 600;
    white-space: nowrap; /* Prevent text wrapping */
  }

  .button .button__icon {
    position: absolute;
    transform: translateX(109px);
    height: 100%;
    width: 39px;
    background-color: var(--bg-color-sub);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button .svg {
    width: 20px;
    stroke: var(--main-color); /* Use main color for initial icon stroke */
  }

  /* Keep main button background/border/shadow the same on hover */
  .button:hover {
    background: var(--bg-color);
    border-color: var(--main-color);
    box-shadow: 4px 4px var(--main-color);
  }

  /* Change icon background on hover */
  .button:hover .button__icon {
    background-color: #a855f7; /* purple-500 */
    /* Icon animation happens below */
  }

  /* Keep icon stroke white on hover */
  .button:hover .svg {
     stroke: ${({ theme }) => (theme === 'light' ? '#ffffff' : '#ffffff')}; /* Keep white stroke on hover for both */
  }

  .button:hover .button__text {
    color: transparent;
  }

  .button:hover .button__icon {
    width: 148px;
    transform: translateX(0);
  }

  .button:active {
    transform: translate(3px, 3px);
    box-shadow: 0px 0px var(--main-color);
  }
`;

export default AddEntryButton;