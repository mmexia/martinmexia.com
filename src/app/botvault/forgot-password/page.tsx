'use client';

import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/botvault/auth/recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSuccess('If an account with that email exists, a recovery link has been sent.');
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
        <p className="subtitle">Reset your password</p>

        {error && <div className="bv-error">{error}</div>}
        {success && <div className="bv-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="bv-form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
          </div>
          <button className="bv-submit-btn" type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Recovery Link'}
          </button>
        </form>

        <div className="bv-auth-links">
          <a href="/botvault/login">Back to login</a>
        </div>
      </div>
    </div>
  );
}
