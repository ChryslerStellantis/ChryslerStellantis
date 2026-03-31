import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await api.auth.login(email, password);
      localStorage.setItem('token', token);
      const safeUser = user && typeof user === 'object' ? user : {};
      localStorage.setItem('user', JSON.stringify(safeUser));
      navigate(safeUser.role === 'admin' ? '/admin' : '/');
      window.location.reload();
    } catch (e) {
      setError(e.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '48px 0', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <h1 style={{ marginBottom: 24 }}>Sign In</h1>
        {error && <p style={{ color: 'crimson', marginBottom: 16 }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
      </div>
    </div>
  );
}
