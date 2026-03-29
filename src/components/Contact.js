import React from 'react';
import { FaLinkedin, FaGithub, FaEnvelope, FaTwitter } from 'react-icons/fa';
import '../styles/Contact.css';

function Contact({ isDarkMode, toggleDarkMode }) {
  return (
    <section 
      id="contact" 
      className={`contact-section ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
    >
      <div className="contact-container">
        <h1 className="contact-title">Get In Touch</h1>
        <p className="contact-subtitle">Feel free to reach out to me via your preferred channel</p>
        
        <div className="contact-links">
          <a href="mailto:krushnatkhawale@gmail.com" className="contact-link">
            <FaEnvelope className="contact-icon" />
            <span className="contact-label">Email</span>
            <span className="contact-text">krushnatkhawale@gmail.com</span>
          </a>
          
          <a href="https://www.linkedin.com/in/krushnatkhavale/" target="_blank" rel="noopener noreferrer" className="contact-link">
            <FaLinkedin className="contact-icon" />
            <span className="contact-label">LinkedIn</span>
            <span className="contact-text">krushnatkhavale</span>
          </a>
          
          <a href="https://github.com/krushnatkhawale" target="_blank" rel="noopener noreferrer" className="contact-link">
            <FaGithub className="contact-icon" />
            <span className="contact-label">GitHub</span>
            <span className="contact-text">krushnatkhawale</span>
          </a>
          
          <a href="https://x.com/krushnatkhavale" target="_blank" rel="noopener noreferrer" className="contact-link">
            <FaTwitter className="contact-icon" />
            <span className="contact-label">X (Twitter)</span>
            <span className="contact-text">@krushnatkhavale</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;