import React from 'react';
import { FaLinkedin, FaGithub, FaEnvelope, FaTwitter, FaStackOverflow } from 'react-icons/fa';

function Contact() {
  return (
    <section id="contact">
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
  );
}

export default Contact;