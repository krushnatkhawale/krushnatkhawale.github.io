import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedinIn, FaTwitter, FaMapMarkerAlt, FaEnvelope, FaLink } from 'react-icons/fa';
import '../styles/Home.css';
import experiencesData from '../data/experiences.json';
import educationData from '../data/education.json';

function Home({ isDarkMode, toggleDarkMode }) {
  const experiences = experiencesData.map(exp => ({
    ...exp,
    logo: exp.logo.startsWith('http') ? exp.logo : process.env.PUBLIC_URL + exp.logo
  }));

  const education = educationData;

  return (
    <section 
      id="about" 
      className={`about-section ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
    >
      <div className="main-container">
        <div className="container-lg">
          <div className="row">
            {/* Left Sidebar */}
            <div className="col-lg-4">
              {/* Profile Card */}
              <div className="card profile-card">
                <a href="/">
                  <img
                    src={process.env.PUBLIC_URL + '/images/my-profile-photo.jpg'}
                    alt="Profile"
                    className="profile-img"
                  />
                </a>
                <h1 className="profile-name">Krushnat Khawale</h1>
                <p className="profile-bio">Java backend Developer | TDD Enthusiast | Clean coder | Problem Solver | <Link to="/about">more..</Link></p>

                <div className="profile-links">
                  <a
                    className="social-link"
                    href="https://github.com/krushnatkhawale"
                    title="GitHub"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub />
                  </a>
                  <a
                    className="social-link"
                    href="https://www.linkedin.com/in/krushnatkhavale/"
                    title="LinkedIn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedinIn />
                  </a>
                  <a
                    className="social-link"
                    href="https://x.com/krushnatkhavale"
                    title="X (Twitter)"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTwitter />
                  </a>
                </div>

                <h6>
                  <FaMapMarkerAlt /> Pune, India
                </h6>
                <h6>
                  <FaEnvelope /> krushnatkhawale@gmail.com
                </h6>
                <h6>
                  <a href="https://krushnatkhawale.github.io/" target="_blank" rel="noopener noreferrer" className="website-link">
                    <FaLink /> krushnatkhawale.github.io
                  </a>
                </h6>
              </div>

              {/* Coding Activity Card */}
              <div className="card">
                <h2>Coding Activity</h2>
                <figure>
                  <embed src="https://wakatime.com/share/@krushnatkhawale/69ca1817-11a9-4124-b5ba-8b0d462c2bea.svg"></embed>
                </figure>
              </div>
            </div>

            {/* Right Content */}
            <div className="col-lg-8">

              {/* Skills Card */}
              <div className="card">
                <h1>Skills</h1>
                <div className="skills-list">
                  <div className="skill-item">
                    <strong className="skill-category">Backend:</strong>
                    <span className="skill-text">Microservices (SpringBoot), DATA-ETL (Spring Batch, Spring Integration), Messaging Apps (RabbitMQ, Kafka), Build Tools (Gradle)</span>
                  </div>
                  <div className="skill-item">
                    <strong className="skill-category">Frontend:</strong>
                    <span className="skill-text">HTML, CSS, JavaScript, React</span>
                  </div>
                  <div className="skill-item">
                    <strong className="skill-category">Tools:</strong>
                    <span className="skill-text">Git, GitHub, Docker, Linux</span>
                  </div>
                  <div className="skill-item">
                    <strong className="skill-category">Databases:</strong>
                    <span className="skill-text">PostgreSQL, Gemfire</span>
                  </div>
                </div>
              </div>

              {/* Work Experience Card */}
              <div className="card">
                <h1 className="">Work Experience</h1>

                {experiences.map(exp => (
                  <div className="experience-item" key={exp.id}>
                    <div className="company-logo-wrapper">
                      <img 
                        src={exp.logo} 
                        alt={exp.company} 
                        className="company-logo"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<div class="company-logo-fallback">${exp.company.charAt(0)}</div>`;
                        }}
                      />
                    </div>
                    <div>
                      <div className="experience-title-wrapper">
                        <h4 className="experience-title">{exp.title} @ {exp.company}</h4>
                        <p className="experience-time">{exp.time}</p>
                      </div>
                      <p className="experience-desc">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Education Card */}
              <div className="card">
                <h2 className="card-title">Education</h2>

                <div className="education-grid">
                  {education.map(edu => (
                    <div className="experience-item" key={edu.id}>
                      <div>
                        <h4 className="experience-title">{edu.title}</h4>
                        <h6 className="experience-info">{edu.field}</h6>
                        <p className="experience-desc">{edu.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
