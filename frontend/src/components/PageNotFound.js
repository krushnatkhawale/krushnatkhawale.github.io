import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '50px',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      margin: '20px auto',
      maxWidth: '700px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <span role="img" aria-label="Page Not Found" style={{ fontSize: '80px' }}>❓</span>
      <h1 style={{ fontSize: '3em', marginBottom: '15px', color: '#dc3545' }}>404 - Page Not Found</h1>
      <p style={{ fontSize: '1.3em', lineHeight: '1.7' }}>
        I'm sorry, but the page you were looking for could not be found.
        It might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <p style={{ fontSize: '1.1em', marginTop: '25px' }}>
        Please check the URL for any typos or return to the <Link to="/" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>homepage</Link>.
      </p>
    </div>
  );
};

export default PageNotFound;