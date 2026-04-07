import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { DEPARTMENTS } from '../dummyData';
import Navbar from '../components/Navbar';

const Home = () => {
    return (
        <div className="home-container">
            <Navbar />
            {/* Section 1: Hero */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>CareSphere Hospital</h1>
                    <p>Pioneering the future of medicine with unparalleled compassion, cutting-edge technology, and a world-class team of dedicated professionals.</p>
                    <Link to="/login" className="hero-btn">Access Patient Portal</Link>
                </div>
            </section>

            {/* Section 2: About Us */}
            <section className="section about-section">
                <div className="about-text">
                    <h2 className="section-title" style={{textAlign: 'left'}}>Our Vision & Heritage</h2>
                    <h3>Healing Hands, Caring Hearts</h3>
                    <p>Founded on a legacy of clinical excellence, CareSphere stands as a beacon of health and wellness within the community. Our philosophy integrates state-of-the-art medical science with profound human empathy.</p>
                    <p>With decades of experience traversing complex medical landscapes, our distinguished administration continually sets groundbreaking standards across every department.</p>
                </div>
                <div className="about-image">
                    {/* Abstract placeholder for the about image */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1453&auto=format&fit=crop) center/cover' }}></div>
                </div>
            </section>

            {/* Section 3: Departments */}
            <section className="section">
                <h2 className="section-title">Centers of Excellence</h2>
                <div className="departments-grid">
                    {DEPARTMENTS.map((dept, index) => (
                        <Link to={`/doctors?dept=${encodeURIComponent(dept)}`} className="dept-card" key={index} style={{textDecoration: 'none', color: 'inherit'}}>
                            <div className="dept-icon">
                                {dept === 'Emergency' && '🚑'}
                                {dept === 'Surgical' && '🔪'}
                                {dept === 'Pediatrics' && '🧸'}
                                {dept === 'Orthopedics' && '🦴'}
                                {dept === 'Radiology' && '☢️'}
                            </div>
                            <h3>{dept}</h3>
                            <p>Delivering specialized, evidence-based care tailored precisely to your unique clinical needs.</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Section 4: Facilities & Wards */}
            <div className="facilities-wrapper">
                <section className="section">
                    <h2 className="section-title">World-Class Facilities</h2>
                    <div className="facility-list">
                        <div className="facility-item">
                            <div style={{height: '200px', background: 'url(https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1528&auto=format&fit=crop) center/cover'}}></div>
                            <div className="facility-content">
                                <h4>Advanced ICU</h4>
                                <p>Equipped with 24/7 robotic monitoring and critical response units.</p>
                            </div>
                        </div>
                        <div className="facility-item">
                            <div style={{height: '200px', background: 'url(https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1470&auto=format&fit=crop) center/cover'}}></div>
                            <div className="facility-content">
                                <h4>Diagnostic Imaging</h4>
                                <p>Next-generation 3T MRI, 128-slice CT, and high-res ultrasound.</p>
                            </div>
                        </div>
                        <div className="facility-item">
                            <div style={{height: '200px', background: 'url(https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=1470&auto=format&fit=crop) center/cover'}}></div>
                            <div className="facility-content">
                                <h4>Luxury Recovery Suites</h4>
                                <p>Spacious, serene rooms tailored for rapid and comfortable convalescence.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Section 5: Top Doctors */}
            <section className="section doctors-section">
                <h2 className="section-title">Meet Our Experts</h2>
                <div className="doctors-grid">
                    <div className="doctor-profile">
                        <div className="doc-avatar"></div>
                        <h4>Dr. Ayesha Khan</h4>
                        <p>Head of Cardiology</p>
                    </div>
                    <div className="doctor-profile">
                        <div className="doc-avatar"></div>
                        <h4>Dr. Tariq Mahmood</h4>
                        <p>Lead Neurosurgeon</p>
                    </div>
                    <div className="doctor-profile">
                        <div className="doc-avatar"></div>
                        <h4>Dr. Fatima Ali</h4>
                        <p>Chief Pediatrician</p>
                    </div>
                    <div className="doctor-profile">
                        <div className="doc-avatar"></div>
                        <h4>Dr. Usman Raza</h4>
                        <p>Head of Radiology</p>
                    </div>
                </div>
            </section>

            {/* Section 6: Testimonials */}
            <section className="testimonials-section">
                <h2 className="section-title">Patient Success Stories</h2>
                <div className="testi-grid">
                    <div className="testi-card">
                        <p>"The level of care I received at CareSphere was entirely unprecedented. The staff is brilliant, attentive, and deeply compassionate."</p>
                        <h5>- Muhammad R.</h5>
                    </div>
                    <div className="testi-card">
                        <p>"From the moment I entered the emergency wing, everything was seamless. They saved my life, and I couldn't be more thankful."</p>
                        <h5>- Sana L.</h5>
                    </div>
                    <div className="testi-card">
                        <p>"A modern sanctuary for healing. The Orthopedics team managed my rehabilitation flawlessly. Five-star experience!"</p>
                        <h5>- Bilal K.</h5>
                    </div>
                </div>
            </section>

            {/* Section 7: Footer & Contact Info */}
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
                        <p style={{fontSize: '1.5rem', color: '#00b4db', fontWeight: 'bold'}}>+92 (800) 112-CARE</p>
                        <p>Available 24/7/365</p>
                    </div>
                </div>
                <div className="footer-btm">
                    <p>&copy; {new Date().getFullYear()} CareSphere Hospital. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
