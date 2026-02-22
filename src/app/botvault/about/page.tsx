'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import '../../globals.css';

/* ─── Theme Toggle ─── */
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
    <button onClick={toggle} aria-label="Toggle theme" style={{
      background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem',
      width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {dark ? '☀️' : '🌙'}
    </button>
  );
}

/* ─── Lang Toggle ─── */
type Lang = 'en' | 'es';
function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const base: React.CSSProperties = {
    padding: '0.25rem 0.5rem', border: 'none', background: 'none', cursor: 'pointer',
    fontWeight: 700, fontSize: '0.75rem', borderRadius: 4, transition: 'all 0.15s ease',
  };
  return (
    <span style={{ display: 'inline-flex', gap: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 6, padding: 2 }}>
      <button onClick={() => setLang('en')} style={{ ...base, color: lang === 'en' ? '#3b82f6' : '#6b7280', background: lang === 'en' ? 'rgba(255,255,255,0.08)' : 'transparent' }}>EN</button>
      <button onClick={() => setLang('es')} style={{ ...base, color: lang === 'es' ? '#3b82f6' : '#6b7280', background: lang === 'es' ? 'rgba(255,255,255,0.08)' : 'transparent' }}>ES</button>
    </span>
  );
}

/* ─── Intersection Observer Hook ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }}>{children}</div>
  );
}

/* ─── Animated Counter ─── */
function Counter({ end, suffix = '', prefix = '', duration = 2000 }: { end: number; suffix?: string; prefix?: string; duration?: number }) {
  const { ref, visible } = useInView();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.max(1, Math.floor(end / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end, duration]);
  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

/* ─── FAQ Item ─── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bvm-faq-item" onClick={() => setOpen(!open)}>
      <div className="bvm-faq-q">
        <span>{q}</span>
        <span className="bvm-faq-icon" style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
      </div>
      <div className="bvm-faq-a" style={{ maxHeight: open ? '300px' : '0', opacity: open ? 1 : 0 }}>
        <p>{a}</p>
      </div>
    </div>
  );
}

/* ─── Scrolling Marquee ─── */
function Marquee() {
  const words = ['Credential Vault', 'OAuth Flows', 'API Key Management', 'Team Sharing', 'Access Control', 'Audit Logs', 'Auto-Rotation', 'Secure Storage', 'Bot Authentication', 'Token Management'];
  const doubled = [...words, ...words];
  return (
    <div className="bvm-marquee">
      <div className="bvm-marquee-track">
        {doubled.map((w, i) => (
          <span key={i} className="bvm-marquee-item">{w}</span>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */

export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<Lang>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    const browserLang = navigator.language || '';
    if (browserLang.startsWith('es')) setLang('es');
    setMounted(true);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <style>{`
        /* ─── RESET for marketing page ─── */
        .bvm-page { 
          background: #050507; 
          color: #e5e7eb; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, sans-serif; 
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }
        .bvm-page *, .bvm-page *::before, .bvm-page *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ─── NAV ─── */
        .bvm-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px; height: 72px;
          transition: all 0.3s ease;
          background: transparent;
        }
        .bvm-nav.bvm-nav-scrolled {
          background: rgba(5,5,7,0.85);
          backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .bvm-nav-logo {
          font-size: 20px; font-weight: 700; color: #fff;
          text-decoration: none; display: flex; align-items: center; gap: 10px;
        }
        .bvm-nav-logo span { 
          background: linear-gradient(135deg, #3b82f6, #8b5cf6); 
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
        }
        .bvm-nav-links { display: flex; align-items: center; gap: 32px; }
        .bvm-nav-links a { 
          color: #9ca3af; text-decoration: none; font-size: 14px; font-weight: 500;
          transition: color 0.2s; 
        }
        .bvm-nav-links a:hover { color: #fff; }
        .bvm-nav-login {
          padding: 8px 20px; border-radius: 8px; font-size: 14px; font-weight: 600;
          background: rgba(255,255,255,0.06); color: #fff; border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block;
          backdrop-filter: blur(10px);
        }
        .bvm-nav-login:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.2); }

        /* ─── HERO ─── */
        .bvm-hero {
          height: 100vh; display: flex; flex-direction: column; 
          align-items: center; justify-content: center;
          text-align: center; padding: 0 24px; position: relative;
        }
        .bvm-hero::before {
          content: ''; position: absolute; top: -200px; left: 50%; transform: translateX(-50%);
          width: 800px; height: 800px; border-radius: 50%;
          background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(124,58,237,0.04) 40%, transparent 70%);
          pointer-events: none;
        }
        .bvm-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 16px; border-radius: 100px; font-size: 13px; font-weight: 500;
          background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.15);
          color: #60a5fa; margin-bottom: 32px;
        }
        .bvm-hero-badge::before { content: '✦'; }
        .bvm-hero h1 {
          font-size: clamp(40px, 6vw, 72px); font-weight: 800; line-height: 1.05;
          color: #fff; max-width: 800px; letter-spacing: -0.03em;
        }
        .bvm-hero h1 em {
          font-style: normal;
          background: linear-gradient(135deg, #3b82f6, #a855f7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .bvm-hero-sub {
          font-size: clamp(16px, 2vw, 20px); color: #9ca3af; max-width: 560px;
          margin: 24px auto 0; line-height: 1.6; font-weight: 400;
        }
        .bvm-hero-ctas {
          display: flex; gap: 16px; margin-top: 40px; flex-wrap: wrap; justify-content: center;
        }
        .bvm-btn-primary {
          padding: 14px 32px; border-radius: 12px; font-size: 16px; font-weight: 600;
          background: linear-gradient(135deg, #3b82f6, #7c3aed);
          color: #fff; border: none; cursor: pointer; text-decoration: none;
          transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 0 30px rgba(59,130,246,0.2);
        }
        .bvm-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 50px rgba(59,130,246,0.3); }
        .bvm-btn-secondary {
          padding: 14px 32px; border-radius: 12px; font-size: 16px; font-weight: 600;
          background: rgba(255,255,255,0.04); color: #fff;
          border: 1px solid rgba(255,255,255,0.1); cursor: pointer; text-decoration: none;
          transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px;
        }
        .bvm-btn-secondary:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }

        /* ─── PRODUCT FRAME ─── */
        .bvm-product-frame {
          position: relative; max-width: 1000px; width: 100%;
          margin: 60px auto 0; border-radius: 16px; overflow: hidden;
          box-shadow: 0 0 80px rgba(59,130,246,0.15), 0 0 160px rgba(124,58,237,0.1);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .bvm-product-frame img { width: 100%; display: block; }
        .bvm-product-tilt {
          transform: perspective(1200px) rotateX(4deg);
          transition: transform 0.6s ease;
        }
        .bvm-product-tilt:hover { transform: perspective(1200px) rotateX(0deg); }

        /* ─── MARQUEE ─── */
        .bvm-marquee {
          overflow: hidden; padding: 48px 0;
          border-top: 1px solid rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .bvm-marquee-track {
          display: flex; gap: 48px; white-space: nowrap;
          animation: bvm-scroll 30s linear infinite;
        }
        .bvm-marquee-item {
          font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em;
          color: rgba(255,255,255,0.15); flex-shrink: 0;
        }
        @keyframes bvm-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        /* ─── SECTION BASE ─── */
        .bvm-section { padding: 120px 24px; max-width: 1200px; margin: 0 auto; }
        .bvm-section-label {
          font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em;
          color: #3b82f6; margin-bottom: 16px;
        }
        .bvm-section-title {
          font-size: clamp(28px, 4vw, 48px); font-weight: 800; color: #fff;
          line-height: 1.1; letter-spacing: -0.02em; max-width: 700px;
        }
        .bvm-section-sub {
          font-size: 18px; color: #6b7280; margin-top: 16px; max-width: 600px; line-height: 1.7;
        }

        /* ─── TRUST ─── */
        .bvm-trust { text-align: center; padding: 80px 24px; }
        .bvm-trust-label { font-size: 13px; color: #4b5563; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600; }
        .bvm-trust-logos {
          display: flex; align-items: center; justify-content: center; gap: 48px;
          margin-top: 32px; flex-wrap: wrap; opacity: 0.4;
        }
        .bvm-trust-logos span { font-size: 18px; font-weight: 700; color: #6b7280; }

        /* ─── SHOWCASE ─── */
        .bvm-showcase {
          padding: 80px 24px; text-align: center;
          position: relative;
        }
        .bvm-showcase::before {
          content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 100%; height: 60%; 
          background: radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .bvm-showcase-frame {
          max-width: 1100px; margin: 0 auto; border-radius: 20px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 0 120px rgba(59,130,246,0.1), 0 0 240px rgba(124,58,237,0.06);
          transform: perspective(1400px) rotateX(3deg);
          transition: transform 0.6s ease;
        }
        .bvm-showcase-frame:hover { transform: perspective(1400px) rotateX(0deg); }
        .bvm-showcase-frame img { width: 100%; display: block; }

        /* ─── VALUE PROPS ─── */
        .bvm-values { display: grid; grid-template-columns: repeat(3, 1fr); gap: 48px; margin-top: 72px; }
        .bvm-value-card { position: relative; padding: 40px; border-radius: 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); transition: all 0.3s; }
        .bvm-value-card:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); transform: translateY(-4px); }
        .bvm-value-num { font-size: 48px; font-weight: 800; color: rgba(59,130,246,0.15); margin-bottom: 16px; }
        .bvm-value-title { font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 12px; }
        .bvm-value-desc { font-size: 15px; color: #6b7280; line-height: 1.7; }

        /* ─── STATS ─── */
        .bvm-stats {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px;
          padding: 100px 24px; max-width: 1200px; margin: 0 auto;
          text-align: center;
        }
        .bvm-stat-value { font-size: clamp(40px, 5vw, 64px); font-weight: 800; color: #fff; letter-spacing: -0.03em; }
        .bvm-stat-value em { font-style: normal; background: linear-gradient(135deg, #3b82f6, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .bvm-stat-label { font-size: 14px; color: #6b7280; margin-top: 8px; font-weight: 500; }

        /* ─── SECURITY VISUAL ─── */
        .bvm-security {
          display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;
        }
        .bvm-security-img {
          border-radius: 20px; overflow: hidden; 
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 0 60px rgba(59,130,246,0.08);
        }
        .bvm-security-img img { width: 100%; display: block; }

        /* ─── USE CASES ─── */
        .bvm-usecases { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-top: 64px; }
        .bvm-usecase {
          padding: 40px; border-radius: 16px; background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05); transition: all 0.3s;
        }
        .bvm-usecase:hover { background: rgba(255,255,255,0.04); border-color: rgba(59,130,246,0.15); }
        .bvm-usecase-icon { font-size: 32px; margin-bottom: 16px; }
        .bvm-usecase h3 { font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 8px; }
        .bvm-usecase p { font-size: 15px; color: #6b7280; line-height: 1.7; }

        /* ─── PRICING ─── */
        .bvm-pricing { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 64px; }
        .bvm-price-card {
          padding: 40px; border-radius: 20px; background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06); position: relative; transition: all 0.3s;
        }
        .bvm-price-card:hover { transform: translateY(-4px); }
        .bvm-price-card.bvm-price-featured {
          background: linear-gradient(135deg, rgba(59,130,246,0.08), rgba(124,58,237,0.05));
          border-color: rgba(59,130,246,0.2);
        }
        .bvm-price-badge {
          position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
          padding: 4px 16px; border-radius: 100px; font-size: 12px; font-weight: 700;
          background: linear-gradient(135deg, #3b82f6, #7c3aed); color: #fff;
          text-transform: uppercase; letter-spacing: 0.1em;
        }
        .bvm-price-name { font-size: 16px; font-weight: 600; color: #9ca3af; }
        .bvm-price-amount { font-size: 48px; font-weight: 800; color: #fff; margin: 16px 0 4px; }
        .bvm-price-amount span { font-size: 16px; font-weight: 400; color: #6b7280; }
        .bvm-price-desc { font-size: 14px; color: #6b7280; margin-bottom: 32px; }
        .bvm-price-features { list-style: none; padding: 0; margin: 0 0 32px; }
        .bvm-price-features li {
          padding: 8px 0; font-size: 14px; color: #9ca3af;
          display: flex; align-items: center; gap: 10px;
        }
        .bvm-price-features li::before { content: '✓'; color: #3b82f6; font-weight: 700; }
        .bvm-price-cta {
          display: block; width: 100%; padding: 14px; border-radius: 12px; font-size: 15px;
          font-weight: 600; text-align: center; cursor: pointer; transition: all 0.2s;
          text-decoration: none;
        }
        .bvm-price-cta-primary { background: linear-gradient(135deg, #3b82f6, #7c3aed); color: #fff; border: none; }
        .bvm-price-cta-primary:hover { box-shadow: 0 0 30px rgba(59,130,246,0.3); }
        .bvm-price-cta-outline { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.1); }
        .bvm-price-cta-outline:hover { background: rgba(255,255,255,0.04); }

        /* ─── FAQ ─── */
        .bvm-faq-list { max-width: 700px; margin: 48px auto 0; }
        .bvm-faq-item {
          border-bottom: 1px solid rgba(255,255,255,0.06); cursor: pointer;
          padding: 24px 0;
        }
        .bvm-faq-q { display: flex; justify-content: space-between; align-items: center; }
        .bvm-faq-q span:first-child { font-size: 16px; font-weight: 600; color: #e5e7eb; }
        .bvm-faq-icon { font-size: 24px; color: #6b7280; transition: transform 0.3s; }
        .bvm-faq-a { overflow: hidden; transition: all 0.3s ease; }
        .bvm-faq-a p { padding-top: 12px; font-size: 15px; color: #6b7280; line-height: 1.7; }

        /* ─── FINAL CTA ─── */
        .bvm-final-cta {
          text-align: center; padding: 120px 24px; position: relative;
        }
        .bvm-final-cta::before {
          content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 600px; height: 400px;
          background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .bvm-final-cta h2 {
          font-size: clamp(32px, 5vw, 56px); font-weight: 800; color: #fff;
          line-height: 1.1; letter-spacing: -0.02em; max-width: 700px; margin: 0 auto;
        }
        .bvm-final-cta p { font-size: 18px; color: #6b7280; margin: 24px auto 0; max-width: 500px; line-height: 1.6; }
        .bvm-final-cta .bvm-hero-ctas { margin-top: 40px; }

        /* ─── FOOTER ─── */
        .bvm-footer {
          border-top: 1px solid rgba(255,255,255,0.06); padding: 64px 24px 32px;
          max-width: 1200px; margin: 0 auto;
        }
        .bvm-footer-grid {
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px;
          margin-bottom: 48px;
        }
        .bvm-footer-brand p { font-size: 14px; color: #4b5563; line-height: 1.7; max-width: 280px; margin-top: 12px; }
        .bvm-footer h4 { font-size: 13px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; }
        .bvm-footer a { display: block; font-size: 14px; color: #6b7280; text-decoration: none; padding: 4px 0; transition: color 0.2s; }
        .bvm-footer a:hover { color: #fff; }
        .bvm-footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.06); }
        .bvm-footer-bottom span { font-size: 13px; color: #4b5563; }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 900px) {
          .bvm-nav { padding: 0 24px; }
          .bvm-nav-links { display: none; }
          .bvm-values { grid-template-columns: 1fr; }
          .bvm-stats { grid-template-columns: repeat(2, 1fr); }
          .bvm-security { grid-template-columns: 1fr; }
          .bvm-usecases { grid-template-columns: 1fr; }
          .bvm-pricing { grid-template-columns: 1fr; }
          .bvm-footer-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="bvm-page">
        {/* NAV */}
        <nav className={`bvm-nav ${scrolled ? 'bvm-nav-scrolled' : ''}`}>
          <Link href="/botvault/about" className="bvm-nav-logo">
            🔐 <span>BotVault</span>
          </Link>
          <div className="bvm-nav-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <LangToggle lang={lang} setLang={setLang} />
            <ThemeToggle />
            <Link href="/botvault/login" className="bvm-nav-login">Log In</Link>
          </div>
        </nav>

        {/* HERO */}
        <section className="bvm-hero">
          <FadeIn>
            <div className="bvm-hero-badge">Now in Public Beta</div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1>Stop Hardcoding<br />Your <em>Secrets</em></h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="bvm-hero-sub">
              The credential vault built for bots, agents, and automation. 
              Store API keys, manage OAuth flows, and share secrets across your team — securely.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="bvm-hero-ctas">
              <Link href="/botvault/signup" className="bvm-btn-primary">Get Started Free →</Link>
              <a href="#features" className="bvm-btn-secondary">See How It Works</a>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="bvm-product-frame bvm-product-tilt">
              <img src="/images/hero-dashboard.png" alt="BotVault Dashboard" />
            </div>
          </FadeIn>
        </section>

        {/* MARQUEE */}
        <Marquee />

        {/* TRUST */}
        <div className="bvm-trust">
          <p className="bvm-trust-label">Trusted by developers building with</p>
          <div className="bvm-trust-logos">
            <span>OpenAI</span>
            <span>LangChain</span>
            <span>Vercel</span>
            <span>Zapier</span>
            <span>n8n</span>
            <span>AutoGPT</span>
          </div>
        </div>

        {/* PRODUCT SHOWCASE */}
        <section className="bvm-showcase">
          <FadeIn>
            <div className="bvm-showcase-frame">
              <img src="/images/hero-dashboard.png" alt="BotVault Credential Management" />
            </div>
          </FadeIn>
        </section>

        {/* VALUE PROPS */}
        <section className="bvm-section" id="features">
          <FadeIn>
            <p className="bvm-section-label">Why BotVault</p>
            <h2 className="bvm-section-title">Everything your bots need.<br />Nothing they don&apos;t.</h2>
            <p className="bvm-section-sub">Replace scattered .env files and insecure credential storage with one unified vault designed for the AI era.</p>
          </FadeIn>
          <div className="bvm-values">
            <FadeIn delay={0.1}>
              <div className="bvm-value-card">
                <div className="bvm-value-num">01</div>
                <h3 className="bvm-value-title">One Vault, All Credentials</h3>
                <p className="bvm-value-desc">Store API keys, OAuth tokens, database passwords, and any secret your bots need — all in one place with military-grade protection.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="bvm-value-card">
                <div className="bvm-value-num">02</div>
                <h3 className="bvm-value-title">OAuth Without the Headache</h3>
                <p className="bvm-value-desc">Built-in OAuth flows for Google, GitHub, Slack, and more. Your bots authenticate with a single API call — no redirect handling needed.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="bvm-value-card">
                <div className="bvm-value-num">03</div>
                <h3 className="bvm-value-title">Team Access Control</h3>
                <p className="bvm-value-desc">Share credentials across your team with granular permissions. Everyone gets what they need, nothing more.</p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* SECURITY SECTION */}
        <section className="bvm-section">
          <div className="bvm-security">
            <FadeIn>
              <div>
                <p className="bvm-section-label">Security First</p>
                <h2 className="bvm-section-title">Built for paranoia.<br />Designed for peace of mind.</h2>
                <p className="bvm-section-sub">Every credential is encrypted at rest and in transit. Automatic key rotation, comprehensive audit logs, and zero-knowledge architecture mean your secrets stay secret.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="bvm-security-img">
                <img src="/images/security-visual.png" alt="BotVault Security" />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* STATS */}
        <div className="bvm-stats">
          <FadeIn>
            <div>
              <div className="bvm-stat-value"><em><Counter end={10} suffix="x" /></em></div>
              <div className="bvm-stat-label">Faster than DIY secrets management</div>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div>
              <div className="bvm-stat-value"><em>Zero</em></div>
              <div className="bvm-stat-label">Plaintext secrets in your codebase</div>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div>
              <div className="bvm-stat-value"><em><Counter end={100} suffix="%" /></em></div>
              <div className="bvm-stat-label">Encrypted at rest and in transit</div>
            </div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div>
              <div className="bvm-stat-value"><em>&lt;<Counter end={50} suffix="ms" /></em></div>
              <div className="bvm-stat-label">API response time</div>
            </div>
          </FadeIn>
        </div>

        {/* USE CASES */}
        <section className="bvm-section">
          <FadeIn>
            <p className="bvm-section-label">Use Cases</p>
            <h2 className="bvm-section-title">Built for the way you work</h2>
          </FadeIn>
          <div className="bvm-usecases">
            <FadeIn delay={0.1}>
              <div className="bvm-usecase">
                <div className="bvm-usecase-icon">🤖</div>
                <h3>AI Assistants & Agents</h3>
                <p>Give your AI agents secure access to APIs without embedding keys in prompts or code. Works with OpenAI, Anthropic, and any LLM framework.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="bvm-usecase">
                <div className="bvm-usecase-icon">⚡</div>
                <h3>Workflow Automation</h3>
                <p>Connect your n8n, Zapier, or custom automation pipelines to a central credential store. No more copy-pasting API keys between tools.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="bvm-usecase">
                <div className="bvm-usecase-icon">👥</div>
                <h3>Development Teams</h3>
                <p>Onboard new developers in minutes, not hours. Shared vaults with role-based access mean everyone has what they need from day one.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.25}>
              <div className="bvm-usecase">
                <div className="bvm-usecase-icon">🚀</div>
                <h3>SaaS Platforms</h3>
                <p>Let your users connect their own API keys securely. White-label vault functionality for your platform with our embedded SDK.</p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* PRICING */}
        <section className="bvm-section" id="pricing">
          <FadeIn>
            <div style={{ textAlign: 'center' }}>
              <p className="bvm-section-label">Pricing</p>
              <h2 className="bvm-section-title" style={{ margin: '0 auto' }}>Simple, transparent pricing</h2>
              <p className="bvm-section-sub" style={{ margin: '16px auto 0' }}>Start free. Scale when you&apos;re ready.</p>
            </div>
          </FadeIn>
          <div className="bvm-pricing">
            <FadeIn delay={0.1}>
              <div className="bvm-price-card">
                <p className="bvm-price-name">Starter</p>
                <p className="bvm-price-amount">$0<span>/mo</span></p>
                <p className="bvm-price-desc">Perfect for side projects and experimentation</p>
                <ul className="bvm-price-features">
                  <li>Up to 25 stored credentials</li>
                  <li>2 OAuth connections</li>
                  <li>1 team member</li>
                  <li>Community support</li>
                  <li>API access</li>
                </ul>
                <Link href="/botvault/signup" className="bvm-price-cta bvm-price-cta-outline">Get Started</Link>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="bvm-price-card bvm-price-featured">
                <div className="bvm-price-badge">Most Popular</div>
                <p className="bvm-price-name">Pro</p>
                <p className="bvm-price-amount">$29<span>/mo</span></p>
                <p className="bvm-price-desc">For growing teams and production workloads</p>
                <ul className="bvm-price-features">
                  <li>Unlimited credentials</li>
                  <li>Unlimited OAuth connections</li>
                  <li>Up to 10 team members</li>
                  <li>Audit logs</li>
                  <li>Priority support</li>
                  <li>Auto key rotation</li>
                </ul>
                <Link href="/botvault/signup" className="bvm-price-cta bvm-price-cta-primary">Start Free Trial</Link>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="bvm-price-card">
                <p className="bvm-price-name">Enterprise</p>
                <p className="bvm-price-amount">Custom</p>
                <p className="bvm-price-desc">For organizations with advanced needs</p>
                <ul className="bvm-price-features">
                  <li>Everything in Pro</li>
                  <li>Unlimited team members</li>
                  <li>SSO / SAML</li>
                  <li>Dedicated support</li>
                  <li>Custom SLA</li>
                  <li>On-premise option</li>
                </ul>
                <a href="mailto:hello@mybotvault.com" className="bvm-price-cta bvm-price-cta-outline">Contact Sales</a>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* FAQ */}
        <section className="bvm-section" id="faq">
          <FadeIn>
            <div style={{ textAlign: 'center' }}>
              <p className="bvm-section-label">FAQ</p>
              <h2 className="bvm-section-title" style={{ margin: '0 auto' }}>Questions? Answers.</h2>
            </div>
          </FadeIn>
          <div className="bvm-faq-list">
            <FAQItem q="How secure is BotVault?" a="Every credential is encrypted with industry-standard encryption before it ever touches our servers. We use a zero-knowledge architecture — even our team can't see your secrets. All data is encrypted at rest and in transit." />
            <FAQItem q="Can I migrate from .env files?" a="Absolutely. Our CLI tool lets you import existing .env files in one command. Your credentials are automatically encrypted and organized in your vault." />
            <FAQItem q="Does it work with my existing tools?" a="BotVault provides a REST API and SDKs for Python, Node.js, and Go. It integrates with popular frameworks like LangChain, n8n, and any tool that can make HTTP requests." />
            <FAQItem q="What happens if BotVault goes down?" a="We maintain 99.99% uptime with multi-region redundancy. Your credentials are cached locally (encrypted) for offline access, so your bots keep running even if our servers are unreachable." />
            <FAQItem q="Is there a self-hosted option?" a="Yes! Our Enterprise plan includes the option to deploy BotVault on your own infrastructure. Same great experience, complete data sovereignty." />
            <FAQItem q="How does team sharing work?" a="Create shared vaults with role-based permissions. Admins control who can view, use, or manage each credential. Perfect for teams that need to collaborate without compromising security." />
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bvm-final-cta">
          <FadeIn>
            <h2>Your bots deserve better<br />than <em style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #3b82f6, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>.env files</em></h2>
            <p>Join thousands of developers who&apos;ve moved their credentials to BotVault. Start in under 60 seconds.</p>
            <div className="bvm-hero-ctas">
              <Link href="/botvault/signup" className="bvm-btn-primary">Start Building Free →</Link>
              <a href="https://docs.mybotvault.com" className="bvm-btn-secondary" target="_blank" rel="noopener noreferrer">Read the Docs</a>
            </div>
          </FadeIn>
        </section>

        {/* FOOTER */}
        <footer className="bvm-footer">
          <div className="bvm-footer-grid">
            <div className="bvm-footer-brand">
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>🔐 BotVault</span>
              <p>The credential vault built for bots, agents, and automation teams. Secure by default, simple by design.</p>
            </div>
            <div>
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="https://docs.mybotvault.com" target="_blank" rel="noopener noreferrer">Documentation</a>
              <a href="#">Changelog</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="#">Blog</a>
              <a href="#">About</a>
              <a href="mailto:hello@mybotvault.com">Contact</a>
            </div>
            <div>
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Security</a>
            </div>
          </div>
          <div className="bvm-footer-bottom">
            <span>© 2025 BotVault. All rights reserved.</span>
            <span>Built with 🔒 for the AI era</span>
          </div>
        </footer>
      </div>
    </>
  );
}
