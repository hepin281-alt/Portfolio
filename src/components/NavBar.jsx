import React, { memo } from 'react';
import { Link, NavLink } from 'react-router-dom';

/**
 * NavBar Component
 * Wrapped with React.memo to prevent unnecessary re-renders
 * during route changes and state updates in parent components.
 */
function NavBar({ isDarkMode, onToggleDarkMode }) {
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/projects', label: 'Projects' },
    { to: '/contact', label: 'Contact' },
    { to: '/task-manager', label: 'Task Manager' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          Student Portfolio
        </Link>
        <div className="navbar-actions">
          <button type="button" className="theme-toggle" onClick={onToggleDarkMode}>
            {isDarkMode ? 'Light mode' : 'Dark mode'}
          </button>
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => (isActive ? 'active nav-link' : 'nav-link')}
                  end={item.to === '/'}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default memo(NavBar);
