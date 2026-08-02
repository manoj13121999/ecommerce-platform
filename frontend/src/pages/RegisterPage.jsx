import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function updateField(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-panel-brand">
        <h2>Join ShopVault today</h2>
        <p>Create an account to save items, track orders, and enjoy a personalized experience.</p>
        <ul>
          <li><Sparkles size={18} /> Instant JWT login after signup</li>
          <li><Sparkles size={18} /> Kafka event on registration</li>
          <li><Sparkles size={18} /> Built for real ecommerce flows</li>
        </ul>
      </div>

      <div className="auth-panel-form">
        <div className="auth-form-wrap">
          <div className="form-card">
            <div className="form-header">
              <h1>Create account</h1>
              <p>Fill in your details to get started.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First name</label>
                  <input
                    id="firstName"
                    className="form-input"
                    placeholder="Manoj"
                    value={form.firstName}
                    onChange={updateField('firstName')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last name</label>
                  <input
                    id="lastName"
                    className="form-input"
                    placeholder="Prabhakar"
                    value={form.lastName}
                    onChange={updateField('lastName')}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={updateField('email')}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  className="form-input"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={updateField('password')}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone (optional)</label>
                <input
                  id="phone"
                  className="form-input"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={updateField('phone')}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                {submitting ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            {error && <div className="form-error">{error}</div>}

            <div className="form-footer">
              Already have an account? <Link to="/login">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
