import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import './App.css'; // You can create this file for styling
// Import Components
import Header from './components/Header';
import Home from './components/Home';
import Projects from './components/Projects';
import Blogs from './components/Blogs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import About from './components/About';

// Initialize Google Analytics
// Replace 'G-XXXXXXXXXX' with your actual Google Analytics Measurement ID
const MEASUREMENT_ID = 'G-5BJKLL1EXD';
ReactGA.initialize(MEASUREMENT_ID);
// Component to track page views
function AppContent({ isDarkMode, toggleDarkMode }) {
  const location = useLocation();

  useEffect(() => {
    // Track page view
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);

  return (
    <>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main>
        <Routes>
          <Route path="/" element={<Home isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/projects" element={<Projects isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/blogs" element={<Blogs isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/contact" element={<Contact isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/about" element={<About isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          {/* You can add a 404 Not Found route here if you like */}
          {/* <Route path="*" element={<div>Page Not Found</div>} /> */}
        </Routes>
      </main>
      <Footer />
    </>
  );
}

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
    <Router>
      <div className="App">
        <AppContent isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>
    </Router>
  );
}

export default App;
