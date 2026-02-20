'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/botvault', label: 'Dashboard', icon: '◆' },
  { href: '/botvault/cards', label: 'Cards', icon: '💳' },
  { href: '/botvault/credentials', label: 'Credentials', icon: '🔑' },
  { href: '/botvault/bots', label: 'Bots', icon: '🤖' },
  { href: '/botvault/connections', label: 'Connections', icon: '🔗' },
  { href: '/botvault/audit', label: 'Audit Log', icon: '📋' },
  { href: '/botvault/settings', label: 'Settings', icon: '⚙️' },
];

interface User {
  id: string;
  username: string;
  email: string;
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/botvault/auth/me')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setUser(data.user); setLoading(false); })
      .catch(() => { router.push('/botvault/login'); });
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/botvault/auth/logout', { method: 'POST' });
    router.push('/botvault/login');
  };

  if (loading) {
    return (
      <div className="bv-auth-container">
        <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="bv-layout">
      <button className="bv-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
      <div className={`bv-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      
      <aside className={`bv-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="bv-sidebar-header">
          <h1>Bot<span>Vault</span></h1>
        </div>
        <nav className="bv-nav">
          {NAV_ITEMS.map(item => (
            <a
              key={item.href}
              href={item.href}
              className={pathname === item.href ? 'active' : ''}
              onClick={() => setSidebarOpen(false)}
            >
              <span>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="bv-sidebar-footer">
          <div className="bv-user-info">
            <span>{user?.username}</span>
            <button className="bv-logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </aside>

      <main className="bv-main">
        {children}
      </main>
    </div>
  );
}
