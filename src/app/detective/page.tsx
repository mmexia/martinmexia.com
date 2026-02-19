"use client";

import { useState, useEffect } from "react";

/* ─── Types ─── */
interface ActivityDetail {
  whatHappened: string;
  thinking: string;
  instructionsFollowed: string;
  innerThoughts: string;
  output: string;
}

interface Activity {
  timestamp: string;
  action: string;
  summary: string;
  channel: string;
  status: "success" | "failed" | "skipped";
  details?: Record<string, unknown>;
  detail: ActivityDetail;
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

/* ─── Last Updated Helper ─── */
function formatLastUpdated(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins === 1) return "1 minute ago";
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs === 1) return "1 hour ago";
  if (hrs < 24) return `${hrs} hours ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

/* ─── Page ─── */
export default function DetectivePage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [timeline, setTimeline] = useState<Timeline[]>([]);
  const [mounted, setMounted] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [lastUpdatedDisplay, setLastUpdatedDisplay] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    try {
      // Try public JSON first (real data), fall back to API (demo data)
      let data;
      try {
        const res = await fetch("/detective-data.json", { cache: "no-store" });
        if (res.ok) {
          const jsonData = await res.json();
          // Build stats and timeline from raw activities
          const acts: Activity[] = jsonData.activities || [];
          const successCount = acts.filter((a: Activity) => a.status === "success").length;
          const channelCounts: Record<string, number> = {};
          acts.forEach((a: Activity) => { channelCounts[a.channel] = (channelCounts[a.channel] || 0) + 1; });
          const topChannels = Object.entries(channelCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([channel, count]) => ({ channel, count }));
          const now = new Date();
          const tl: Timeline[] = [];
          for (let i = 23; i >= 0; i--) {
            const hourStart = new Date(now.getTime() - i * 3600000);
            const hourEnd = new Date(hourStart.getTime() + 3600000);
            const label = hourStart.toISOString().slice(11, 16);
            const count = acts.filter((a: Activity) => {
              const t = new Date(a.timestamp);
              return t >= hourStart && t < hourEnd;
            }).length;
            tl.push({ hour: label, count });
          }
          data = {
            activities: acts,
            stats: {
              totalActions: acts.length,
              successRate: acts.length ? Math.round((successCount / acts.length) * 100) : 0,
              lastActive: acts[0]?.timestamp || now.toISOString(),
              topChannels,
              actionsToday: acts.length,
            },
            timeline: tl,
            lastUpdated: jsonData.lastUpdated,
          };
        } else {
          throw new Error("not found");
        }
      } catch {
        const res = await fetch("/api/detective");
        data = await res.json();
      }
      setActivities(data.activities);
      setStats(data.stats);
      setTimeline(data.timeline);
      if (data.lastUpdated) setLastUpdated(data.lastUpdated);
    } catch (err) {
      console.error(err);
    } finally {
      if (showRefreshIndicator) setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    // Set dark theme default
    if (!localStorage.getItem("theme")) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", localStorage.getItem("theme")!);
    }
    setMounted(true);
    loadData();

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => loadData(true), 60000);
    return () => clearInterval(interval);
  }, []);

  // Update relative time display every 30 seconds
  useEffect(() => {
    if (!lastUpdated) return;
    const update = () => setLastUpdatedDisplay(formatLastUpdated(lastUpdated));
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

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
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .refresh-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); margin-right: 6px; animation: pulse 1.5s ease-in-out infinite; }
        .detail-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 300ms ease; }
        .detail-panel.expanded { grid-template-rows: 1fr; }
        .detail-panel-inner { overflow: hidden; }
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

        {/* Last Updated */}
        {lastUpdated && (
          <div className="fade-in" style={{
            fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1.5rem", marginTop: "-1.5rem",
            display: "flex", alignItems: "center",
          }}>
            {isRefreshing && <span className="refresh-dot" />}
            Last updated {lastUpdatedDisplay} • Auto-refreshing
          </div>
        )}

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
            {activities.slice(0, 20).map((a, i) => {
              const isExpanded = expandedIndex === i;
              return (
                <div key={i}>
                  <div
                    onClick={() => setExpandedIndex(isExpanded ? null : i)}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 12, padding: "0.75rem 0",
                      borderBottom: !isExpanded && i < 19 ? "1px solid var(--border)" : "none",
                      cursor: "pointer", userSelect: "none",
                    }}
                  >
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
                    <span style={{
                      fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 2,
                      transition: "transform 300ms ease",
                      transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                      display: "inline-block",
                    }}>▸</span>
                  </div>
                  {a.detail && (
                    <div className={`detail-panel${isExpanded ? " expanded" : ""}`}>
                      <div className="detail-panel-inner">
                        <div style={{
                          padding: "0.75rem 0.75rem 1rem",
                          marginBottom: "0.5rem",
                          borderTop: "1px solid var(--border)",
                          borderBottom: "1px solid var(--border)",
                          background: "var(--bg)",
                          borderRadius: 8,
                        }}>
                          {[
                            { emoji: "🎯", label: "What happened", content: a.detail.whatHappened },
                            { emoji: "🧠", label: "My thinking", content: a.detail.thinking },
                            { emoji: "📋", label: "Instructions followed", content: a.detail.instructionsFollowed },
                            { emoji: "💭", label: "Inner thoughts", content: a.detail.innerThoughts },
                          ].map((section) => (
                            <div key={section.label} style={{ marginBottom: "0.75rem" }}>
                              <div style={{
                                fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase",
                                letterSpacing: "0.06em", color: "var(--text-secondary)", marginBottom: 4,
                              }}>
                                {section.emoji} {section.label}
                              </div>
                              <div style={{ fontSize: "0.85rem", lineHeight: 1.5, color: "var(--text)" }}>
                                {section.content}
                              </div>
                            </div>
                          ))}
                          <div>
                            <div style={{
                              fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase",
                              letterSpacing: "0.06em", color: "var(--text-secondary)", marginBottom: 4,
                            }}>
                              📤 Output
                            </div>
                            <pre style={{
                              fontSize: "0.8rem", lineHeight: 1.5, color: "var(--text)",
                              background: "var(--border)", borderRadius: 6, padding: "0.75rem",
                              overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word",
                              margin: 0, fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
                            }}>
                              {a.detail.output}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
