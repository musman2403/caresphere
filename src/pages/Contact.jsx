import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './SharedPages.css';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: ''});
    
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Your message has been sent. Our support team will respond within 24 hours.');
        setFormData({ name: '', email: '', message: ''});
    };

    return (
        <div className="page-wrapper dark-nav">
            <Navbar />
            
            <header className="page-header">
                <h1>Contact CareSphere</h1>
                <p>We are here for you 24/7. Reach out with any inquiries, concerns, or emergencies.</p>
            </header>

            <div className="contact-grid">
                <div className="contact-card">
                    <h3>Emergency & Ambulance</h3>
                    <p style={{fontSize: '1.2rem', fontWeight: 'bold'}}>1122</p>
                    <p>Available 24/7/365</p>
                </div>
                <div className="contact-card">
                    <h3>General Inquiries</h3>
                    <p>+92 42 111 222 333</p>
                    <p>contact@caresphere.pk</p>
                </div>
                <div className="contact-card">
                    <h3>Location</h3>
                    <p>Main Boulevard, DHA Phase 6</p>
                    <p>Lahore, Pakistan</p>
                </div>
            </div>

            <main className="form-container">
                <h2 style={{textAlign: 'center', marginBottom: '20px', color: '#112A46'}}>Send Us A Message</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Your Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Message</label>
                        <textarea rows="4" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required></textarea>
                    </div>
                    <button type="submit" className="submit-btn">Send Message</button>
                </form>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;
