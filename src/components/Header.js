import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // For navigation links

function Header({ isDarkMode, toggleDarkMode }) {
  return (
    <header className="App-header">
      <img
        src={process.env.PUBLIC_URL + '/images/my-profile-photo.jpg'}
        alt="My Profile"
        className="profile-image"
      />
      
      <button
        onClick={toggleDarkMode}
        className="theme-toggle-button"
        aria-label={isDarkMode ? 'Light Mode' : 'Dark Mode'}
      >
        {isDarkMode ? <FaSun /> : <FaMoon />}
      </button>
      <h1>Welcome</h1>
      <h6>thanks for stopping by!</h6>
      <nav className="main-nav">
        <Link to="/">About</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
}

export default Header;