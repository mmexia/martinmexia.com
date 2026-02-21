'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardShell from '../components/DashboardShell';

interface AuditEntry {
  id: string;
  user_id: string;
  bot_id: string | null;
  action: string;
  target_type: string;
  target_id: string;
  metadata: string;
  created_at: string;
  username: string;
  bot_name: string | null;
}

const ACTION_TYPES = [
  '',
  'credential.create',
  'credential.read',
  'credential.update',
  'credential.delete',
  'bot.create',
  'bot.update',
  'bot.delete',
  'bot.token_generate',
  'bot.token_revoke',
  'user.login',
  'user.profile_update',
  'user.password_change',
];

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionFilter, setActionFilter] = useState('');
  const [actorFilter, setActorFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (actionFilter) params.set('action', actionFilter);
    if (actorFilter) params.set('actor', actorFilter);
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);

    const res = await fetch(`/api/botvault/audit-log?${params}`);
    if (res.ok) {
      const data = await res.json();
      setEntries(data.entries);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    }
    setLoading(false);
  }, [page, actionFilter, actorFilter, dateFrom, dateTo]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const handleFilter = () => { setPage(1); fetchEntries(); };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatAction = (action: string) => {
    return action.replace('.', ' › ').replace(/_/g, ' ');
  };

  const parseMetadata = (m: string) => {
    try {
      const obj = JSON.parse(m);
      return Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join(', ');
    } catch { return m || '—'; }
  };

  const thStyle: React.CSSProperties = { padding: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' };
  const tdStyle: React.CSSProperties = { padding: '0.75rem', fontSize: '0.875rem' };
  const inputStyle: React.CSSProperties = { padding: '0.5rem 0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.875rem' };

  return (
    <DashboardShell>
      <div className="bv-dashboard">
        <h2 style={{ marginBottom: '1.5rem' }}>Audit Log</h2>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Action</label>
            <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} style={{ ...inputStyle, minWidth: '160px' }}>
              <option value="">All actions</option>
              {ACTION_TYPES.filter(Boolean).map(a => <option key={a} value={a}>{formatAction(a)}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Search actor</label>
            <input value={actorFilter} onChange={e => setActorFilter(e.target.value)} placeholder="Username or bot name" style={{ ...inputStyle, minWidth: '160px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>From</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>To</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={inputStyle} />
          </div>
          <button className="bv-submit-btn" style={{ width: 'auto', padding: '0.5rem 1.25rem', height: 'fit-content' }} onClick={handleFilter}>Filter</button>
        </div>

        {loading ? (
          <div className="bv-empty-state">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="bv-empty-state">No audit log entries found.</div>
        ) : (
          <>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              {total} {total === 1 ? 'entry' : 'entries'} found
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={thStyle}>Timestamp</th>
                    <th style={thStyle}>Action</th>
                    <th style={thStyle}>Actor</th>
                    <th style={thStyle}>Target</th>
                    <th style={thStyle}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(entry => (
                    <tr key={entry.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ ...tdStyle, color: 'var(--text-secondary)', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>{formatDate(entry.created_at)}</td>
                      <td style={tdStyle}>
                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'var(--border)', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                          {formatAction(entry.action)}
                        </span>
                      </td>
                      <td style={tdStyle}>{entry.bot_name || entry.username || '—'}</td>
                      <td style={{ ...tdStyle, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {entry.target_type ? `${entry.target_type}` : '—'}
                      </td>
                      <td style={{ ...tdStyle, fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {parseMetadata(entry.metadata)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="bv-action-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} style={{ opacity: page <= 1 ? 0.5 : 1 }}>
                ← Prev
              </button>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Page {page} of {totalPages}
              </span>
              <button className="bv-action-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ opacity: page >= totalPages ? 0.5 : 1 }}>
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
