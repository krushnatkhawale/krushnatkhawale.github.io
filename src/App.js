import React from 'react';
import './App.css'; // You can create this file for styling

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My Awesome Website!</h1>
        <p>
          This is my personal website, built with React and hosted on GitHub Pages.
        </p>
        <p>
          Feel free to explore and learn more about me and my projects.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <main>
        <section>
          <h2>About Me</h2>
          <p>
            This is where you can write a little bit about yourself.
            What are your passions? What do you do?
          </p>
        </section>
        <section>
          <h2>Projects</h2>
          <p>
            Showcase some of your cool projects here!
          </p>
          {/* You can add more project details later */}
        </section>
        <section>
          <h2>Contact</h2>
          <p>
            How can people get in touch with you?
            (e.g., LinkedIn, GitHub, Email)
          </p>
        </section>
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
