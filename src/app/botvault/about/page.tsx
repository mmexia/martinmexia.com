import Link from 'next/link';
import '../botvault.css';

export default function AboutBotVault() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        maxWidth: 800, margin: '0 auto', padding: '1.5rem 1rem 0',
        fontSize: '0.875rem',
      }}>
        <Link href="/botvault" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>← Back to BotVault</Link>
        <Link href="/botvault/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Log in</Link>
      </nav>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem 4rem' }}>
        {/* Hero */}
        <section style={{ textAlign: 'center', padding: '3rem 0 4rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Bot<span style={{ color: 'var(--accent)' }}>Vault</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Your bots need keys, tokens, and credentials to work. BotVault keeps them safe, organized, and under your control.
          </p>
          <Link href="/botvault/login" style={{
            display: 'inline-block', padding: '0.75rem 2rem', background: 'var(--accent)',
            color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '1rem',
          }}>
            Get Started
          </Link>
        </section>

        {/* The Problem */}
        <section style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>The Problem</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            AI bots are everywhere — managing your email, making purchases, accessing APIs. But how do they get their credentials today?
          </p>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '1rem' }}>
            <li>😬 Hardcoded in config files</li>
            <li>🫣 Copy-pasted into system prompts</li>
            <li>😵 Scattered across 10 different platforms</li>
          </ul>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '1.25rem' }}>
            Every bot owner faces the same problem: <strong style={{ color: 'var(--text)' }}>there's no secure, centralized way to give bots access to the things they need.</strong>
          </p>
        </section>

        {/* The Solution */}
        <section style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>The Solution</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            BotVault is a credential vault built specifically for AI bots. Think of it as a password manager, but for your bots.
          </p>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>How it works:</h3>
          <ol style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              ['1', 'Register your bot', 'Give it a name and get a secure token'],
              ['2', 'Store your keys', 'API keys, Google accounts, even credit cards — all encrypted at rest'],
              ['3', 'Set permissions', 'Each bot only sees what you allow. Nothing more.'],
            ].map(([num, title, desc]) => (
              <li key={num} style={{
                display: 'flex', alignItems: 'flex-start', gap: '1rem',
                background: 'var(--card-bg)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '1.25rem',
              }}>
                <span style={{
                  width: 36, height: 36, borderRadius: '50%', background: 'var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, flexShrink: 0,
                }}>{num}</span>
                <div>
                  <strong>{title}</strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>{desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '1.5rem' }}>
            Your bot fetches credentials on-demand from the vault. Every access is logged. You stay in control.
          </p>
        </section>

        {/* Why fetch every time? */}
        <section style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Why fetch every time?</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Your bot never stores secrets internally. It goes to the vault each time it needs a key — like a hotel safe, not a wallet.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '1rem', lineHeight: 1.6 }}>
            <li>🔄 <strong>Rotate keys instantly</strong> — update once, every bot gets the new key</li>
            <li>🚫 <strong>Revoke access in one click</strong> — cut off a compromised bot immediately</li>
            <li>📋 <strong>Full audit trail</strong> — see exactly which bot accessed what and when</li>
            <li>🔒 <strong>Encrypted at rest</strong> — AES-256 envelope encryption for every secret</li>
          </ul>
        </section>

        {/* Works with any bot */}
        <section style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Works with any bot</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            BotVault gives your bot a simple API:
          </p>
          <pre style={{
            background: 'var(--card-bg)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '1.25rem', overflow: 'auto',
            fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem',
          }}>
{`GET /api/botvault/v1/credentials      → list available keys
GET /api/botvault/v1/credentials/{id}  → get a specific key`}
          </pre>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Just paste the BotVault Skill into your bot's instructions. It works with OpenClaw, OpenAI GPTs, LangChain, CrewAI, or any bot that can make HTTP calls.
          </p>
        </section>

        {/* What you can store */}
        <section style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>What you can store</h2>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '1rem', lineHeight: 1.6 }}>
            <li>🔑 <strong>Keys</strong> — API keys, secrets, tokens for any service</li>
            <li>📧 <strong>Google Accounts</strong> — OAuth connections for Gmail, Calendar, Drive</li>
            <li>💳 <strong>Cards</strong> — Credit cards for bots that need purchasing power</li>
          </ul>
        </section>

        {/* Built by */}
        <section style={{ marginBottom: '3rem', textAlign: 'center', paddingTop: '1rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Built by Martin Mexia</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
            BotVault is an open experiment in giving AI agents secure, auditable access to the real world.
          </p>
          <Link href="/botvault/login" style={{
            display: 'inline-block', padding: '0.75rem 2rem', background: 'var(--accent)',
            color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '1rem',
          }}>
            Get Started →
          </Link>
        </section>
      </main>
    </div>
  );
}
