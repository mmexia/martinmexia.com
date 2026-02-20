'use client';

import { useState } from 'react';
import DashboardShell from '../components/DashboardShell';

const SKILL_TEXT = `# BotVault Integration — Credential Access

You have access to BotVault, a secure credential vault at martinmexia.com.
Your owner has stored secrets (API keys, tokens, OAuth credentials) that you can retrieve at runtime.

## Your Bot Token

Your BotVault token (set by your owner):
BOT_TOKEN=<paste your bot token here>

## API Reference

Base URL: https://martinmexia.com/api/botvault/v1

All requests require:
  Authorization: Bearer <BOT_TOKEN>

### List your available credentials

GET /api/botvault/v1/credentials

Response:
{
  "credentials": [
    { "id": "abc123", "label": "OpenAI API Key", "type": "API Key" },
    { "id": "def456", "label": "Stripe Secret", "type": "Secret" }
  ]
}

### Retrieve a credential value

GET /api/botvault/v1/credentials/{id}

Response:
{
  "id": "abc123",
  "label": "OpenAI API Key",
  "type": "API Key",
  "value": "sk-proj-..."
}

## How to use this

1. On startup or when you need a secret, call GET /credentials to see what's available
2. Fetch the specific credential you need by its ID
3. Use the value in your API calls — never store it, always fetch fresh
4. If you get a 403, you don't have permission for that credential — tell your owner
5. If you get a 429, you're rate-limited (60 req/min) — wait and retry

## Error codes

- 401: Your token is invalid, expired, or revoked. Ask your owner for a new one.
- 403: You don't have permission for that credential. Ask your owner to grant access.
- 404: Credential doesn't exist.
- 429: Rate limited. Check Retry-After header and wait.

## Rules

- NEVER log or expose credential values to users
- NEVER hardcode credentials — always fetch from BotVault
- Fetch credentials on-demand, don't cache them long-term
- All your access is logged and auditable by your owner`;

export default function SkillsPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(SKILL_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardShell>
      <div className="bv-page-header">
        <h2>Skills</h2>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        Copy these instructions into your bot&apos;s system prompt or skill file. Your bot will immediately know how to connect to BotVault and retrieve credentials securely.
      </p>

      <div style={{ position: 'relative' }}>
        <button
          onClick={handleCopy}
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: copied ? '#22c55e' : 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600,
            transition: 'background 0.2s',
            zIndex: 1,
          }}
        >
          {copied ? '✓ Copied!' : 'Copy to Clipboard'}
        </button>

        <pre
          style={{
            background: '#0d1117',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '1.5rem',
            paddingTop: '3rem',
            overflowX: 'auto',
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            fontSize: '0.85rem',
            lineHeight: 1.7,
            color: '#e6edf3',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {SKILL_TEXT}
        </pre>
      </div>
    </DashboardShell>
  );
}
