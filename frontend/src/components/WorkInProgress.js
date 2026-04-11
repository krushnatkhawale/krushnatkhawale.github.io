import React from 'react';

const WorkInProgress = () => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '50px',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      margin: '20px auto',
      maxWidth: '600px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <span role="img" aria-label="Under Construction" style={{ fontSize: '60px' }}>🚧</span>
      <h1 style={{ fontSize: '2.5em', marginBottom: '15px', color: '#0056b3' }}>Work in Progress</h1>
      <p style={{ fontSize: '1.2em', lineHeight: '1.6' }}>
        This section is currently under construction. I'm diligently working to bring you exciting new content and features.
        Please check back soon for updates or reachout to me at <a href="mailto:krushnatkhawale@gmail.com" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>krushnatkhawale@gmail.com</a> if you have any questions or suggestions in the meantime!
      </p>
      <p style={{ fontSize: '1em', marginTop: '20px', color: '#666' }}>
        Thank you for your patience and understanding.
      </p>
    </div>
  );
};

export default WorkInProgress;