'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardShell from '../components/DashboardShell';

interface Credential {
  id: string;
  label: string;
  type: string;
  created_at: string;
}

const TYPES = ['API Key', 'Secret', 'Token', 'OAuth', 'Custom'];

export default function CredentialsPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ label: '', type: 'API Key', value: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchCredentials = useCallback(async () => {
    const res = await fetch('/api/botvault/credentials');
    if (res.ok) {
      const data = await res.json();
      setCredentials(data.credentials);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchCredentials(); }, [fetchCredentials]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const url = editId ? `/api/botvault/credentials/${editId}` : '/api/botvault/credentials';
    const method = editId ? 'PUT' : 'POST';
    const body: Record<string, string> = { label: form.label, type: form.type };
    if (form.value) body.value = form.value;

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Something went wrong');
      setSaving(false);
      return;
    }

    setSaving(false);
    setShowModal(false);
    setEditId(null);
    setForm({ label: '', type: 'API Key', value: '' });
    fetchCredentials();
  };

  const handleReveal = async (id: string) => {
    if (revealed[id]) {
      setRevealed(prev => { const n = { ...prev }; delete n[id]; return n; });
      return;
    }
    const res = await fetch(`/api/botvault/credentials/${id}`);
    if (res.ok) {
      const data = await res.json();
      setRevealed(prev => ({ ...prev, [id]: data.value }));
    }
  };

  const handleCopy = async (id: string) => {
    let value = revealed[id];
    if (!value) {
      const res = await fetch(`/api/botvault/credentials/${id}`);
      if (res.ok) {
        const data = await res.json();
        value = data.value;
      }
    }
    if (value) {
      await navigator.clipboard.writeText(value);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/botvault/credentials/${id}`, { method: 'DELETE' });
    setDeleteConfirm(null);
    setRevealed(prev => { const n = { ...prev }; delete n[id]; return n; });
    fetchCredentials();
  };

  const openEdit = (cred: Credential) => {
    setEditId(cred.id);
    setForm({ label: cred.label, type: cred.type, value: '' });
    setError('');
    setShowModal(true);
  };

  const openCreate = () => {
    setEditId(null);
    setForm({ label: '', type: 'API Key', value: '' });
    setError('');
    setShowModal(true);
  };

  return (
    <DashboardShell>
      <div className="bv-dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>Credentials</h2>
          <button className="bv-submit-btn" style={{ width: 'auto', padding: '0.5rem 1.25rem' }} onClick={openCreate}>
            + Add Credential
          </button>
        </div>

        {loading ? (
          <div className="bv-empty-state">Loading...</div>
        ) : credentials.length === 0 ? (
          <div className="bv-empty-state">No credentials yet. Add your first credential to get started.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Label</th>
                  <th style={{ padding: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                  <th style={{ padding: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Value</th>
                  <th style={{ padding: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Created</th>
                  <th style={{ padding: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {credentials.map(cred => (
                  <tr key={cred.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{cred.label}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'var(--border)', borderRadius: '4px' }}>{cred.type}</span>
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', fontFamily: 'monospace', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {revealed[cred.id] ? revealed[cred.id] : '••••••••••••'}
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {new Date(cred.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="bv-action-btn" onClick={() => handleReveal(cred.id)} title={revealed[cred.id] ? 'Hide' : 'Reveal'}>
                          {revealed[cred.id] ? '🙈' : '👁'}
                        </button>
                        <button className="bv-action-btn" onClick={() => handleCopy(cred.id)} title="Copy">
                          {copied === cred.id ? '✓' : '📋'}
                        </button>
                        <button className="bv-action-btn" onClick={() => openEdit(cred)} title="Edit">✏️</button>
                        <button className="bv-action-btn" onClick={() => setDeleteConfirm(cred.id)} title="Delete" style={{ color: '#ef4444' }}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
            <div className="bv-auth-card" style={{ maxWidth: '480px' }}>
              <h1 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{editId ? 'Edit' : 'Add'} Credential</h1>
              {error && <div className="bv-error">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="bv-form-group">
                  <label>Label</label>
                  <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. OpenAI Production Key" required />
                </div>
                <div className="bv-form-group">
                  <label>Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    style={{ width: '100%', padding: '0.625rem 0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.875rem' }}>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="bv-form-group">
                  <label>{editId ? 'New Value (leave blank to keep current)' : 'Value'}</label>
                  <textarea value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                    placeholder="Paste your secret here..."
                    required={!editId}
                    rows={3}
                    style={{ width: '100%', padding: '0.625rem 0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.875rem', fontFamily: 'monospace', resize: 'vertical' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" className="bv-action-btn" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="bv-submit-btn" style={{ flex: 1 }} disabled={saving}>
                    {saving ? 'Saving...' : editId ? 'Update' : 'Add Credential'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteConfirm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
            onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}>
            <div className="bv-auth-card" style={{ maxWidth: '400px', textAlign: 'center' }}>
              <h1 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Delete Credential?</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                This action cannot be undone. The credential will be permanently deleted.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="bv-action-btn" style={{ flex: 1 }} onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="bv-submit-btn" style={{ flex: 1, background: '#ef4444' }} onClick={() => handleDelete(deleteConfirm)}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
