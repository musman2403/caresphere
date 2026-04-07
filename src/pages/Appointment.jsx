import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './SharedPages.css';
import { DEPARTMENTS } from '../dummyData';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Appointment = () => {
    const { user, users, bookAppointment } = useAuth();
    const navigate = useNavigate();
    
    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            alert('You must be registered as a Patient to book an appointment.');
            navigate('/signup');
        }
    }, [user, navigate]);

    const [formData, setFormData] = useState({
        patientName: user?.name || '',
        date: '',
        department: '',
        doctorId: ''
    });

    const doctors = users.filter(u => u.role === 'doctor' && u.department === formData.department);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const selectedDoctor = doctors.find(d => d.id.toString() === formData.doctorId.toString());

        bookAppointment({
            patientId: user.id,
            patientName: formData.patientName,
            date: formData.date,
            department: formData.department,
            doctorId: formData.doctorId,
            doctorName: selectedDoctor ? selectedDoctor.name : 'Unassigned'
        });
        
        alert('Appointment requested successfully and is pending confirmation!');
        navigate('/dashboard');
    };

    if (!user) return null; // Prevent rendering anything before redirect triggers

    return (
        <div className="page-wrapper dark-nav">
            <Navbar />
            
            <header className="page-header">
                <h1>Book an Appointment</h1>
                <p>Schedule your visit with our world-class specialists. Seamless booking, accelerated care.</p>
            </header>

            <main className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Patient Full Name</label>
                        <input 
                            type="text" 
                            value={formData.patientName} 
                            onChange={e => setFormData({...formData, patientName: e.target.value})} 
                            required 
                            readOnly={!!user.name}
                        />
                        <small style={{color: 'green'}}>Auto-filled from your profile</small>
                    </div>

                    <div className="form-group">
                        <label>Department</label>
                        <select 
                            value={formData.department} 
                            onChange={e => setFormData({...formData, department: e.target.value, doctorId: ''})} 
                            required
                        >
                            <option value="">Select Department</option>
                            {DEPARTMENTS.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Attending Doctor</label>
                        <select 
                            value={formData.doctorId} 
                            onChange={e => setFormData({...formData, doctorId: e.target.value})} 
                            required
                            disabled={!formData.department}
                        >
                            <option value="">{formData.department ? 'Select a Doctor' : 'Select a Department First'}</option>
                            {doctors.map(doc => (
                                <option key={doc.id} value={doc.id}>{doc.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Preferred Date and Time</label>
                        <input 
                            type="datetime-local" 
                            value={formData.date} 
                            onChange={e => setFormData({...formData, date: e.target.value})} 
                            required 
                        />
                    </div>

                    <button type="submit" className="submit-btn" style={{marginTop: '10px'}}>
                        Confirm Booking Request
                    </button>
                </form>
            </main>
            <Footer />
        </div>
    );
};

export default Appointment;
