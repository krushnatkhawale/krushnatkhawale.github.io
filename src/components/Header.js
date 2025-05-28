import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // For navigation links

function Header({ isDarkMode, toggleDarkMode }) {
  return (
    <header className="App-header">
      <nav className="main-nav">
        <Link to="/">About</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <button
        onClick={toggleDarkMode}
        className="theme-toggle-button"
        aria-label={isDarkMode ? 'Light Mode' : 'Dark Mode'}
      >
        {isDarkMode ? <FaSun /> : <FaMoon />}
      </button>
    </header>
  );
}

export default Header;