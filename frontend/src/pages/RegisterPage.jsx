import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/client';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [error, setError] = useState('');

  function updateField(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      const response = await authApi.register(form);
      localStorage.setItem('accessToken', response.accessToken);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 420 }}>
      <h1>Create account</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="First name" value={form.firstName} onChange={updateField('firstName')} required />
        <input placeholder="Last name" value={form.lastName} onChange={updateField('lastName')} required />
        <input type="email" placeholder="Email" value={form.email} onChange={updateField('email')} required />
        <input type="password" placeholder="Password (min 8 chars)" value={form.password} onChange={updateField('password')} required />
        <input placeholder="Phone (optional)" value={form.phone} onChange={updateField('phone')} />
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p style={{ marginTop: '1rem' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
