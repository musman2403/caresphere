import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './SharedPages.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setStatus('error');
      setMessage(error.message || 'Failed to send reset email. Please try again.');
    } else {
      setStatus('success');
      setMessage(`A password reset link has been sent to ${email}. Please check your inbox.`);
    }
  };

  return (
    <div className="page-wrapper dark-nav">
      <Navbar />
      <header className="page-header">
        <h1>Reset Password</h1>
        <p>Enter your email and we'll send you a reset link.</p>
      </header>

      <main className="form-container">
        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '30px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📧</div>
            <h3 style={{ color: '#00b4db', marginBottom: '10px' }}>Check your inbox!</h3>
            <p style={{ color: '#555', marginBottom: '20px' }}>{message}</p>
            <Link to="/login">
              <button className="submit-btn" style={{ maxWidth: '200px', margin: '0 auto' }}>
                Back to Login
              </button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
                disabled={status === 'loading'}
              />
            </div>

            {status === 'error' && (
              <p style={{
                color: '#ff4d4d',
                marginBottom: '15px',
                textAlign: 'center',
                padding: '10px',
                background: 'rgba(255,77,77,0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(255,77,77,0.3)'
              }}>
                {message}
              </p>
            )}

            <button
              type="submit"
              className="submit-btn"
              disabled={status === 'loading'}
              style={{ marginBottom: '15px' }}
            >
              {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
            </button>

            <p style={{ textAlign: 'center' }}>
              Remember your password?{' '}
              <Link to="/login" style={{ color: '#00b4db', fontWeight: 'bold' }}>
                Back to Login
              </Link>
            </p>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
