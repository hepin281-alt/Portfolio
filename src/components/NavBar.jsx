import React from 'react';

function NavBar({ activeSection, setActiveSection }) {
  const sections = ['About', 'Skills', 'Projects'];

  return (
    <nav className="navbar">
      <ul>
        {sections.map((section) => (
          <li
            key={section}
            className={activeSection === section ? 'active' : ''}
            onClick={() => setActiveSection(section)}
          >
            {section}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NavBar;
