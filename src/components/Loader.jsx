import React from 'react';
import './Loader.css';

const Loader = ({ fullScreen = true, text = "Loading CareSphere..." }) => {
  return (
    <div className={`loader-container ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="spinner"></div>
      <p className="loader-text">{text}</p>
    </div>
  );
};

export default Loader;
