import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isAdminUser } from '../utils/adminPortal';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await login({ email, password });
      navigate(isAdminUser(response.user) ? '/account' : '/');
    } catch (err) {
      setError(err.message || 'Sign in failed. Check your email and password.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!loading && isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  return (
    <div className="auth-page">
      <div className="auth-panel-brand">
        <h2>Welcome back</h2>
        <p>Sign in to track orders, save favourites, and checkout faster.</p>
        <ul>
          <li><CheckCircle2 size={18} /> Order tracking and history</li>
          <li><CheckCircle2 size={18} /> Saved wishlist across devices</li>
          <li><CheckCircle2 size={18} /> Faster checkout with saved details</li>
        </ul>
      </div>

      <div className="auth-panel-form">
        <div className="auth-form-wrap">
          <div className="form-card">
            <div className="form-header">
              <h1>Sign in</h1>
              <p>Enter your credentials to access your account.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  className="form-input"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                {submitting ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {error && <div className="form-error">{error}</div>}

              <div className="form-footer">
                No account? <Link to="/register">Create one</Link>
              </div>
              <div className="form-footer">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
              <div className="form-footer auth-admin-note">
                Store admin? Use the{' '}
                <a href="http://localhost:8087/admin/login">admin console login</a>
                {' '}(port 8087) — separate from customer sign-in here.
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
