import React from 'react';
import ProjectCard from './ProjectCard';
import '../styles/Projects.css';
import projectsData from '../data/projects.json';

function Projects({ isDarkMode, toggleDarkMode }) {
  return (
    <section 
      id="projects" 
      className={`projects-section ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
    >
      <div className="projects-container">
        <h1 className="projects-title">My Projects</h1>
        <p className="projects-subtitle">Featured projects showcasing my skills and experience</p>
        
        <div className="projects-grid">
          {projectsData.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;