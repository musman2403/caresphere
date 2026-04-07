import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './SharedPages.css';
import { DEPARTMENTS } from '../dummyData';

const Doctors = () => {
    const { users } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    
    // Parse the ?dept= url parameter if it exists
    const queryParams = new URLSearchParams(location.search);
    const initialDept = queryParams.get('dept') || '';

    const [selectedDept, setSelectedDept] = useState(initialDept);

    const doctors = users.filter(u => u.role === 'doctor' && (selectedDept ? u.department === selectedDept : true));

    return (
        <div className="page-wrapper dark-nav" style={{minHeight: '100vh', background: '#f4f7f6'}}>
            <Navbar />
            <header className="page-header">
                <h1>Medical Specialists</h1>
                <p>Meet our leading medical experts dedicated to your well-being.</p>
            </header>

            <main className="form-container" style={{maxWidth: '1200px', background: 'transparent', boxShadow: 'none'}}>
                <div style={{marginBottom: '30px', textAlign: 'center'}}>
                    <select 
                        value={selectedDept} 
                        onChange={e => setSelectedDept(e.target.value)}
                        style={{padding: '15px', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid #ccc', width: '300px'}}
                    >
                        <option value="">All Departments</option>
                        {DEPARTMENTS.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>

                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px'}}>
                    {doctors.length === 0 ? (
                        <p style={{textAlign: 'center', gridColumn: '1/-1', color: '#666', fontSize: '1.2rem'}}>No doctors currently registered in this department.</p>
                    ) : (
                        doctors.map(doc => (
                            <div key={doc.id} style={{background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center', transition: 'transform 0.3s'}}>
                                <div style={{width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #00b4db, #0083B0)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 20px', fontWeight: 'bold'}}>
                                    {doc.name.charAt(0)}
                                </div>
                                <h3 style={{color: '#112A46', marginBottom: '10px', fontSize: '1.4rem'}}>{doc.name}</h3>
                                <p style={{color: '#00b4db', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '5px'}}>{doc.department}</p>
                                <p style={{color: '#666', fontSize: '0.9rem', marginBottom: '20px'}}>{doc.licenseNumber || 'Board Certified'}</p>
                                <button 
                                    onClick={() => navigate('/appointment')}
                                    style={{padding: '12px 20px', background: '#112A46', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%', fontSize: '1rem', fontWeight: 'bold'}}
                                >
                                    Book Appointment
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default Doctors;
