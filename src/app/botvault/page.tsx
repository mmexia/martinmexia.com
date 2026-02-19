'use client';

import DashboardShell from './components/DashboardShell';

export default function BotVaultDashboard() {
  return (
    <DashboardShell>
      <div className="bv-dashboard">
        <h2>Dashboard</h2>
        
        <div className="bv-stats-grid">
          <div className="bv-stat-card">
            <div className="label">Credentials</div>
            <div className="value">0</div>
          </div>
          <div className="bv-stat-card">
            <div className="label">Bots</div>
            <div className="value">0</div>
          </div>
          <div className="bv-stat-card">
            <div className="label">Active Tokens</div>
            <div className="value">0</div>
          </div>
          <div className="bv-stat-card">
            <div className="label">Audit Events</div>
            <div className="value">0</div>
          </div>
        </div>

        <div className="bv-quick-actions">
          <button className="bv-action-btn">+ Add Credential</button>
          <button className="bv-action-btn">+ Register Bot</button>
        </div>

        <div className="bv-section-title">Recent Activity</div>
        <div className="bv-empty-state">
          No activity yet. Add your first credential or register a bot to get started.
        </div>
      </div>
    </DashboardShell>
  );
}
