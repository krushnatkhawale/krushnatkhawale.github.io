import React from 'react';

function About() {
  return (
    <section id="about">
      <div className="hero-text-content">
        <h1>Welcome</h1>
        <p className="hero-subtitle">thanks for stopping by!</p>
        <div className="hero-introduction">
          <p className="intro-prefix">I am a</p>
          <div className="intro-roles"> {/* This div will act as a flex container for the roles */}
            <span className="role">💻 Java backend engineer</span>
            <span className="role">🧠 Analytical</span>
            <span className="role">💡 Innovative Thinker</span>
            <span className="role">✨ Solution Designer</span>
            <span className="role">✅ Clean coder</span>
            <span className="role">🎯 TDD-BDD practitioner</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;