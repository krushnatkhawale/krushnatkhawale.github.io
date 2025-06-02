import React from 'react';

function ProjectCard({ project }) {
  if (!project) {
    return null; // Or some placeholder/error
  }

  return (
    <li className="project-card">
      <div className="project-card-content">
        <h3>
          <a href={project.link} target="_blank" rel="noopener noreferrer">
            {project.title}
          </a>
        </h3>
        <p className="project-description">{project.description}</p>
      </div>
      {project.tags && project.tags.length > 0 && (
        <div className="project-tags">
          {project.tags.map((tag, index) => (
            <span key={index} className="project-tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </li>
  );
}

export default ProjectCard;
