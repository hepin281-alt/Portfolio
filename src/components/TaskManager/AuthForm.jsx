import React, { useState } from 'react';

function AuthForm({ onLogin, onRegister, loading }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [clientError, setClientError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClientError('');

    if (!email || !password) {
      setClientError('Please fill in all required fields.');
      return;
    }

    if (isRegister) {
      if (password.length < 6) {
        setClientError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setClientError('Passwords do not match.');
        return;
      }
      await onRegister(email, password);
    } else {
      await onLogin(email, password);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>{isRegister ? 'Create an Account' : 'Welcome Back'}</h2>
        <p>{isRegister ? 'Register to manage your personal tasks' : 'Sign in to access your task dashboard'}</p>
      </div>

      {clientError && <div className="auth-error-banner">{clientError}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {isRegister && (
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
          {loading ? 'Processing...' : (isRegister ? 'Register' : 'Login')}
        </button>
      </form>

      <div className="auth-toggle">
        {isRegister ? (
          <p>
            Already have an account?{' '}
            <button
              type="button"
              className="toggle-link"
              onClick={() => { setIsRegister(false); setClientError(''); }}
            >
              Sign In
            </button>
          </p>
        ) : (
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="toggle-link"
              onClick={() => { setIsRegister(true); setClientError(''); }}
            >
              Create Account
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthForm;
