import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      const response = await authApi.forgotPassword({ email });
      setMessage(response.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-panel-brand">
        <h2>Reset your password</h2>
        <p>Enter your email and we will send reset instructions if the account exists.</p>
      </div>
      <div className="auth-panel-form">
        <div className="auth-form-wrap">
          <div className="form-card">
            <div className="form-header">
              <h1>Forgot password</h1>
              <p>We will help you get back into your account.</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
            {message && <div className="form-success">{message}</div>}
            {error && <div className="form-error">{error}</div>}
            <div className="form-footer">
              Remember your password? <Link to="/login">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
