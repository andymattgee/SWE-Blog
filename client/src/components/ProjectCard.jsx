import React from 'react';
import styled from 'styled-components';

const ProjectCard = ({ title, image, projectUrl, types }) => {
  const handleClick = () => {
    window.open(projectUrl || 'https://github.com', '_blank');
  };

  return (
    <StyledWrapper>
      <article className="article-wrapper" onClick={handleClick}>
        <div className="rounded-lg container-project">
          {image && <img src={image} alt={title} className="project-image" />}
        </div>
        <div className="project-info">
          <div className="flex-pr">
            <div className="project-title text-nowrap">{title || "Project"}</div>
            <div className="project-hover">
              <svg style={{color: 'black'}} xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" color="black" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor"><line y2={12} x2={19} y1={12} x1={5} /><polyline points="12 5 19 12 12 19" /></svg>
            </div>
          </div>
          <div className="types">
            {types && types.map((type, index) => (
              <span 
                key={index}
                style={{
                  backgroundColor: type.bgColor || 'rgba(165, 96, 247, 0.43)', 
                  color: type.textColor || 'rgb(85, 27, 177)'
                }} 
                className="project-type"
              >
                • {type.name}
              </span>
            ))}
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

const StyledWrapper = styled.div`
  .article-wrapper {
    width: 250px;
    -webkit-transition: 0.15s all ease-in-out;
    transition: 0.15s all ease-in-out;
    border-radius: 10px;
    padding: 5px;
    border: 4px solid transparent;
    cursor: pointer;
    /* Light mode background */
    background-color: #ffffff;
    border: 1px solid #e5e7eb; /* Add a light border for definition */
  }

  .article-wrapper:hover {
    /* Light mode hover shadow and border */
    -webkit-box-shadow: 10px 10px 0 #a855f7, 20px 20px 0 #d8b4fe; /* Lighter purple shadow */
    box-shadow: 10px 10px 0 #a855f7, 20px 20px 0 #d8b4fe; /* Lighter purple shadow */
    border-color: #a855f7; /* Lighter purple border */
    -webkit-transform: translate(-20px, -20px);
    -ms-transform: translate(-20px, -20px);
    transform: translate(-20px, -20px);
  }

  .article-wrapper:active {
    -webkit-box-shadow: none;
    box-shadow: none;
    -webkit-transform: translate(0, 0);
    -ms-transform: translate(0, 0);
    transform: translate(0, 0);
  }

  .types {
    gap: 10px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    place-content: flex-start;
    flex-wrap: wrap;
  }

  .rounded-lg {
    border-radius: 10px;
  }

  .article-wrapper:hover .project-hover {
    -webkit-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
    /* Light mode hover background for arrow */
    background-color: #e0e7ff; /* Lighter blue */
  }

  .project-info {
    padding-top: 20px;
    padding: 10px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    gap: 20px;
  }

  .project-title {
    font-size: 2em;
    margin: 0;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    /* Light mode title color */
    color: #1f2937; /* Dark gray */
  }

  .flex-pr {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .project-type {
    background: #b2b2fd;
    color: #1a41cd;
    font-weight: bold;
    padding: 0.3em 0.7em;
    border-radius: 15px;
    font-size: 12px;
    letter-spacing: -0.6px
  }

  .project-hover {
    border-radius: 50%;
    width: 50px;
    height: 50px;
    padding: 9px;
    -webkit-transition: all 0.3s ease;
    transition: all 0.3s ease;
  }

  .container-project {
    width: 100%;
    height: 170px;
    /* Light mode image container background */
    background: #f3f4f6; /* Slightly lighter gray */
    border-radius: 10px;
    overflow: hidden;
  }
  
  .project-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .article-wrapper:hover .project-image {
    transform: scale(1.05);
  }

  /* Dark mode overrides */
  html.dark & {
    .article-wrapper {
      background-color: #1f2937; /* Dark background */
      border: 4px solid transparent; /* Reset border */
    }

    .article-wrapper:hover {
      -webkit-box-shadow: 10px 10px 0 #7e22ce, 20px 20px 0 #a855f7; /* Original dark shadow */
      box-shadow: 10px 10px 0 #7e22ce, 20px 20px 0 #a855f7; /* Original dark shadow */
      border-color: #7e22ce; /* Original dark border */
    }
    
    .article-wrapper:active {
       -webkit-box-shadow: none;
       box-shadow: none;
    }

    .project-title {
      color: #f3f4f6; /* Light gray text for dark mode */
    }
    
    .project-hover svg {
       color: #f3f4f6; /* Light gray arrow */
    }

    .article-wrapper:hover .project-hover {
      background-color: #374151; /* Darker hover background for arrow */
    }
    
    .container-project {
       background: #374151; /* Darker gray for image container */
    }

    /* Note: .project-type styles are controlled by inline styles based on props,
       so they might need adjustment in the component logic or props themselves
       if the default light/dark contrast isn't sufficient. */
  }
`;

export default ProjectCard; 