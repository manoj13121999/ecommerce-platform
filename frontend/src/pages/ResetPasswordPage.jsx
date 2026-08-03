import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/client';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';
  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      const response = await authApi.resetPassword({ token, newPassword });
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
        <h2>Create a new password</h2>
        <p>Paste the reset token from your email or database and choose a new password.</p>
      </div>
      <div className="auth-panel-form">
        <div className="auth-form-wrap">
          <div className="form-card">
            <div className="form-header">
              <h1>Reset password</h1>
              <p>Password must be at least 8 characters.</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="token">Reset token</label>
                <input
                  id="token"
                  className="form-input"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New password</label>
                <input
                  id="newPassword"
                  className="form-input"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                {submitting ? 'Updating...' : 'Update password'}
              </button>
            </form>
            {message && (
              <div className="form-success">
                {message} <Link to="/login">Sign in now</Link>
              </div>
            )}
            {error && <div className="form-error">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
