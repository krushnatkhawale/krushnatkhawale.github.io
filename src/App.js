import React, { useState, useEffect } from 'react';
import './App.css'; // You can create this file for styling
import { FaLinkedin, FaGithub, FaEnvelope, FaTwitter, FaStackOverflow, FaSun, FaMoon } from 'react-icons/fa'; // Import desired icons

function App() {

  // State to manage dark mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true' ? true : false;
  });

  // Effect to update body class and localStorage when isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={process.env.PUBLIC_URL + '/images/my-profile-photo.jpg'}
          alt="My Profile"
          className="profile-image"
        />
        <button onClick={toggleDarkMode} className="theme-toggle-button">
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={toggleDarkMode}
          className="theme-toggle-button"
          aria-label={isDarkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        <h1>Welcome, thanks for stopping by!</h1>
      </header>
      <main>
        <section>
          <h2>About Me</h2>
          <p>
            A new version of my introduction is coming soon.
          </p>
        </section>
        <section>
          <h2>Projects</h2>
          <p>
            Currently down for tidy up. Coming soon!
          </p>
          {/* You can add more project details later */}
        </section>
        <section>
          <h2>Contact</h2>
          <div className="contact-links">
            <p>You can reach out to me via:</p>
            <ul>
              <li>
                <a href="mailto:krushnatkhawale@gmail.com">
                  <FaEnvelope className="contact-icon" />
                  <span>Email</span>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/krushnatkhavale/" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="contact-icon" />
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a href="https://github.com/krushnatkhawale" target="_blank" rel="noopener noreferrer">
                  <FaGithub className="contact-icon" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a href="https://stackoverflow.com/users/1446358/krushnat-khavale" target="_blank" rel="noopener noreferrer">
                  <FaStackOverflow className="contact-icon" />
                  <span> Stack Overflow </span>
                </a>
              </li>
              <li>
                <a href="https://x.com/krushnatkhavale" target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="contact-icon" />
                  <span> X </span>
                </a>
              </li>
             </ul>
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} Krushnat Khavale. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
