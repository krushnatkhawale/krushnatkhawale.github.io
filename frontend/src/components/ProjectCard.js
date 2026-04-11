import React from 'react';

function ProjectCard({ project }) {
  if (!project) {
    return null;
  }

  const { id, title, description, techStack, link, liveURL } = project;

  return (
    <div className="project-card" key={id}>
      <h2 className="project-card-title">{title}</h2>
      <p className="project-card-desc">{description}</p>
      
      {techStack && techStack.length > 0 && (
        <div className="tech-stack">
          {techStack.map((tech, index) => (
            <span key={index} className="tech-badge">{tech}</span>
          ))}
        </div>
      )}
      
      <div className="project-card-links">
        <a href={link} target="_blank" rel="noopener noreferrer" className="project-link">
          GitHub →
        </a>
        {liveURL && (
          <a href={liveURL} target="_blank" rel="noopener noreferrer" className="project-link">
            Live Demo →
          </a>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;
