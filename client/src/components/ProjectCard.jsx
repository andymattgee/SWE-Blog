import React from 'react';
import styled from 'styled-components';

/**
 * ProjectCard component displays a card representing a project.
 * It shows the project title, an image, associated types (tags),
 * and links to the project URL when clicked.
 * Includes hover effects and dark mode support.
 *
 * @param {object} props - The component props.
 * @param {string} props.title - The title of the project. Defaults to "Project".
 * @param {string} props.image - The URL of the project image.
 * @param {string} props.projectUrl - The URL to navigate to when the card is clicked. Defaults to GitHub.
 * @param {Array<object>} props.types - An array of type objects associated with the project.
 * @param {string} props.types[].name - The name of the type/tag.
 * @param {string} [props.types[].bgColor] - Optional background color for the type tag.
 * @param {string} [props.types[].textColor] - Optional text color for the type tag.
 */
const ProjectCard = ({ title, image, projectUrl, types }) => {
  /**
   * Handles the click event on the card.
   * Opens the projectUrl in a new tab. Uses a default GitHub URL if projectUrl is not provided.
   */
  const handleClick = () => {
    window.open(projectUrl || 'https://github.com', '_blank');
  };

  return (
    // Styled component wrapper for the card
    <StyledWrapper>
      {/* The main article element representing the card, handles click */}
      <article className="article-wrapper" onClick={handleClick}>
        {/* Container for the project image */}
        <div className="rounded-lg container-project">
          {/* Display the image if provided */}
          {image && <img src={image} alt={title} className="project-image" />}
        </div>
        {/* Container for the project information (title, types, hover icon) */}
        <div className="project-info">
          {/* Flex container for title and hover icon */}
          <div className="flex-pr">
            {/* Project title, defaults to "Project" if not provided */}
            <div className="project-title text-nowrap">{title || "Project"}</div>
            {/* Hover effect icon (arrow) */}
            <div className="project-hover">
              <svg style={{color: 'black'}} xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" color="black" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor"><line y2={12} x2={19} y1={12} x1={5} /><polyline points="12 5 19 12 12 19" /></svg>
            </div>
          </div>
          {/* Container for project type tags */}
          <div className="types">
            {/* Map through provided types and display them */}
            {types && types.map((type, index) => (
              <span
                key={index}
                // Apply custom background and text colors if provided, otherwise use defaults
                style={{
                  backgroundColor: type.bgColor || 'rgba(165, 96, 247, 0.43)',
                  color: type.textColor || 'rgb(85, 27, 177)'
                }}
                className="project-type"
              >
                • {type.name}
              </span>
            ))}
            {/* Display default types if none are provided */}
            {!types && (
              <>
                <span style={{backgroundColor: 'rgba(165, 96, 247, 0.43)', color: 'rgb(85, 27, 177)'}} className="project-type">• Analytics</span>
                <span className="project-type">• Dashboards</span>
              </>
            )}
          </div>
        </div>
      </article>
    </StyledWrapper>
  );
}

// Styled component definition using styled-components
const StyledWrapper = styled.div`
  /* Base styles for the card article wrapper */
  .article-wrapper {
    width: 250px;
    -webkit-transition: 0.15s all ease-in-out; /* Smooth transition for hover effects */
    transition: 0.15s all ease-in-out;
    border-radius: 10px;
    padding: 5px;
    border: 4px solid transparent; /* Transparent border initially */
    cursor: pointer;
    /* Light mode default background and border */
    background-color: #ffffff;
    border: 1px solid #e5e7eb; /* Light border for definition */
  }

  /* Hover styles for the card wrapper in light mode */
  .article-wrapper:hover {
    /* Apply purple shadow and border on hover */
    -webkit-box-shadow: 10px 10px 0 #a855f7, 20px 20px 0 #d8b4fe;
    box-shadow: 10px 10px 0 #a855f7, 20px 20px 0 #d8b4fe;
    border-color: #a855f7;
    /* Translate the card up and left for a lifting effect */
    -webkit-transform: translate(-20px, -20px);
    -ms-transform: translate(-20px, -20px);
    transform: translate(-20px, -20px);
  }

  /* Active (clicked) styles for the card wrapper */
  .article-wrapper:active {
    /* Remove shadow and reset transform when clicked */
    -webkit-box-shadow: none;
    box-shadow: none;
    -webkit-transform: translate(0, 0);
    -ms-transform: translate(0, 0);
    transform: translate(0, 0);
  }

  /* Styles for the container holding the type tags */
  .types {
    gap: 10px; /* Spacing between tags */
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex; /* Use flexbox for layout */
    place-content: flex-start; /* Align tags to the start */
    flex-wrap: wrap; /* Allow tags to wrap to the next line */
  }

  /* Utility class for rounded corners */
  .rounded-lg {
    border-radius: 10px;
  }

  /* Hover styles for the arrow icon container */
  .article-wrapper:hover .project-hover {
    /* Rotate the arrow icon on hover */
    -webkit-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
    /* Light mode hover background for the arrow container */
    background-color: #e0e7ff; /* Lighter blue */
  }

  /* Styles for the project information section */
  .project-info {
    padding-top: 20px;
    padding: 10px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column; /* Stack elements vertically */
    gap: 20px; /* Spacing between title/icon row and types */
  }

  /* Styles for the project title */
  .project-title {
    font-size: 2em;
    margin: 0;
    font-weight: 600;
    overflow: hidden; /* Hide overflow */
    text-overflow: ellipsis; /* Add ellipsis for long titles */
    white-space: nowrap; /* Prevent title wrapping */
    /* Light mode title color */
    color: #1f2937; /* Dark gray */
  }

  /* Styles for the flex container holding title and hover icon */
  .flex-pr {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between; /* Space out title and icon */
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center; /* Align items vertically */
  }

  /* Styles for individual project type tags */
  .project-type {
    /* Default light mode tag colors (can be overridden by inline styles) */
    background: #b2b2fd;
    color: #1a41cd;
    font-weight: bold;
    padding: 0.3em 0.7em;
    border-radius: 15px;
    font-size: 12px;
    letter-spacing: -0.6px;
  }

  /* Styles for the hover icon container */
  .project-hover {
    border-radius: 50%; /* Make it circular */
    width: 50px;
    height: 50px;
    padding: 9px; /* Padding around the SVG icon */
    -webkit-transition: all 0.3s ease; /* Smooth transition for background and transform */
    transition: all 0.3s ease;
  }

  /* Styles for the project image container */
  .container-project {
    width: 100%;
    height: 170px;
    /* Light mode image container background */
    background: #f3f4f6; /* Slightly lighter gray */
    border-radius: 10px;
    overflow: hidden; /* Clip the image to the container bounds */
  }

  /* Styles for the project image itself */
  .project-image {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Scale image to cover the container */
    transition: transform 0.3s ease; /* Smooth zoom transition on hover */
  }

  /* Zoom effect for the image on card hover */
  .article-wrapper:hover .project-image {
    transform: scale(1.05); /* Slightly zoom in */
  }

  /* Dark mode overrides using html.dark class */
  html.dark & {
    /* Dark mode styles for the card wrapper */
    .article-wrapper {
      background-color: #1f2937; /* Dark background */
      border: 4px solid transparent; /* Reset border for dark mode hover effect */
    }

    /* Dark mode hover styles for the card wrapper */
    .article-wrapper:hover {
      /* Apply original dark mode purple shadow and border */
      -webkit-box-shadow: 10px 10px 0 #7e22ce, 20px 20px 0 #a855f7;
      box-shadow: 10px 10px 0 #7e22ce, 20px 20px 0 #a855f7;
      border-color: #7e22ce;
      /* Transform remains the same */
    }

    /* Dark mode active styles (same as light mode) */
    .article-wrapper:active {
       -webkit-box-shadow: none;
       box-shadow: none;
    }

    /* Dark mode title color */
    .project-title {
      color: #f3f4f6; /* Light gray text */
    }

    /* Dark mode arrow icon color */
    .project-hover svg {
       color: #f3f4f6; /* Light gray arrow */
    }

    /* Dark mode hover background for the arrow icon container */
    .article-wrapper:hover .project-hover {
      background-color: #374151; /* Darker gray */
    }

    /* Dark mode image container background */
    .container-project {
       background: #374151; /* Darker gray */
    }

    /* Note: .project-type styles are controlled by inline styles based on props.
       Ensure the provided or default colors have sufficient contrast in dark mode. */
  }
`;

export default ProjectCard;