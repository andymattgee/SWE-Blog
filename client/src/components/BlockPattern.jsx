import React from 'react';
import styled from 'styled-components';

const Pattern = () => {
  return (
    // Apply styles directly to the wrapper
    <StyledWrapper />
  );
}

const StyledWrapper = styled.div`
  position: absolute; /* Ensure it covers the container */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 0; /* Behind content, but above parent background */

  /* Apply background styles directly to the wrapper */
  width: 100%;
  height: 100%;
  --s: 82px;
  --c1: #b2b2b2;
  --c2: #ffffff;
  --c3: #d9d9d9;

  --_g: var(--c3) 0 120deg, #0000 0;
  background: conic-gradient(from -60deg at 50% calc(100% / 3), var(--_g)),
    conic-gradient(from 120deg at 50% calc(200% / 3), var(--_g)),
    conic-gradient(
      from 60deg at calc(200% / 3),
      var(--c3) 60deg,
      var(--c2) 0 120deg,
      #0000 0
    ),
    conic-gradient(from 180deg at calc(100% / 3), var(--c1) 60deg, var(--_g)),
    linear-gradient(
      90deg,
      var(--c1) calc(100% / 6),
      var(--c2) 0 50%,
      var(--c1) 0 calc(500% / 6),
      var(--c2) 0
    );
  background-size: calc(1.732 * var(--s)) var(--s);
`;

export default Pattern;