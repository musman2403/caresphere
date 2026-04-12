import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './SharedPages.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error | invalid
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase puts the session tokens in the URL hash after clicking the email link.
    // We need to let the supabase client parse it by checking the session.
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        setStatus('invalid');
        setMessage('This reset link is invalid or has expired. Please request a new one.');
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match. Please try again.');
      return;
    }
    if (password.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters long.');
      return;
    }

    setStatus('loading');
    setMessage('');

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus('error');
      setMessage(error.message || 'Failed to update password. Please try again.');
    } else {
      setStatus('success');
      setMessage('Your password has been updated successfully!');
      // Sign out the temporary reset session and redirect to login
      setTimeout(async () => {
        await supabase.auth.signOut();
        navigate('/login');
      }, 2500);
    }
  };

  if (status === 'invalid') {
    return (
      <div className="page-wrapper dark-nav">
        <Navbar />
        <header className="page-header">
          <h1>Invalid Link</h1>
        </header>
        <main className="form-container" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚠️</div>
          <p style={{ color: '#ff4d4d', marginBottom: '20px' }}>{message}</p>
          <Link to="/forgot-password">
            <button className="submit-btn" style={{ maxWidth: '220px', margin: '0 auto' }}>
              Request New Link
            </button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="page-wrapper dark-nav">
        <Navbar />
        <header className="page-header">
          <h1>Password Updated!</h1>
        </header>
        <main className="form-container" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✅</div>
          <h3 style={{ color: '#00b4db', marginBottom: '10px' }}>Success!</h3>
          <p style={{ color: '#555' }}>{message}</p>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Redirecting to login...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrapper dark-nav">
      <Navbar />
      <header className="page-header">
        <h1>Set New Password</h1>
        <p>Choose a strong password for your account.</p>
      </header>

      <main className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              disabled={status === 'loading'}
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
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
            {status === 'loading' ? 'Updating Password...' : 'Update Password'}
          </button>

          <p style={{ textAlign: 'center' }}>
            <Link to="/login" style={{ color: '#00b4db', fontWeight: 'bold' }}>
              Cancel — Back to Login
            </Link>
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
