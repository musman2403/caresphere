import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './SharedPages.css';

const NotFound = () => {
  return (
    <div className="page-wrapper dark-nav">
      <Navbar />
      <div style={{
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flex: 1, 
        textAlign: 'center', 
        padding: '50px 20px',
        color: '#112A46'
      }}>
        <h1 style={{ fontSize: '6rem', margin: 0, color: '#00b4db' }}>404</h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Page Not Found</h2>
        <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '500px', marginBottom: '30px' }}>
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <Link to="/" className="action-btn primary" style={{ textDecoration: 'none', padding: '12px 24px', fontSize: '1.1rem' }}>
          Go Back Home
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
