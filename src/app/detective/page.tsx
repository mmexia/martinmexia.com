"use client";

import { useState, useEffect } from "react";

/* ─── Types ─── */
interface Activity {
  timestamp: string;
  action: string;
  summary: string;
  channel: string;
  status: "success" | "failed" | "skipped";
  details?: Record<string, unknown>;
}

interface Stats {
  totalActions: number;
  successRate: number;
  lastActive: string;
  topChannels: { channel: string; count: number }[];
  actionsToday: number;
}

interface Timeline {
  hour: string;
  count: number;
}

/* ─── Constants ─── */
const ACTION_ICONS: Record<string, string> = {
  slack_check: "💬",
  email_check: "📧",
  calendar_check: "📅",
  rag_monitor: "🔎",
  reminder_set: "⏰",
  briefing_sent: "📋",
  search: "🌐",
  code_change: "💻",
  browser_action: "🖥️",
  message_sent: "📨",
  cron_job: "⚙️",
  reflection: "🧠",
  error: "❌",
  other: "📌",
};

const CHANNEL_COLORS: Record<string, string> = {
  slack: "#4A154B",
  telegram: "#0088cc",
  gmail: "#EA4335",
  calendar: "#4285F4",
  github: "#238636",
  internal: "#6B7280",
  browser: "#F59E0B",
};

const STATUS_COLORS: Record<string, string> = {
  success: "#22c55e",
  failed: "#ef4444",
  skipped: "#eab308",
};

/* ─── Helpers ─── */
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/* ─── Theme Toggle ─── */
function ThemeToggle() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);
  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setDark(!dark);
  };
  return (
    <button onClick={toggle} aria-label="Toggle theme" style={{
      background: "var(--toggle-bg)", border: "none", borderRadius: "50%",
      width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: "1.1rem", transition: "all 0.3s ease",
    }}>
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

/* ─── Page ─── */
export default function DetectivePage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [timeline, setTimeline] = useState<Timeline[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set dark theme default
    if (!localStorage.getItem("theme")) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", localStorage.getItem("theme")!);
    }
    setMounted(true);
    fetch("/api/detective")
      .then((r) => r.json())
      .then((data) => {
        setActivities(data.activities);
        setStats(data.stats);
        setTimeline(data.timeline);
      })
      .catch(console.error);
  }, []);

  const maxTimelineCount = Math.max(...timeline.map((t) => t.count), 1);

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { opacity:0; animation: fadeUp 0.6s ease forwards; }
        .d1 { animation-delay: 0.1s; }
        .d2 { animation-delay: 0.2s; }
        .d3 { animation-delay: 0.3s; }
        .d4 { animation-delay: 0.4s; }
        .d5 { animation-delay: 0.5s; }
      `}</style>
      <div style={{
        minHeight: "100vh", background: "var(--bg)", color: "var(--text)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
        padding: "2rem", maxWidth: 960, margin: "0 auto",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}>
        {/* Header */}
        <header className="fade-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
              🔍 Athena Detective
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: 4 }}>
              Activity monitor — what your AI has been up to
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* Stats Cards */}
        {stats && (
          <div className="fade-in d1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
            {[
              { label: "Actions Today", value: stats.actionsToday, icon: "⚡" },
              { label: "Success Rate", value: `${stats.successRate}%`, icon: "✅" },
              { label: "Last Active", value: relativeTime(stats.lastActive), icon: "🕐" },
              { label: "Top Channel", value: stats.topChannels[0]?.channel || "—", icon: "📡" },
            ].map((card) => (
              <div key={card.label} style={{
                background: "var(--card-bg)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "1.2rem", transition: "all 0.3s ease",
              }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                  {card.icon} {card.label}
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{card.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* 24h Activity Chart */}
        {timeline.length > 0 && (
          <section className="fade-in d2" style={{
            background: "var(--card-bg)", border: "1px solid var(--border)",
            borderRadius: 12, padding: "1.5rem", marginBottom: "2.5rem",
          }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>24h Activity</h2>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 80 }}>
              {timeline.map((t, i) => (
                <div key={i} title={`${t.hour} — ${t.count} actions`} style={{
                  flex: 1, background: t.count > 0 ? "var(--accent)" : "var(--border)",
                  height: t.count > 0 ? `${(t.count / maxTimelineCount) * 100}%` : 4,
                  borderRadius: 3, minHeight: 4, transition: "height 0.3s ease",
                  opacity: t.count > 0 ? 0.8 : 0.3,
                }} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: "0.65rem", color: "var(--text-secondary)" }}>
              <span>{timeline[0]?.hour}</span>
              <span>{timeline[Math.floor(timeline.length / 2)]?.hour}</span>
              <span>{timeline[timeline.length - 1]?.hour}</span>
            </div>
          </section>
        )}

        {/* Channel Breakdown */}
        {stats && stats.topChannels.length > 0 && (
          <section className="fade-in d3" style={{
            background: "var(--card-bg)", border: "1px solid var(--border)",
            borderRadius: 12, padding: "1.5rem", marginBottom: "2.5rem",
          }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Channel Breakdown</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {stats.topChannels.map((ch) => (
                <div key={ch.channel} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    display: "inline-block", padding: "2px 10px", borderRadius: 100,
                    fontSize: "0.75rem", fontWeight: 600, color: "#fff",
                    background: CHANNEL_COLORS[ch.channel] || "#666",
                    minWidth: 80, textAlign: "center", textTransform: "capitalize",
                  }}>{ch.channel}</span>
                  <div style={{ flex: 1, height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      width: `${(ch.count / stats.totalActions) * 100}%`,
                      height: "100%", borderRadius: 4, transition: "width 0.5s ease",
                      background: CHANNEL_COLORS[ch.channel] || "#666", opacity: 0.7,
                    }} />
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", minWidth: 24, textAlign: "right" }}>{ch.count}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Activity Timeline */}
        <section className="fade-in d4" style={{
          background: "var(--card-bg)", border: "1px solid var(--border)",
          borderRadius: 12, padding: "1.5rem", marginBottom: "2.5rem",
        }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Recent Activity</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {activities.slice(0, 20).map((a, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 12, padding: "0.75rem 0",
                borderBottom: i < 19 ? "1px solid var(--border)" : "none",
              }}>
                <span style={{ fontSize: "1.2rem", lineHeight: 1, marginTop: 2 }}>
                  {ACTION_ICONS[a.action] || "📌"}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.9rem", lineHeight: 1.4 }}>{a.summary}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                      {relativeTime(a.timestamp)}
                    </span>
                    <span style={{
                      display: "inline-block", padding: "1px 8px", borderRadius: 100,
                      fontSize: "0.65rem", fontWeight: 600, color: "#fff",
                      background: CHANNEL_COLORS[a.channel] || "#666",
                      textTransform: "capitalize",
                    }}>{a.channel}</span>
                    <span style={{
                      display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                      background: STATUS_COLORS[a.status] || "#888",
                    }} title={a.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Back link */}
        <div className="fade-in d5" style={{ textAlign: "center", paddingBottom: "2rem" }}>
          <a href="/" style={{
            color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.85rem",
            transition: "color 0.2s ease",
          }}
            onMouseOver={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            ← martinmexia.com
          </a>
        </div>
      </div>
    </>
  );
}
