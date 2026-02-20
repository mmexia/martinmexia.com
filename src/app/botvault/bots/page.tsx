'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardShell from '../components/DashboardShell';

interface Bot {
  id: string;
  name: string;
  description: string | null;
  is_active: number;
  created_at: string;
  permission_count: number;
}

interface Permission {
  id: string;
  credential_id: string;
  level: string;
  label: string;
  type: string;
}

interface Token {
  id: string;
  truncated_hash: string;
  expires_at: string;
  created_at: string;
}

interface Credential {
  id: string;
  label: string;
  type: string;
}

export default function BotsPage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [createdSecret, setCreatedSecret] = useState('');
  const [createdBotName, setCreatedBotName] = useState('');
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [expandedBot, setExpandedBot] = useState<string | null>(null);
  const [botDetail, setBotDetail] = useState<{ permissions: Permission[]; tokens: Token[] } | null>(null);
  const [allCredentials, setAllCredentials] = useState<Credential[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenTtl, setTokenTtl] = useState('90d');
  const [generatedToken, setGeneratedToken] = useState('');
  const [showGeneratedToken, setShowGeneratedToken] = useState(false);
  const [copied, setCopied] = useState('');

  const fetchBots = useCallback(async () => {
    const res = await fetch('/api/botvault/bots');
    if (res.ok) {
      const data = await res.json();
      setBots(data.bots);
    }
    setLoading(false);
  }, []);

  const fetchCredentials = useCallback(async () => {
    const res = await fetch('/api/botvault/credentials');
    if (res.ok) {
      const data = await res.json();
      setAllCredentials(data.credentials);
    }
  }, []);

  useEffect(() => { fetchBots(); fetchCredentials(); }, [fetchBots, fetchCredentials]);

  const fetchBotDetail = async (botId: string) => {
    const res = await fetch(`/api/botvault/bots/${botId}`);
    if (res.ok) {
      const data = await res.json();
      setBotDetail({ permissions: data.permissions, tokens: data.tokens });
    }
  };

  const toggleExpand = async (botId: string) => {
    if (expandedBot === botId) {
      setExpandedBot(null);
      setBotDetail(null);
    } else {
      setExpandedBot(botId);
      await fetchBotDetail(botId);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const res = await fetch('/api/botvault/bots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Something went wrong');
      setSaving(false);
      return;
    }
    setSaving(false);
    setShowCreateModal(false);
    setCreatedSecret(data.secret);
    setCreatedBotName(data.name);
    setShowSecretModal(true);
    setForm({ name: '', description: '' });
    fetchBots();
  };

  const handleToggleActive = async (bot: Bot) => {
    await fetch(`/api/botvault/bots/${bot.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !bot.is_active }),
    });
    fetchBots();
    if (expandedBot === bot.id) fetchBotDetail(bot.id);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/botvault/bots/${id}`, { method: 'DELETE' });
    setDeleteConfirm(null);
    if (expandedBot === id) { setExpandedBot(null); setBotDetail(null); }
    fetchBots();
  };

  const handlePermissionToggle = async (botId: string, credentialId: string, currentPerms: Permission[]) => {
    const exists = currentPerms.find(p => p.credential_id === credentialId);
    let newPerms: { credential_id: string; level: string }[];
    if (exists) {
      newPerms = currentPerms.filter(p => p.credential_id !== credentialId).map(p => ({ credential_id: p.credential_id, level: p.level }));
    } else {
      newPerms = [...currentPerms.map(p => ({ credential_id: p.credential_id, level: p.level })), { credential_id: credentialId, level: 'read' }];
    }
    await fetch(`/api/botvault/bots/${botId}/permissions`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credentials: newPerms }),
    });
    fetchBotDetail(botId);
    fetchBots();
  };

  const handleGenerateToken = async (botId: string) => {
    const res = await fetch(`/api/botvault/bots/${botId}/tokens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ttl: tokenTtl }),
    });
    if (res.ok) {
      const data = await res.json();
      setGeneratedToken(data.token);
      setShowTokenModal(false);
      setShowGeneratedToken(true);
      fetchBotDetail(botId);
    }
  };

  const handleRevokeToken = async (botId: string, tokenId: string) => {
    await fetch(`/api/botvault/bots/${botId}/tokens/${tokenId}`, { method: 'DELETE' });
    fetchBotDetail(botId);
  };

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const formatDate = (d: string) => {
    if (d.startsWith('9999')) return 'Never';
    return new Date(d).toLocaleDateString();
  };

  return (
    <DashboardShell>
      <div className="bv-dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>Bots</h2>
          <button className="bv-submit-btn" style={{ width: 'auto', padding: '0.5rem 1.25rem' }} onClick={() => { setError(''); setShowCreateModal(true); }}>
            + Register Bot
          </button>
        </div>

        {loading ? (
          <div className="bv-empty-state">Loading...</div>
        ) : bots.length === 0 ? (
          <div className="bv-empty-state">No bots yet. Register your first bot to get started.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bots.map(bot => (
              <div key={bot.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                {/* Bot Card Header */}
                <div
                  style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onClick={() => toggleExpand(bot.id)}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 600 }}>{bot.name}</span>
                      <span style={{
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '9999px',
                        background: bot.is_active ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                        color: bot.is_active ? '#22c55e' : '#ef4444',
                        fontWeight: 500,
                      }}>
                        {bot.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {bot.description && <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{bot.description}</p>}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span>🔑 {bot.permission_count} credential{bot.permission_count !== 1 ? 's' : ''}</span>
                      <span>📅 {new Date(bot.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', transition: 'transform 0.2s', transform: expandedBot === bot.id ? 'rotate(180deg)' : 'none' }}>▾</span>
                </div>

                {/* Expanded Detail */}
                {expandedBot === bot.id && botDetail && (
                  <div style={{ borderTop: '1px solid var(--border)', padding: '1.25rem' }}>
                    {/* Toggle & Delete */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      <button
                        className="bv-action-btn"
                        style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                        onClick={(e) => { e.stopPropagation(); handleToggleActive(bot); }}
                      >
                        {bot.is_active ? '⏸ Deactivate' : '▶ Activate'}
                      </button>
                      <button
                        className="bv-action-btn"
                        style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', color: '#ef4444' }}
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirm(bot.id); }}
                      >
                        🗑 Delete
                      </button>
                    </div>

                    {/* Permissions Section */}
                    <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Credential Permissions</h4>
                    {allCredentials.length === 0 ? (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No credentials available. Add credentials first.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        {allCredentials.map(cred => {
                          const hasPermission = botDetail.permissions.some(p => p.credential_id === cred.id);
                          return (
                            <label key={cred.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer', background: hasPermission ? 'rgba(59,130,246,0.1)' : 'transparent', border: '1px solid var(--border)' }}>
                              <input
                                type="checkbox"
                                checked={hasPermission}
                                onChange={() => handlePermissionToggle(bot.id, cred.id, botDetail.permissions)}
                                style={{ accentColor: '#3b82f6' }}
                              />
                              <span style={{ fontSize: '0.875rem' }}>{cred.label}</span>
                              <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', background: 'var(--border)', borderRadius: '4px', marginLeft: 'auto' }}>{cred.type}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* Tokens Section */}
                    <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Access Tokens</h4>
                    <button
                      className="bv-submit-btn"
                      style={{ width: 'auto', padding: '0.4rem 1rem', fontSize: '0.8rem', marginBottom: '0.75rem' }}
                      onClick={() => { setTokenTtl('90d'); setShowTokenModal(true); }}
                    >
                      + Generate Token
                    </button>
                    {botDetail.tokens.length === 0 ? (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No tokens yet.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {botDetail.tokens.map(token => (
                          <div key={token.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
                            <code style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{token.truncated_hash}</code>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Created {formatDate(token.created_at)}</span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Expires {formatDate(token.expires_at)}</span>
                            <button
                              className="bv-action-btn"
                              style={{ marginLeft: 'auto', color: '#ef4444', fontSize: '0.8rem' }}
                              onClick={() => handleRevokeToken(bot.id, token.id)}
                            >
                              Revoke
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create Bot Modal */}
        {showCreateModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowCreateModal(false); }}>
            <div className="bv-auth-card" style={{ maxWidth: '480px' }}>
              <h1 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Register Bot</h1>
              {error && <div className="bv-error">{error}</div>}
              <form onSubmit={handleCreate}>
                <div className="bv-form-group">
                  <label>Name</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. My Discord Bot" required />
                </div>
                <div className="bv-form-group">
                  <label>Description</label>
                  <textarea
                    value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="What does this bot do?"
                    rows={3}
                    style={{ width: '100%', padding: '0.625rem 0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.875rem', resize: 'vertical' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" className="bv-action-btn" style={{ flex: 1 }} onClick={() => setShowCreateModal(false)}>Cancel</button>
                  <button type="submit" className="bv-submit-btn" style={{ flex: 1 }} disabled={saving}>
                    {saving ? 'Creating...' : 'Register Bot'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Secret Display Modal */}
        {showSecretModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="bv-auth-card" style={{ maxWidth: '520px' }}>
              <h1 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>🔑 Bot Secret</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Your bot <strong>{createdBotName}</strong> has been created. Copy the secret below — <span style={{ color: '#ef4444', fontWeight: 600 }}>this won&apos;t be shown again</span>.
              </p>
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all', marginBottom: '1rem', position: 'relative' }}>
                {createdSecret}
                <button
                  className="bv-action-btn"
                  style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', fontSize: '0.8rem' }}
                  onClick={() => copyToClipboard(createdSecret, 'secret')}
                >
                  {copied === 'secret' ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
              <button className="bv-submit-btn" style={{ width: '100%' }} onClick={() => { setShowSecretModal(false); setCreatedSecret(''); }}>
                I&apos;ve saved the secret
              </button>
            </div>
          </div>
        )}

        {/* Token TTL Modal */}
        {showTokenModal && expandedBot && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowTokenModal(false); }}>
            <div className="bv-auth-card" style={{ maxWidth: '400px' }}>
              <h1 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Generate Access Token</h1>
              <div className="bv-form-group">
                <label>Token Expiry</label>
                <select value={tokenTtl} onChange={e => setTokenTtl(e.target.value)}
                  style={{ width: '100%', padding: '0.625rem 0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.875rem' }}>
                  <option value="30d">30 days</option>
                  <option value="90d">90 days</option>
                  <option value="1y">1 year</option>
                  <option value="never">Never expires</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="bv-action-btn" style={{ flex: 1 }} onClick={() => setShowTokenModal(false)}>Cancel</button>
                <button className="bv-submit-btn" style={{ flex: 1 }} onClick={() => handleGenerateToken(expandedBot)}>Generate</button>
              </div>
            </div>
          </div>
        )}

        {/* Generated Token Display */}
        {showGeneratedToken && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="bv-auth-card" style={{ maxWidth: '520px' }}>
              <h1 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>🎟️ Access Token</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Copy this token — <span style={{ color: '#ef4444', fontWeight: 600 }}>it won&apos;t be shown again</span>.
              </p>
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.7rem', wordBreak: 'break-all', marginBottom: '1rem', position: 'relative', maxHeight: '120px', overflow: 'auto' }}>
                {generatedToken}
                <button
                  className="bv-action-btn"
                  style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', fontSize: '0.8rem' }}
                  onClick={() => copyToClipboard(generatedToken, 'token')}
                >
                  {copied === 'token' ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
              <button className="bv-submit-btn" style={{ width: '100%' }} onClick={() => { setShowGeneratedToken(false); setGeneratedToken(''); }}>
                I&apos;ve saved the token
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteConfirm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
            onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}>
            <div className="bv-auth-card" style={{ maxWidth: '400px', textAlign: 'center' }}>
              <h1 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Delete Bot?</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                This will permanently delete the bot, all its permissions, and all access tokens. This cannot be undone.
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
