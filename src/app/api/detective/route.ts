import { NextResponse } from "next/server";

interface Activity {
  timestamp: string;
  action: string;
  summary: string;
  channel: string;
  status: "success" | "failed" | "skipped";
  details?: Record<string, unknown>;
}

function generateDemoData(): Activity[] {
  const now = new Date();
  const activities: Activity[] = [];

  const templates: Omit<Activity, "timestamp">[] = [
    { action: "briefing_sent", summary: "Morning briefing delivered to Telegram", channel: "telegram", status: "success" },
    { action: "email_check", summary: "Scanned Gmail inbox — 3 new emails, 1 flagged", channel: "gmail", status: "success", details: { newEmails: 3, flagged: 1 } },
    { action: "calendar_check", summary: "Checked calendar — 2 meetings today", channel: "calendar", status: "success", details: { meetings: 2 } },
    { action: "slack_check", summary: "Checked Slack DMs and #rag channel", channel: "slack", status: "success", details: { unread: 5 } },
    { action: "rag_monitor", summary: "Monitored #rag for new questions — none pending", channel: "slack", status: "success" },
    { action: "reminder_set", summary: "Set reminder: Review PR before standup", channel: "internal", status: "success" },
    { action: "code_change", summary: "Pushed fix to martinmexia.com repo", channel: "github", status: "success", details: { repo: "martinmexia.com", branch: "main" } },
    { action: "search", summary: "Searched web for Next.js deployment best practices", channel: "browser", status: "success" },
    { action: "slack_check", summary: "Checked Slack — replied to 2 DMs", channel: "slack", status: "success", details: { replied: 2 } },
    { action: "email_check", summary: "Gmail check — no new important emails", channel: "gmail", status: "success" },
    { action: "calendar_check", summary: "Next meeting in 45 minutes: Team sync", channel: "calendar", status: "success" },
    { action: "reflection", summary: "Daily reflection: 14 tasks completed, all systems nominal", channel: "internal", status: "success" },
    { action: "message_sent", summary: "Sent daily summary to Martin via Telegram", channel: "telegram", status: "success" },
    { action: "cron_job", summary: "Ran scheduled inbox + calendar check", channel: "internal", status: "success" },
    { action: "slack_check", summary: "Slack check — new thread in #engineering", channel: "slack", status: "success" },
    { action: "error", summary: "Failed to fetch Jira board — API timeout", channel: "internal", status: "failed", details: { error: "ETIMEDOUT" } },
    { action: "browser_action", summary: "Opened Vercel dashboard to check deployment status", channel: "browser", status: "success" },
    { action: "rag_monitor", summary: "New question in #rag — drafted response", channel: "slack", status: "success" },
    { action: "email_check", summary: "Gmail scan — 1 email from HR flagged", channel: "gmail", status: "success", details: { flagged: 1 } },
    { action: "slack_check", summary: "Periodic Slack check — all clear", channel: "slack", status: "skipped" },
    { action: "code_change", summary: "Committed memory updates to openclaw repo", channel: "github", status: "success" },
    { action: "reminder_set", summary: "Set reminder: Follow up on deployment", channel: "internal", status: "success" },
    { action: "calendar_check", summary: "Tomorrow's schedule: 3 meetings, 1 focus block", channel: "calendar", status: "success" },
    { action: "briefing_sent", summary: "Evening recap sent to Telegram", channel: "telegram", status: "success" },
  ];

  // Spread activities across last 24 hours
  for (let i = 0; i < templates.length; i++) {
    const minutesAgo = Math.floor((i / templates.length) * 24 * 60);
    const ts = new Date(now.getTime() - minutesAgo * 60 * 1000);
    activities.push({ ...templates[i], timestamp: ts.toISOString() });
  }

  return activities.reverse(); // oldest first
}

export async function GET() {
  const activities = generateDemoData();
  const now = new Date();

  const successCount = activities.filter((a) => a.status === "success").length;
  const successRate = Math.round((successCount / activities.length) * 100);

  // Channel counts
  const channelCounts: Record<string, number> = {};
  activities.forEach((a) => {
    channelCounts[a.channel] = (channelCounts[a.channel] || 0) + 1;
  });
  const topChannels = Object.entries(channelCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([channel, count]) => ({ channel, count }));

  // Hourly timeline (last 24h)
  const timeline: { hour: string; count: number }[] = [];
  for (let i = 23; i >= 0; i--) {
    const hourStart = new Date(now.getTime() - i * 3600000);
    const hourEnd = new Date(hourStart.getTime() + 3600000);
    const label = hourStart.toISOString().slice(11, 16);
    const count = activities.filter((a) => {
      const t = new Date(a.timestamp);
      return t >= hourStart && t < hourEnd;
    }).length;
    timeline.push({ hour: label, count });
  }

  return NextResponse.json({
    activities: activities.slice().reverse(), // newest first
    stats: {
      totalActions: activities.length,
      successRate,
      lastActive: activities[activities.length - 1]?.timestamp,
      topChannels,
      actionsToday: activities.length,
    },
    timeline,
  });
}
