import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
    if (result.success) navigate('/flow');
    else setError(result.error);
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-card glass-card">
        {/* Header */}
        <div className="auth-card__header">
          <div className="auth-card__icon">🔐</div>
          <h1 className="auth-card__title">Welcome Back</h1>
          <p className="auth-card__subtitle">Sign in to access the 3DS Flow Explorer</p>
        </div>

        {/* Error */}
        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form" id="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg auth-submit" id="login-submit-btn" disabled={loading}>
            {loading ? <><span className="spinner" /> Signing in...</> : '🔓 Sign In'}
          </button>
        </form>

        <p className="auth-card__footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">Create one free</Link>
        </p>

        {/* Demo credentials hint */}
        <div className="auth-demo">
          <span>Demo: any email + password (6+ chars)</span>
        </div>
      </div>
    </div>
  );
}

// v2 - added demo credentials hint