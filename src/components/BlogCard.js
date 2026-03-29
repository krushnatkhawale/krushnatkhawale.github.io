import React from 'react';

function BlogCard({ blog }) {
  if (!blog) {
    return null;
  }

  const { id, title, description, date, category, link, tags } = blog;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="blog-card" key={id}>
      <div className="blog-card-header">
        <h2 className="blog-card-title">{title}</h2>
        <span className="blog-category">{category}</span>
      </div>
      
      <p className="blog-card-desc">{description}</p>
      
      <div className="blog-date">{formatDate(date)}</div>
      
      {tags && tags.length > 0 && (
        <div className="blog-tags">
          {tags.map((tag, index) => (
            <span key={index} className="blog-tag">{tag}</span>
          ))}
        </div>
      )}
      
      <div className="blog-card-links">
        <a href={link} target="_blank" rel="noopener noreferrer" className="blog-link">
          Read Article →
        </a>
      </div>
    </div>
  );
}

export default BlogCard;
