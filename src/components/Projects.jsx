import React from 'react';

function Projects() {
  const projects = [
    { id: 1, title: 'E-commerce Website', description: 'A full-stack e-commerce app built with React and Node.js.' },
    { id: 2, title: 'Portfolio Website', description: 'This very student portfolio project, built with Vite and React.' },
    { id: 3, title: 'Weather Dashboard', description: 'A weather app using a public API to fetch current conditions dynamically.' }
  ];

  return (
    <section className="projects">
      <h2>My Projects</h2>
      <div className="project-list">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
