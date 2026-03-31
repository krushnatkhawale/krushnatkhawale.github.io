import React from 'react';
import { FaGithub, FaLinkedinIn, FaTwitter, FaMapMarkerAlt, FaEnvelope, FaLink } from 'react-icons/fa';
import '../styles/About.css';
import experiencesData from '../data/experiences.json';
import educationData from '../data/education.json';

function About({ isDarkMode, toggleDarkMode }) {
  const experiences = experiencesData.map(exp => ({
    ...exp,
    logo: exp.logo.startsWith('http') ? exp.logo : process.env.PUBLIC_URL + exp.logo
  }));

  const education = educationData.map(edu => ({
    ...edu,
    logo: edu.logo.startsWith('http') ? edu.logo : process.env.PUBLIC_URL + edu.logo
  }));

  return (
    <section 
      id="about" 
      className={`about-section ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
    >
      <div className="about-container">
        <h1 className="about-title">Krushnat Khavale</h1>
        <p className="about-subtitle">A passionate developer focused on building scalable solutions</p>

        <div className="about-statistics">
          <h3 className="statistics-title">Coding Statistics</h3>
          <div className="statistics-grid">
            <div className="statistic-card">
              <h3>Top Languages</h3>
              <figure><embed src="https://wakatime.com/share/@krushnatkhawale/c8be49d6-3e08-4539-8fec-859e3d54cb1f.svg"></embed></figure>
            </div>
            <div className="statistic-card">
              <h3>Coding Type</h3>
              <figure><embed src="https://wakatime.com/share/@krushnatkhawale/646d3219-e613-451d-8a58-8c663cd83e22.svg"></embed></figure>
            </div> 
            <div className="statistic-card">
              <h3>All Time Activity</h3>
              <figure><embed src="https://wakatime.com/share/@krushnatkhawale/e84f13f2-3ffb-4bbf-968f-681d7a88aaee.svg"></embed></figure>
            </div>
            <div className="statistic-card">
              <h3>OS Used</h3>
              <figure><embed src="https://wakatime.com/share/@krushnatkhawale/ff94424b-a99f-4ac2-93f4-c23864b51ddb.svg"></embed></figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
