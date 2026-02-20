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
  const [showDropdown, setShowDropdown] = useState(false);
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
        <h2>Connections</h2>
        <div style={{ position: 'relative' }}>
          <button className="bv-btn bv-btn-primary" onClick={() => setShowDropdown(!showDropdown)}>
            + Connect Service
          </button>
          {showDropdown && (
            <div style={{
              position: 'absolute', right: 0, top: '100%', marginTop: 4,
              background: 'var(--card-bg)', border: '1px solid var(--border)',
              borderRadius: 8, padding: 4, zIndex: 10, minWidth: 180,
            }}>
              <a
                href="/api/botvault/oauth/google"
                style={{
                  display: 'block', padding: '8px 12px', borderRadius: 6,
                  color: 'var(--text-primary)', textDecoration: 'none',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover-bg)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                🔵 Google
              </a>
            </div>
          )}
        </div>
      </div>

      {error && <div className="bv-error">{error}</div>}

      {loading ? (
        <div style={{ color: 'var(--text-secondary)', padding: 40, textAlign: 'center' }}>Loading...</div>
      ) : connections.length === 0 ? (
        <div className="bv-empty-state">
          <p>🔗</p>
          <p>No connections yet. Connect a service to get started.</p>
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
