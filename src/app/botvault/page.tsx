'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardShell from './components/DashboardShell';

interface AuditEntry {
  action: string;
  timestamp: string;
  target?: string;
  actor?: string;
}

export default function BotVaultDashboard() {
  const [credentials, setCredentials] = useState<number | null>(null);
  const [bots, setBots] = useState<number | null>(null);
  const [auditEvents, setAuditEvents] = useState<number | null>(null);
  const [recentActivity, setRecentActivity] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [credRes, botRes, auditRes] = await Promise.all([
          fetch('/api/botvault/credentials').then(r => r.ok ? r.json() : []),
          fetch('/api/botvault/bots').then(r => r.ok ? r.json() : []),
          fetch('/api/botvault/audit-log').then(r => r.ok ? r.json() : []),
        ]);
        const credList = Array.isArray(credRes) ? credRes : credRes?.credentials ?? [];
        const botList = Array.isArray(botRes) ? botRes : botRes?.bots ?? [];
        const auditList = Array.isArray(auditRes) ? auditRes : auditRes?.entries ?? auditRes?.events ?? [];
        setCredentials(credList.length);
        setBots(botList.length);
        setAuditEvents(auditList.length);
        setRecentActivity(auditList.slice(-5).reverse());
      } catch {
        setCredentials(0);
        setBots(0);
        setAuditEvents(0);
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const isEmpty = credentials === 0 && bots === 0;

  const steps = [
    {
      num: 1,
      title: 'Register a Bot',
      desc: 'Create the bot that will access your vault.',
      link: '/botvault/bots',
      linkText: '→ Register Bot',
      done: (bots ?? 0) > 0,
    },
    {
      num: 2,
      title: 'Create Access',
      desc: 'Set up what your bot can use:',
      subItems: [
        { text: 'Credentials', detail: 'API keys and secrets to access different services', link: '/botvault/credentials' },
        { text: 'Google Accounts', detail: 'Allow your bot to access your Google workspace', link: '/botvault/connections' },
        { text: 'Cards', detail: 'Give the power to buy to your bot', link: '/botvault/cards' },
      ],
      link: '/botvault/credentials',
      linkText: '→ Set Up Access',
      done: (credentials ?? 0) > 0,
    },
    {
      num: 3,
      title: 'Copy the Skill',
      desc: 'Paste the integration instructions into your bot.',
      link: '/botvault/skills',
      linkText: '→ View Skills',
      done: false,
    },
  ];

  function formatTime(ts: string) {
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return ts;
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="bv-dashboard">
          <h2>Dashboard</h2>
          <div className="bv-empty-state">Loading...</div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="bv-dashboard">
        <h2>Dashboard</h2>

        {isEmpty ? (
          /* ── Empty vault: guided setup ── */
          <div className="bv-setup-guide">
            <div className="bv-setup-header">
              <h3>Welcome to BotVault 🔐</h3>
              <p>Set up your vault in 3 easy steps:</p>
            </div>
            <div className="bv-setup-steps">
              {steps.map((step) => (
                <div key={step.num} className={`bv-setup-card ${step.done ? 'done' : ''}`}>
                  <div className="bv-setup-num">
                    {step.done ? '✓' : step.num}
                  </div>
                  <div className="bv-setup-content">
                    <div className="bv-setup-title">Step {step.num}: {step.title}</div>
                    <div className="bv-setup-desc">{step.desc}</div>
                    {'subItems' in step && step.subItems && (
                      <div className="bv-setup-subitems">
                        {step.subItems.map((item: { text: string; detail: string; link: string }) => (
                          <Link key={item.text} href={item.link} className="bv-setup-subitem">
                            <span className="bv-subitem-name">{item.text}</span>
                            <span className="bv-subitem-detail">{item.detail}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link href={step.link} className="bv-action-btn">
                    {step.linkText}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ── Vault with data ── */
          <>
            <div className="bv-stats-grid">
              <div className="bv-stat-card">
                <div className="label">Credentials</div>
                <div className="value">{credentials}</div>
              </div>
              <div className="bv-stat-card">
                <div className="label">Bots</div>
                <div className="value">{bots}</div>
              </div>
              <div className="bv-stat-card">
                <div className="label">Audit Events</div>
                <div className="value">{auditEvents}</div>
              </div>
            </div>

            <div className="bv-quick-actions">
              <Link href="/botvault/credentials" className="bv-action-btn">+ Add Credential</Link>
              <Link href="/botvault/bots" className="bv-action-btn">+ Register Bot</Link>
            </div>

            <div className="bv-section-title">Recent Activity</div>
            {recentActivity.length === 0 ? (
              <div className="bv-empty-state">
                No activity yet.
              </div>
            ) : (
              <div className="bv-activity-list">
                {recentActivity.map((entry, i) => (
                  <div key={i} className="bv-activity-item">
                    <span className="bv-activity-action">{entry.action}</span>
                    {entry.target && <span className="bv-activity-target">{entry.target}</span>}
                    <span className="bv-activity-time">{formatTime(entry.timestamp)}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardShell>
  );
}
