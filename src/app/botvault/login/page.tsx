'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/botvault/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push('/botvault/dashboard');
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bv-auth-container">
      <div className="bv-auth-card">
        <h1>Bot<span>Vault</span></h1>
        <p className="subtitle">Sign in to your vault</p>

        {error && <div className="bv-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="bv-form-group">
            <label>Email or Username</label>
            <input type="text" value={identifier} onChange={e => setIdentifier(e.target.value)} required autoFocus />
          </div>
          <div className="bv-form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="bv-submit-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="bv-auth-links">
          <a href="/botvault/signup">Create account</a> · <a href="/botvault/forgot-password">Forgot password?</a>
        </div>
        <div className="bv-auth-links" style={{ marginTop: '0.5rem' }}>
          <a href="/botvault/about">What is BotVault?</a>
        </div>
      </div>
    </div>
  );
}
