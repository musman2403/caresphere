import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './SharedPages.css';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(email, password);
    if (!res.success) {
      setError(res.message);
      setLoading(false);
    }
    // No navigate here - the useEffect will handle it once the user state is updated in context
  };

  return (
    <div className="page-wrapper dark-nav">
      <Navbar />
      <header className="page-header">
        <h1>CareSphere Login</h1>
        <p>Welcome back! Please login to your account.</p>
      </header>

      <main className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p style={{color: 'red', marginBottom: '15px'}}>{error}</p>}

          <button type="submit" className="submit-btn" disabled={loading} style={{marginBottom: '15px'}}>
            {loading ? 'Authenticating...' : 'Login'}
          </button>

          <p style={{textAlign: 'center'}}>
            Don't have an account? <Link to="/signup" style={{color: '#00b4db', fontWeight: 'bold'}}>Sign Up</Link>
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
