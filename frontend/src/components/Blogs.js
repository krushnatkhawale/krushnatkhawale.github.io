import React from 'react';
import BlogCard from './BlogCard';
import '../styles/Blogs.css';
import blogsData from '../data/blogs.json';

function Blogs({ isDarkMode, toggleDarkMode }) {
  return (
    <section 
      id="blogs" 
      className={`blogs-section ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
    >
      <div className="blogs-container">
        <h1 className="blogs-title">My Blogs</h1>
        <p className="blogs-subtitle">Articles and insights on web development, architecture, and technology</p>
        
        <div className="blogs-grid">
          {blogsData.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Blogs;
