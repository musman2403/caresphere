import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './SharedPages.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signup(formData);
    if (res.success) {
      navigate('/dashboard');
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="page-wrapper dark-nav">
      <Navbar />
      <header className="page-header">
        <h1>Patient Registration</h1>
        <p>Create your patient portal account to book appointments and view records.</p>
      </header>

      <main className="form-container" style={{maxWidth: '800px'}}>
        <form onSubmit={handleSubmit} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
          
          <div className="form-group" style={{gridColumn: '1 / -1', marginBottom: 0}}>
            <label>Full Patient Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Ali Raza" required />
          </div>

          <div className="form-group" style={{marginBottom: 0}}>
            <label>Email Address (Username)</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="ali.raza@example.pk" required />
          </div>
          
          <div className="form-group" style={{marginBottom: 0}}>
            <label>Account Password</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" required />
          </div>

          <div className="form-group" style={{marginBottom: 0}}>
            <label>Gender</label>
            <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} required >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group" style={{marginBottom: 0}}>
            <label>Date of Birth</label>
            <input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} required />
          </div>

          <div className="form-group" style={{marginBottom: 0}}>
            <label>Phone Number</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
          </div>

          <div className="form-group" style={{marginBottom: 0}}>
            <label>Blood Group</label>
            <select value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})} required >
              <option value="">Select Blood Group</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>

          <div className="form-group" style={{gridColumn: '1 / -1', marginBottom: 0}}>
            <label>Home Address</label>
            <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
          </div>

          <div className="form-group" style={{marginBottom: 0}}>
            <label>Emergency Contact Phone</label>
            <input type="tel" value={formData.emergencyPhone} onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})} required />
          </div>

          <div className="form-group" style={{marginBottom: 0}}>
            <label>Primary Disease / Symptom (Optional)</label>
            <input type="text" value={formData.disease} onChange={(e) => setFormData({...formData, disease: e.target.value})} placeholder="e.g. Asthma..." />
          </div>

          <button type="submit" className="submit-btn" style={{gridColumn: '1 / -1', marginTop: '10px'}}>
            Register Patient Account
          </button>

          <p style={{gridColumn: '1 / -1', textAlign: 'center', marginTop: '10px'}}>
            Already have an account? <Link to="/login" style={{color: '#00b4db', fontWeight: 'bold'}}>Login Here</Link>
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;
