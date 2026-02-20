'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import '../botvault.css';

type Lang = 'en' | 'es';

const t = {
  en: {
    back: '← Back to BotVault',
    login: 'Log in',
    subtitle: 'The secure vault for your AI bots.',
    desc: 'Your bots need keys, tokens, and credentials to work. BotVault keeps them safe, organized, and under your control.',
    cta: 'Get Started',
    problemTitle: 'The Problem',
    problemIntro: 'AI bots are everywhere — managing your email, making purchases, accessing APIs. But how do they get their credentials today?',
    problem1: '😬 Hardcoded in config files',
    problem2: '🫣 Copy-pasted into system prompts',
    problem3: '😵 Scattered across 10 different platforms',
    problemOutro: 'Every bot owner faces the same problem: <strong>there\'s no secure, centralized way to give bots access to the things they need.</strong>',
    solutionTitle: 'The Solution',
    solutionIntro: 'BotVault is a credential vault built specifically for AI bots. Think of it as a password manager, but for your bots.',
    howItWorks: 'How it works:',
    steps: [
      ['1', 'Register your bot', 'Give it a name and get a secure token'],
      ['2', 'Store your keys', 'API keys, Google accounts, even credit cards — all encrypted at rest'],
      ['3', 'Set permissions', 'Each bot only sees what you allow. Nothing more.'],
    ] as [string, string, string][],
    solutionOutro: 'Your bot fetches credentials on-demand from the vault. Every access is logged. You stay in control.',
    whyFetchTitle: 'Why fetch every time?',
    whyFetchIntro: 'Your bot never stores secrets internally. It goes to the vault each time it needs a key — like a hotel safe, not a wallet.',
    whyFetch1: '🔄 <strong>Rotate keys instantly</strong> — update once, every bot gets the new key',
    whyFetch2: '🚫 <strong>Revoke access in one click</strong> — cut off a compromised bot immediately',
    whyFetch3: '📋 <strong>Full audit trail</strong> — see exactly which bot accessed what and when',
    whyFetch4: '🔒 <strong>Encrypted at rest</strong> — AES-256 envelope encryption for every secret',
    worksTitle: 'Works with any bot',
    worksIntro: 'BotVault gives your bot a simple API:',
    worksOutro: 'Just paste the BotVault Skill into your bot\'s instructions. It works with OpenClaw, OpenAI GPTs, LangChain, CrewAI, or any bot that can make HTTP calls.',
    storeTitle: 'What you can store',
    store1: '🔑 <strong>Keys</strong> — API keys, secrets, tokens for any service',
    store2: '📧 <strong>Google Accounts</strong> — OAuth connections for Gmail, Calendar, Drive',
    store3: '💳 <strong>Cards</strong> — Credit cards for bots that need purchasing power',
    builtBy: 'Built by Martin Mexia',
    builtByDesc: 'BotVault is an open experiment in giving AI agents secure, auditable access to the real world.',
    ctaFinal: 'Get Started →',
  },
  es: {
    back: '← Volver a BotVault',
    login: 'Iniciar sesión',
    subtitle: 'La bóveda segura para tus bots de IA.',
    desc: 'Tus bots necesitan claves, tokens y credenciales para funcionar. BotVault las mantiene seguras, organizadas y bajo tu control.',
    cta: 'Comenzar',
    problemTitle: 'El Problema',
    problemIntro: 'Los bots de IA están en todas partes — gestionando tu email, haciendo compras, accediendo a APIs. Pero, ¿cómo obtienen sus credenciales hoy?',
    problem1: 'Hardcodeadas en archivos de configuración 😬',
    problem2: 'Copiadas y pegadas en system prompts 🫣',
    problem3: 'Dispersas en 10 plataformas diferentes 😵',
    problemOutro: 'Todos los dueños de bots enfrentan el mismo problema: <strong>no existe una forma segura y centralizada de dar a los bots acceso a lo que necesitan.</strong>',
    solutionTitle: 'La Solución',
    solutionIntro: 'BotVault es una bóveda de credenciales construida específicamente para bots de IA. Piensa en ella como un gestor de contraseñas, pero para tus bots.',
    howItWorks: 'Cómo funciona (3 pasos):',
    steps: [
      ['1', 'Registra tu bot', 'Dale un nombre y obtén un token seguro'],
      ['2', 'Guarda tus claves', 'API keys, cuentas de Google, incluso tarjetas de crédito — todo encriptado'],
      ['3', 'Configura permisos', 'Cada bot solo ve lo que tú permites. Nada más.'],
    ] as [string, string, string][],
    solutionOutro: 'Tu bot obtiene credenciales bajo demanda desde la bóveda. Cada acceso queda registrado. Tú mantienes el control.',
    whyFetchTitle: '¿Por qué consultar cada vez?',
    whyFetchIntro: 'Tu bot nunca almacena secretos internamente. Va a la bóveda cada vez que necesita una clave — como una caja fuerte de hotel, no una billetera.',
    whyFetch1: '🔄 <strong>Rota claves al instante</strong> — actualiza una vez, todos los bots obtienen la nueva clave',
    whyFetch2: '🚫 <strong>Revoca acceso con un click</strong> — corta el acceso a un bot comprometido inmediatamente',
    whyFetch3: '📋 <strong>Auditoría completa</strong> — ve exactamente qué bot accedió a qué y cuándo',
    whyFetch4: '🔒 <strong>Encriptado en reposo</strong> — encriptación AES-256 para cada secreto',
    worksTitle: 'Funciona con cualquier bot',
    worksIntro: 'BotVault le da a tu bot una API simple:',
    worksOutro: 'Solo pega el Skill de BotVault en las instrucciones de tu bot. Funciona con OpenClaw, OpenAI GPTs, LangChain, CrewAI, o cualquier bot que pueda hacer llamadas HTTP.',
    storeTitle: 'Qué puedes guardar',
    store1: '🔑 <strong>Claves</strong> — API keys, secretos, tokens para cualquier servicio',
    store2: '📧 <strong>Cuentas de Google</strong> — Conexiones OAuth para Gmail, Calendar, Drive',
    store3: '💳 <strong>Tarjetas</strong> — Tarjetas de crédito para bots que necesitan poder de compra',
    builtBy: 'Creado por Martin Mexia',
    builtByDesc: 'BotVault es un experimento abierto en dar a los agentes de IA acceso seguro y auditable al mundo real.',
    ctaFinal: 'Comenzar →',
  },
};

function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    setDark(document.documentElement.getAttribute('data-theme') === 'dark');
  }, []);

  const toggle = () => {
    const next = dark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setDark(!dark);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      style={{
        background: 'var(--toggle-bg)',
        border: 'none',
        borderRadius: '50%',
        width: 36,
        height: 36,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.1rem',
        transition: 'all 0.3s ease',
      }}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const base: React.CSSProperties = {
    padding: '0.25rem 0.5rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '0.8125rem',
    borderRadius: 4,
    transition: 'all 0.15s ease',
  };
  return (
    <span style={{ display: 'inline-flex', gap: 2, background: 'var(--toggle-bg)', borderRadius: 6, padding: 2 }}>
      <button onClick={() => setLang('en')} style={{ ...base, color: lang === 'en' ? 'var(--accent)' : 'var(--text-secondary)', background: lang === 'en' ? 'var(--card-bg)' : 'transparent' }}>EN</button>
      <button onClick={() => setLang('es')} style={{ ...base, color: lang === 'es' ? 'var(--accent)' : 'var(--text-secondary)', background: lang === 'es' ? 'var(--card-bg)' : 'transparent' }}>ES</button>
    </span>
  );
}

export default function AboutBotVault() {
  const [lang, setLang] = useState<Lang>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const browserLang = navigator.language || '';
    if (browserLang.startsWith('es')) setLang('es');
    setMounted(true);
  }, []);

  const s = t[lang];

  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        maxWidth: 800, margin: '0 auto', padding: '1.5rem 1rem 0',
        fontSize: '0.875rem',
      }}>
        <Link href="/botvault" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{s.back}</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <LangToggle lang={lang} setLang={setLang} />
          <ThemeToggle />
          <Link href="/botvault/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>{s.login}</Link>
        </div>
      </nav>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem 4rem' }}>
        {/* Hero */}
        <section style={{ textAlign: 'center', padding: '3rem 0 4rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Bot<span style={{ color: 'var(--accent)' }}>Vault</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 0.75rem', lineHeight: 1.6 }}>
            {s.subtitle}
          </p>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 2rem', lineHeight: 1.6 }}>
            {s.desc}
          </p>
          <Link href="/botvault/login" style={{
            display: 'inline-block', padding: '0.75rem 2rem', background: 'var(--accent)',
            color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '1rem',
          }}>
            {s.cta}
          </Link>
        </section>

        {/* The Problem */}
        <section style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>{s.problemTitle}</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>{s.problemIntro}</p>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '1rem' }}>
            <li>{s.problem1}</li>
            <li>{s.problem2}</li>
            <li>{s.problem3}</li>
          </ul>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '1.25rem' }} dangerouslySetInnerHTML={{ __html: s.problemOutro }} />
        </section>

        {/* The Solution */}
        <section style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>{s.solutionTitle}</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{s.solutionIntro}</p>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>{s.howItWorks}</h3>
          <ol style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {s.steps.map(([num, title, desc]) => (
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
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '1.5rem' }}>{s.solutionOutro}</p>
        </section>

        {/* Why fetch every time? */}
        <section style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>{s.whyFetchTitle}</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>{s.whyFetchIntro}</p>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '1rem', lineHeight: 1.6 }}>
            <li dangerouslySetInnerHTML={{ __html: s.whyFetch1 }} />
            <li dangerouslySetInnerHTML={{ __html: s.whyFetch2 }} />
            <li dangerouslySetInnerHTML={{ __html: s.whyFetch3 }} />
            <li dangerouslySetInnerHTML={{ __html: s.whyFetch4 }} />
          </ul>
        </section>

        {/* Works with any bot */}
        <section style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>{s.worksTitle}</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>{s.worksIntro}</p>
          <pre style={{
            background: 'var(--card-bg)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '1.25rem', overflow: 'auto',
            fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem',
          }}>
{`GET /api/botvault/v1/credentials      → list available keys
GET /api/botvault/v1/credentials/{id}  → get a specific key`}
          </pre>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{s.worksOutro}</p>
        </section>

        {/* What you can store */}
        <section style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>{s.storeTitle}</h2>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '1rem', lineHeight: 1.6 }}>
            <li dangerouslySetInnerHTML={{ __html: s.store1 }} />
            <li dangerouslySetInnerHTML={{ __html: s.store2 }} />
            <li dangerouslySetInnerHTML={{ __html: s.store3 }} />
          </ul>
        </section>

        {/* Built by */}
        <section style={{ marginBottom: '3rem', textAlign: 'center', paddingTop: '1rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>{s.builtBy}</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>{s.builtByDesc}</p>
          <Link href="/botvault/login" style={{
            display: 'inline-block', padding: '0.75rem 2rem', background: 'var(--accent)',
            color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '1rem',
          }}>
            {s.ctaFinal}
          </Link>
        </section>
      </main>
    </div>
  );
}
