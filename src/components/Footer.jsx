import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer-section" id="contact">
            <div className="footer-content">
                <div className="footer-col">
                    <h3>CareSphere</h3>
                    <p>Main Boulevard, DHA Phase 6</p>
                    <p>Lahore, Pakistan</p>
                    <p>contact@caresphere.pk</p>
                </div>
                <div className="footer-col">
                    <h3>Quick Links</h3>
                    <p><Link to="/login" style={{color: '#a8b2d1', textDecoration: 'none'}}>Patient Portal</Link></p>
                    <p><Link to="/login" style={{color: '#a8b2d1', textDecoration: 'none'}}>Staff Login</Link></p>
                </div>
                <div className="footer-col">
                    <h3>Emergency Contact</h3>
                    <p style={{fontSize: '1.5rem', color: '#00b4db', fontWeight: 'bold'}}>1122</p>
                    <p>Available 24/7/365</p>
                </div>
            </div>
            <div className="footer-btm">
                <p>&copy; {new Date().getFullYear()} CareSphere Hospital. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
