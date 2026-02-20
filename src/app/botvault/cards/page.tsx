'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardShell from '../components/DashboardShell';

interface CardSummary {
  id: string;
  label: string;
  cardholder_name: string;
  last4: string;
  brand: string;
  expiry_month: string;
  expiry_year: string;
  created_at: string;
}

interface CardFull {
  id: string;
  label: string;
  cardholder_name: string;
  card_number: string;
  expiry_month: string;
  expiry_year: string;
  cvv: string;
}

const BRAND_GRADIENTS: Record<string, string> = {
  Visa: 'linear-gradient(135deg, #1a1f71, #2d3494)',
  Mastercard: 'linear-gradient(135deg, #cc2229, #eb001b)',
  Amex: 'linear-gradient(135deg, #2e77bc, #108168)',
  Discover: 'linear-gradient(135deg, #ff6000, #e85d00)',
  Card: 'linear-gradient(135deg, #333, #555)',
};

const BRAND_ICONS: Record<string, string> = {
  Visa: '𝐕𝐈𝐒𝐀',
  Mastercard: '●●',
  Amex: 'AMEX',
  Discover: 'DISCOVER',
  Card: '💳',
};

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 11 }, (_, i) => String(currentYear + i));
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

function formatCardInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

export default function CardsPage() {
  const [cards, setCards] = useState<CardSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ label: '', cardholder_name: '', card_number: '', expiry_month: '01', expiry_year: String(currentYear), cvv: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState<Record<string, CardFull>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchCards = useCallback(async () => {
    const res = await fetch('/api/botvault/cards');
    if (res.ok) {
      const data = await res.json();
      setCards(data.cards);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchCards(); }, [fetchCards]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const url = editId ? `/api/botvault/cards/${editId}` : '/api/botvault/cards';
    const method = editId ? 'PUT' : 'POST';

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Something went wrong');
      setSaving(false);
      return;
    }

    setSaving(false);
    setShowModal(false);
    setEditId(null);
    setForm({ label: '', cardholder_name: '', card_number: '', expiry_month: '01', expiry_year: String(currentYear), cvv: '' });
    setRevealed({});
    fetchCards();
  };

  const handleReveal = async (id: string) => {
    if (revealed[id]) {
      setRevealed(prev => { const n = { ...prev }; delete n[id]; return n; });
      return;
    }
    const res = await fetch(`/api/botvault/cards/${id}`);
    if (res.ok) {
      const data = await res.json();
      setRevealed(prev => ({ ...prev, [id]: data }));
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/botvault/cards/${id}`, { method: 'DELETE' });
    setDeleteConfirm(null);
    setRevealed(prev => { const n = { ...prev }; delete n[id]; return n; });
    fetchCards();
  };

  const openEdit = async (card: CardSummary) => {
    let full = revealed[card.id];
    if (!full) {
      const res = await fetch(`/api/botvault/cards/${card.id}`);
      if (res.ok) full = await res.json();
    }
    if (full) {
      setEditId(card.id);
      setForm({
        label: card.label,
        cardholder_name: full.cardholder_name,
        card_number: formatCardInput(full.card_number),
        expiry_month: full.expiry_month,
        expiry_year: full.expiry_year,
        cvv: full.cvv,
      });
      setError('');
      setShowModal(true);
    }
  };

  const openCreate = () => {
    setEditId(null);
    setForm({ label: '', cardholder_name: '', card_number: '', expiry_month: '01', expiry_year: String(currentYear), cvv: '' });
    setError('');
    setShowModal(true);
  };

  const cardTileStyle = (brand: string): React.CSSProperties => ({
    background: BRAND_GRADIENTS[brand] || BRAND_GRADIENTS.Card,
    borderRadius: '16px',
    padding: '1.5rem',
    color: '#fff',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    position: 'relative',
    overflow: 'hidden',
  });

  return (
    <DashboardShell>
      <div className="bv-dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>Cards</h2>
          <button className="bv-submit-btn" style={{ width: 'auto', padding: '0.5rem 1.25rem' }} onClick={openCreate}>
            + Add Card
          </button>
        </div>

        {loading ? (
          <div className="bv-empty-state">Loading...</div>
        ) : cards.length === 0 ? (
          <div className="bv-empty-state">No cards yet. Add your first card to get started.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {cards.map(card => {
              const full = revealed[card.id];
              return (
                <div key={card.id}>
                  <div
                    style={cardTileStyle(card.brand)}
                    onClick={() => handleReveal(card.id)}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {card.brand}
                      </span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                        {BRAND_ICONS[card.brand] || '💳'}
                      </span>
                    </div>

                    <div style={{ fontSize: '1.25rem', letterSpacing: '0.15em', fontFamily: 'monospace', margin: '1rem 0' }}>
                      {full
                        ? full.card_number.replace(/(.{4})/g, '$1 ').trim()
                        : `•••• •••• •••• ${card.last4}`}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <div style={{ fontSize: '0.625rem', opacity: 0.7, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Card Holder</div>
                        <div style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {card.cardholder_name}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.625rem', opacity: 0.7, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Expires</div>
                        <div style={{ fontSize: '0.875rem' }}>
                          {card.expiry_month}/{String(card.expiry_year).slice(-2)}
                        </div>
                      </div>
                    </div>

                    {full && (
                      <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>
                        CVV: <span style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}>{full.cvv}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', padding: '0 0.25rem' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{card.label}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="bv-action-btn" onClick={() => openEdit(card)} title="Edit">✏️</button>
                      <button className="bv-action-btn" onClick={() => setDeleteConfirm(card.id)} title="Delete" style={{ color: '#ef4444' }}>🗑</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
            <div className="bv-auth-card" style={{ maxWidth: '480px' }}>
              <h1 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{editId ? 'Edit' : 'Add'} Card</h1>
              {error && <div className="bv-error">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="bv-form-group">
                  <label>Label</label>
                  <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. Personal Visa" required />
                </div>
                <div className="bv-form-group">
                  <label>Cardholder Name</label>
                  <input value={form.cardholder_name} onChange={e => setForm(f => ({ ...f, cardholder_name: e.target.value }))} placeholder="JOHN DOE" required />
                </div>
                <div className="bv-form-group">
                  <label>Card Number</label>
                  <input value={form.card_number} onChange={e => setForm(f => ({ ...f, card_number: formatCardInput(e.target.value) }))} placeholder="4242 4242 4242 4242" maxLength={19} required={!editId} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div className="bv-form-group" style={{ flex: 1 }}>
                    <label>Expiry Month</label>
                    <select value={form.expiry_month} onChange={e => setForm(f => ({ ...f, expiry_month: e.target.value }))}
                      style={{ width: '100%', padding: '0.625rem 0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.875rem' }}>
                      {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="bv-form-group" style={{ flex: 1 }}>
                    <label>Expiry Year</label>
                    <select value={form.expiry_year} onChange={e => setForm(f => ({ ...f, expiry_year: e.target.value }))}
                      style={{ width: '100%', padding: '0.625rem 0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.875rem' }}>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div className="bv-form-group" style={{ flex: 1 }}>
                    <label>CVV</label>
                    <input value={form.cvv} onChange={e => setForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))} placeholder="123" maxLength={4} required={!editId} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" className="bv-action-btn" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="bv-submit-btn" style={{ flex: 1 }} disabled={saving}>
                    {saving ? 'Saving...' : editId ? 'Update' : 'Add Card'}
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
              <h1 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Delete Card?</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                This action cannot be undone. The card will be permanently deleted.
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
