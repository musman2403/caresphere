import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './SharedPages.css';
import { DEPARTMENTS } from '../dummyData';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Apply = () => {
    const { submitApplication } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        department: '',
        coverLetter: '',
        licenseNumber: '',
        yearsExperience: '',
        shiftPreference: '',
        languages: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        submitApplication(formData);
        alert('Thank you for your application to CareSphere. Our HR team will reach out to you shortly.');
        navigate('/');
    };

    return (
        <div className="page-wrapper dark-nav">
            <Navbar />
            
            <header className="page-header">
                <h1>Join the CareSphere Family</h1>
                <p>Advance your career at a world-class facility dedicated to pioneering medical excellence and profound compassion.</p>
            </header>

            <main className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Legal Name</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Dr. Aisha Khan" required />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="aisha.khan@example.pk" required />
                    </div>

                    <div className="form-group">
                        <label>Position Applying For</label>
                        <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value, licenseNumber: '', yearsExperience: '', shiftPreference: '', languages: ''})} required>
                            <option value="">Select a Role</option>
                            <option value="doctor">Attending Physician (Doctor)</option>
                            <option value="nurse">Registered Nurse</option>
                            <option value="wardboy">Ward Staff / Technician</option>
                            <option value="receptionist">Receptionist / Administrator</option>
                        </select>
                    </div>

                    {/* DYNAMIC DOCTOR FIELDS */}
                    {formData.role === 'doctor' && (
                        <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #e1e8ed'}}>
                            <h4 style={{marginBottom: '15px', color: '#0083B0'}}>Physician Credentials</h4>
                            <div className="form-group">
                                <label>Medical License Number / NPI</label>
                                <input type="text" value={formData.licenseNumber} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} required />
                            </div>
                            <div className="form-group" style={{marginBottom: 0}}>
                                <label>Board Certifications / Fellowships</label>
                                <input type="text" placeholder="e.g. FACC, FACS, Board Certified Internal Medicine..." required />
                            </div>
                        </div>
                    )}

                    {/* DYNAMIC NURSE FIELDS */}
                    {formData.role === 'nurse' && (
                        <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #e1e8ed'}}>
                            <h4 style={{marginBottom: '15px', color: '#0083B0'}}>Nursing Credentials</h4>
                            <div className="form-group">
                                <label>Nursing License Number / State</label>
                                <input type="text" value={formData.licenseNumber} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} required />
                            </div>
                            <div className="form-group" style={{marginBottom: 0}}>
                                <label>Shift Preference</label>
                                <select value={formData.shiftPreference} onChange={(e) => setFormData({...formData, shiftPreference: e.target.value})} required>
                                    <option value="">Select Shift</option>
                                    <option value="day">Day Shift (7AM - 7PM)</option>
                                    <option value="night">Night Shift (7PM - 7AM)</option>
                                    <option value="rotating">Rotating</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* DYNAMIC WARDBOY FIELDS */}
                    {formData.role === 'wardboy' && (
                        <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #e1e8ed'}}>
                            <h4 style={{marginBottom: '15px', color: '#0083B0'}}>Support Staff Verification</h4>
                            <div className="form-group">
                                <label>Years of Prior Healthcare/Hospital Experience</label>
                                <input type="number" min="0" value={formData.yearsExperience} onChange={(e) => setFormData({...formData, yearsExperience: e.target.value})} required />
                            </div>
                            <div className="form-group" style={{marginBottom: 0}}>
                                <label>Shift Availability</label>
                                <select value={formData.shiftPreference} onChange={(e) => setFormData({...formData, shiftPreference: e.target.value})} required>
                                    <option value="">Select Availability</option>
                                    <option value="full">Full-Time (Includes Weekends)</option>
                                    <option value="part">Part-Time / PRN</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* DYNAMIC RECEPTIONIST FIELDS */}
                    {formData.role === 'receptionist' && (
                        <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #e1e8ed'}}>
                            <h4 style={{marginBottom: '15px', color: '#0083B0'}}>Administrative Details</h4>
                            <div className="form-group">
                                <label>Years of Front Desk / Admin Experience</label>
                                <input type="number" min="0" value={formData.yearsExperience} onChange={(e) => setFormData({...formData, yearsExperience: e.target.value})} required />
                            </div>
                            <div className="form-group" style={{marginBottom: 0}}>
                                <label>Fluent Languages</label>
                                <input type="text" value={formData.languages} onChange={(e) => setFormData({...formData, languages: e.target.value})} placeholder="e.g. English, Spanish, Mandarin..." required />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Preferred Department</label>
                        <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required>
                            <option value="">Select Department</option>
                            {DEPARTMENTS.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                            <option value="General Admin">General / Administration</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Why CareSphere? (Cover Letter Summary)</label>
                        <textarea rows="5" value={formData.coverLetter} onChange={(e) => setFormData({...formData, coverLetter: e.target.value})} placeholder="Briefly detail your qualifications and motivation..." required></textarea>
                    </div>

                    <button type="submit" className="submit-btn" disabled={!formData.role}>Submit Application</button>
                    {!formData.role && <p style={{textAlign: 'center', marginTop: '10px', fontSize: '0.9rem', color: '#666'}}>Please select a role to unlock application submission</p>}
                </form>
            </main>
        </div>
    );
};

export default Apply;
