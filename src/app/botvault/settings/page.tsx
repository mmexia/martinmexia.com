'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardShell from '../components/DashboardShell';

export default function SettingsPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch('/api/botvault/auth/me')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setUsername(data.user.username);
        setEmail(data.user.email);
      })
      .catch(() => router.push('/botvault/login'));
  }, [router]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(''); setProfileErr(''); setProfileSaving(true);
    const res = await fetch('/api/botvault/settings/profile', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email }),
    });
    const data = await res.json();
    if (res.ok) setProfileMsg('Profile updated successfully');
    else setProfileErr(data.error || 'Failed to update profile');
    setProfileSaving(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(''); setPwErr(''); setPwSaving(true);
    if (newPassword !== confirmPassword) {
      setPwErr('Passwords do not match');
      setPwSaving(false);
      return;
    }
    const res = await fetch('/api/botvault/settings/password', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      setPwMsg('Password changed successfully');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } else {
      setPwErr(data.error || 'Failed to change password');
    }
    setPwSaving(false);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    const res = await fetch('/api/botvault/settings/account', { method: 'DELETE' });
    if (res.ok) {
      router.push('/botvault/login');
    }
    setDeleting(false);
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '0.625rem 0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.875rem' };
  const sectionStyle: React.CSSProperties = { background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' };

  return (
    <DashboardShell>
      <div className="bv-dashboard">
        <h2 style={{ marginBottom: '1.5rem' }}>Settings</h2>

        {/* Profile Section */}
        <div style={sectionStyle}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Profile</h3>
          {profileMsg && <div style={{ color: '#22c55e', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{profileMsg}</div>}
          {profileErr && <div className="bv-error">{profileErr}</div>}
          <form onSubmit={handleProfileSave}>
            <div className="bv-form-group">
              <label>Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} required />
            </div>
            <div className="bv-form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
            </div>
            <button type="submit" className="bv-submit-btn" style={{ width: 'auto', padding: '0.5rem 1.25rem' }} disabled={profileSaving}>
              {profileSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Security Section */}
        <div style={sectionStyle}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Security</h3>
          {pwMsg && <div style={{ color: '#22c55e', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{pwMsg}</div>}
          {pwErr && <div className="bv-error">{pwErr}</div>}
          <form onSubmit={handlePasswordChange}>
            <div className="bv-form-group">
              <label>Current Password</label>
              <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={inputStyle} required />
            </div>
            <div className="bv-form-group">
              <label>New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputStyle} required minLength={8} />
            </div>
            <div className="bv-form-group">
              <label>Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={inputStyle} required />
            </div>
            <button type="submit" className="bv-submit-btn" style={{ width: 'auto', padding: '0.5rem 1.25rem' }} disabled={pwSaving}>
              {pwSaving ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div style={{ ...sectionStyle, borderColor: '#ef4444' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#ef4444' }}>Danger Zone</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button className="bv-submit-btn" style={{ width: 'auto', padding: '0.5rem 1.25rem', background: '#ef4444' }}
            onClick={() => setShowDeleteModal(true)}>
            Delete Account
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
            onClick={e => { if (e.target === e.currentTarget) { setShowDeleteModal(false); setDeleteText(''); } }}>
            <div className="bv-auth-card" style={{ maxWidth: '440px', textAlign: 'center' }}>
              <h1 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#ef4444' }}>Delete Account</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                This will permanently delete your account, keys, bots, tokens, and all associated data. Type <strong>DELETE</strong> to confirm.
              </p>
              <input value={deleteText} onChange={e => setDeleteText(e.target.value)} placeholder='Type "DELETE" to confirm'
                style={{ ...inputStyle, textAlign: 'center', marginBottom: '1rem' }} />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="bv-action-btn" style={{ flex: 1 }} onClick={() => { setShowDeleteModal(false); setDeleteText(''); }}>Cancel</button>
                <button className="bv-submit-btn" style={{ flex: 1, background: '#ef4444' }}
                  disabled={deleteText !== 'DELETE' || deleting}
                  onClick={handleDeleteAccount}>
                  {deleting ? 'Deleting...' : 'Delete Forever'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
