import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './SharedPages.css';
import Navbar from '../components/Navbar'; // We can optionally include it.

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    dob: '',
    phone: '',
    address: '',
    bloodGroup: '',
    emergencyPhone: '',
    disease: ''
  });
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In our context, login expects a "username". We will use the email as the username.
    signup({
      name: formData.name,
      username: formData.email, // Use email as username
      email: formData.email,
      password: formData.password,
      gender: formData.gender,
      dob: formData.dob,
      phone: formData.phone,
      address: formData.address,
      bloodGroup: formData.bloodGroup,
      emergencyPhone: formData.emergencyPhone,
      disease: formData.disease
    });
    navigate('/dashboard');
  };

  return (
    <div className="page-wrapper dark-nav" style={{minHeight: '100vh', background: '#f4f7f6'}}>
      <Navbar />
      <div style={{maxWidth: '800px', margin: '40px auto', padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}}>
        <h1 style={{color: '#112A46', textAlign: 'center', marginBottom: '10px'}}>Patient Registration</h1>
        <p style={{textAlign: 'center', color: '#666', marginBottom: '30px'}}>Create your patient portal account to book appointments and view records.</p>
        
        <form onSubmit={handleSubmit} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
          
          <div className="form-group" style={{gridColumn: '1 / -1'}}>
            <label>Full Patient Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Ali Raza" required style={{width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius:'6px'}} />
          </div>

          <div className="form-group">
            <label>Email Address (Username)</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="ali.raza@example.pk" required style={{width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius:'6px'}}/>
          </div>
          
          <div className="form-group">
            <label>Account Password</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" required style={{width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius:'6px'}}/>
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} required style={{width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius:'6px'}}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} required style={{width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius:'6px'}}/>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required style={{width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius:'6px'}}/>
          </div>

          <div className="form-group">
            <label>Blood Group</label>
            <select value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})} required style={{width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius:'6px'}}>
              <option value="">Select Blood Group</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>

          <div className="form-group" style={{gridColumn: '1 / -1'}}>
            <label>Home Address</label>
            <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required style={{width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius:'6px'}}/>
          </div>

          <div className="form-group">
            <label>Emergency Contact Phone</label>
            <input type="tel" value={formData.emergencyPhone} onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})} required style={{width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius:'6px'}}/>
          </div>

          <div className="form-group">
            <label>Primary Disease / Symptom (Optional)</label>
            <input type="text" value={formData.disease} onChange={(e) => setFormData({...formData, disease: e.target.value})} placeholder="e.g. Asthma..." style={{width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius:'6px'}}/>
          </div>

          <button type="submit" style={{gridColumn: '1 / -1', padding: '15px', background: '#00b4db', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold'}}>
            Register Patient Account
          </button>

          <p style={{gridColumn: '1 / -1', textAlign: 'center', marginTop: '10px'}}>
            Already have an account? <Link to="/login" style={{color: '#00b4db', fontWeight: 'bold'}}>Login Here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
