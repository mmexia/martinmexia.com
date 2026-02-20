'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardShell from '../components/DashboardShell';

interface Connection {
  id: string;
  label: string;
  provider: string;
  email: string;
  scopes: string;
  connected_at: string;
  status: string;
}

const SCOPE_LABELS: Record<string, string> = {
  'gmail.modify': 'Gmail',
  'calendar': 'Calendar',
  'drive': 'Drive',
  'contacts': 'Contacts',
  'spreadsheets': 'Sheets',
  'documents': 'Docs',
};

function abbreviateScopes(scopes: string): string {
  if (!scopes) return '';
  const labels: string[] = [];
  for (const [key, label] of Object.entries(SCOPE_LABELS)) {
    if (scopes.includes(key)) labels.push(label);
  }
  return labels.join(', ') || scopes;
}

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchConnections = useCallback(async () => {
    const res = await fetch('/api/botvault/connections');
    if (res.ok) {
      const data = await res.json();
      setConnections(data.connections);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchConnections(); }, [fetchConnections]);

  const handleDisconnect = async (id: string) => {
    setDisconnecting(id);
    setError('');
    const res = await fetch('/api/botvault/oauth/google/disconnect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credentialId: id }),
    });
    if (res.ok) {
      setConnections(prev => prev.filter(c => c.id !== id));
    } else {
      setError('Failed to disconnect');
    }
    setDisconnecting(null);
    setConfirmId(null);
  };

  const handleRefresh = async (id: string) => {
    setRefreshing(id);
    setError('');
    const res = await fetch(`/api/botvault/connections/${id}/refresh`, { method: 'POST' });
    if (res.ok) {
      await fetchConnections();
    } else {
      setError('Failed to refresh token');
    }
    setRefreshing(null);
  };

  return (
    <DashboardShell>
      <div className="bv-page-header">
        <h2>Google Accounts</h2>
      </div>

      {error && <div className="bv-error">{error}</div>}

      {loading ? (
        <div style={{ color: 'var(--text-secondary)', padding: 40, textAlign: 'center' }}>Loading...</div>
      ) : connections.length === 0 ? (
        <div className="bv-empty-state">
          <p>No Google accounts yet. Connect your Google account to get started.</p>
          <a
            href="/api/botvault/oauth/google"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px',
              borderRadius: 20, color: '#1f1f1f', textDecoration: 'none',
              background: '#fff', border: '1px solid #dadce0',
              fontFamily: '\'Google Sans\', Roboto, Arial, sans-serif',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
              transition: 'box-shadow 0.2s, background 0.2s',
              marginTop: 12,
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(60,64,67,0.3)'; e.currentTarget.style.background = '#f8f9fa'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = '#fff'; }}
          >
            <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.9 7.35 2.56 10.52l7.97-5.93z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.93C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
            Sign in with Google
          </a>
        </div>
      ) : (
        <div className="bv-grid">
          {connections.map(conn => (
            <div key={conn.id} className="bv-card">
              <div className="bv-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 24 }}>🔵</span>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Google</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{conn.email}</div>
                  </div>
                </div>
                <span style={{
                  fontSize: 12, padding: '2px 8px', borderRadius: 12,
                  background: conn.status === 'active' ? 'rgba(0,200,100,0.15)' : 'rgba(255,60,60,0.15)',
                  color: conn.status === 'active' ? '#00c864' : '#ff3c3c',
                }}>
                  {conn.status === 'active' ? 'Active ✅' : 'Expired 🔴'}
                </span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '8px 0' }}>
                {abbreviateScopes(conn.scopes)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                Connected {new Date(conn.connected_at).toLocaleDateString()}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {conn.status === 'expired' && (
                  <button
                    className="bv-btn bv-btn-secondary"
                    onClick={() => handleRefresh(conn.id)}
                    disabled={refreshing === conn.id}
                  >
                    {refreshing === conn.id ? 'Refreshing...' : '🔄 Refresh'}
                  </button>
                )}
                {confirmId === conn.id ? (
                  <>
                    <button
                      className="bv-btn bv-btn-danger"
                      onClick={() => handleDisconnect(conn.id)}
                      disabled={disconnecting === conn.id}
                    >
                      {disconnecting === conn.id ? 'Disconnecting...' : 'Confirm'}
                    </button>
                    <button className="bv-btn bv-btn-secondary" onClick={() => setConfirmId(null)}>Cancel</button>
                  </>
                ) : (
                  <button className="bv-btn bv-btn-danger" onClick={() => setConfirmId(conn.id)}>
                    Disconnect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
