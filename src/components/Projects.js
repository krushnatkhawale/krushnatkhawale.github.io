import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard'; // We'll create this component

function Projects() {
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [isListView, setIsListView] = useState(false); // false for Card view, true for List view
  const [isLoading, setIsLoading] = useState(true);

  // Fetch projects from JSON
  useEffect(() => {
    setIsLoading(true);
    fetch('/projects.json') // Assuming projects.json is in the public folder
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setDisplayedProjects(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Could not fetch projects:", error);
        setIsLoading(false);
      });
  }, []);

  const toggleView = () => {
    setIsListView(prevIsListView => !prevIsListView);
  };

  return (
    <section className="projects-section">
      <div className="projects-header">
        <h2>My Projects</h2>
        <button onClick={toggleView} className="view-toggle-button">
          {isListView ? 'Card View' : 'List View'}
        </button>
      </div>
       {isLoading && <p className="loading-indicator">Loading projects...</p>}
      {!isLoading && displayedProjects.length === 0 && <p>No projects to display at the moment.</p>}
      <ul className={`projects-list ${isListView ? 'list-view' : ''}`}>
        {
          displayedProjects.map((project, index) => (
            <ProjectCard key={project.id || index} project={project} />
          ))
        }
      </ul>
    </section>
  );
}

export default Projects;