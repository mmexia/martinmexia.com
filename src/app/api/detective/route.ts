import { NextResponse } from "next/server";

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

function generateDemoData(): Activity[] {
  const now = new Date();
  const activities: Activity[] = [];

  const templates: Omit<Activity, "timestamp">[] = [
    {
      action: "briefing_sent", summary: "Morning briefing delivered to Telegram", channel: "telegram", status: "success",
      detail: {
        whatHappened: "Compiled and sent the morning briefing to Martin via Telegram. Included calendar summary, overnight notifications, and pending tasks.",
        thinking: "It's 8:00 AM — time for the daily briefing per the morning routine protocol.",
        instructionsFollowed: "protocols/DAILY_BRIEFING.md → 'Send morning briefing at 8 AM'",
        innerThoughts: "Considered including the Jira sprint summary but skipped it — Martin mentioned he doesn't check Jira on Mondays. Kept it focused on calendar + inbox.",
        output: "📋 Good morning Martin!\n\n📅 Today: 2 meetings (10am Team Sync, 2pm 1:1 with Sarah)\n📧 3 emails overnight (1 flagged from HR)\n✅ Pending: Review PR #142, Follow up on deployment\n\nHave a great day!",
      },
    },
    {
      action: "email_check", summary: "Scanned Gmail inbox — 3 new emails, 1 flagged", channel: "gmail", status: "success", details: { newEmails: 3, flagged: 1 },
      detail: {
        whatHappened: "Scanned Gmail inbox. Found 3 new emails since last check. Flagged 1 from HR about benefits enrollment deadline.",
        thinking: "Heartbeat triggered periodic inbox check. Last scan was 45 minutes ago.",
        instructionsFollowed: "HEARTBEAT.md → 'Check Gmail inbox'",
        innerThoughts: "The HR email has a deadline (Friday). Flagged it as important. The other 2 were newsletters — skipped those. Considered sending Martin a heads-up but it's not urgent enough to interrupt.",
        output: "From: hr@company.com — 'Benefits Enrollment Reminder' [FLAGGED]\nFrom: newsletter@techcrunch.com — 'Daily Digest' [skipped]\nFrom: notifications@github.com — 'PR Review Request' [skipped — already tracked in GitHub]",
      },
    },
    {
      action: "calendar_check", summary: "Checked calendar — 2 meetings today", channel: "calendar", status: "success", details: { meetings: 2 },
      detail: {
        whatHappened: "Pulled today's calendar. Found 2 meetings: Team Sync at 10am and 1:1 with Sarah at 2pm.",
        thinking: "Part of the morning briefing prep — need to know today's schedule.",
        instructionsFollowed: "protocols/DAILY_BRIEFING.md → 'Pull calendar for today and tomorrow'",
        innerThoughts: "Team Sync has no agenda attached — might be worth flagging. The 1:1 has prep notes from last week. Decided not to remind Martin about prep yet — will do 30 min before.",
        output: "10:00 AM - Team Sync (recurring, no agenda)\n2:00 PM - 1:1 with Sarah (has prep notes)\nNo conflicts detected.",
      },
    },
    {
      action: "slack_check", summary: "Checked Slack DMs and #rag channel", channel: "slack", status: "success", details: { unread: 5 },
      detail: {
        whatHappened: "Checked Slack DMs (2 unread) and #rag channel (3 unread). No pending questions requiring response.",
        thinking: "Periodic Slack check per heartbeat schedule. Last check was 32 minutes ago.",
        instructionsFollowed: "HEARTBEAT.md → 'Check Slack DMs' + 'Monitor #rag for questions'",
        innerThoughts: "DM from Alice asking about PR — Martin needs to handle this one personally. DM from Bob was just 'Thanks!' — no action needed. #rag had 3 messages but they were a resolved thread. Skipped #general — too noisy.",
        output: "DMs:\n  @alice: 'Hey, can you review PR #142? It's blocking the release'\n  @bob: 'Thanks!'\n#rag:\n  Thread about vector DB indexing — resolved by @carol\n  No pending questions.",
      },
    },
    {
      action: "rag_monitor", summary: "Monitored #rag for new questions — none pending", channel: "slack", status: "success",
      detail: {
        whatHappened: "Monitored #rag channel for new unanswered questions. None found.",
        thinking: "Scheduled #rag monitoring — Martin wants quick response times on this channel.",
        instructionsFollowed: "HEARTBEAT.md → 'Monitor #rag for questions'",
        innerThoughts: "Channel has been quiet today. Last question was 6 hours ago and was resolved. Considered posting a 'channel health' update but that would be noise.",
        output: "No unanswered questions in #rag.\nLast activity: 6h ago (resolved thread).",
      },
    },
    {
      action: "reminder_set", summary: "Set reminder: Review PR before standup", channel: "internal", status: "success",
      detail: {
        whatHappened: "Created a reminder for Martin to review PR #142 before the 10am Team Sync.",
        thinking: "Alice's DM mentioned PR #142 is blocking the release. Team Sync is at 10am — Martin should review before then.",
        instructionsFollowed: "HEARTBEAT.md → 'Set reminders for time-sensitive items'",
        innerThoughts: "Weighed sending an immediate Telegram message vs. a timed reminder. Went with reminder at 9:30am — gives Martin time to settle in without being nagged immediately.",
        output: "Reminder set: 'Review PR #142 before standup' → 9:30 AM today\nDelivery: Telegram",
      },
    },
    {
      action: "code_change", summary: "Pushed fix to martinmexia.com repo", channel: "github", status: "success", details: { repo: "martinmexia.com", branch: "main" },
      detail: {
        whatHappened: "Pushed a CSS fix to the martinmexia.com repo — fixed mobile padding on the hero section.",
        thinking: "Martin mentioned the hero section looked off on iPhone during yesterday's review. Found the issue: padding was using rem instead of responsive units.",
        instructionsFollowed: "memory/2025-02-18.md → 'Martin noted hero padding issue on mobile'",
        innerThoughts: "Simple fix — changed padding from 4rem to clamp(1.5rem, 5vw, 4rem). Tested in responsive mode. Considered also fixing the nav spacing but keeping this PR focused.",
        output: "git commit -m 'fix: responsive hero padding on mobile'\ngit push origin main\n\nVercel auto-deploy triggered.\nDeploy URL: https://martinmexia.com\nStatus: ✅ Build succeeded",
      },
    },
    {
      action: "search", summary: "Searched web for Next.js deployment best practices", channel: "browser", status: "success",
      detail: {
        whatHappened: "Searched for Next.js 14 deployment optimization techniques. Found 3 relevant articles.",
        thinking: "Martin's site build time has been increasing. Researching optimization strategies proactively.",
        instructionsFollowed: "Self-initiated — proactive research based on observed build time trend",
        innerThoughts: "Build went from 45s to 72s over the past week. Likely due to new pages. Found that Next.js 14 has improved ISR that could help. Will suggest to Martin if build time keeps increasing.",
        output: "Search: 'Next.js 14 deployment optimization build time'\nResults:\n1. vercel.com/blog/next-14-performance — ISR improvements\n2. nextjs.org/docs/app/building-your-application — Static generation tips\n3. dev.to/article — 'Reducing Next.js build times by 60%'\n\nKey takeaway: Enable partial prerendering for dynamic routes.",
      },
    },
    {
      action: "slack_check", summary: "Checked Slack — replied to 2 DMs", channel: "slack", status: "success", details: { replied: 2 },
      detail: {
        whatHappened: "Checked Slack DMs. Replied to 2 messages on Martin's behalf — acknowledged Alice's PR request and answered Bob's question about the API.",
        thinking: "Periodic Slack check. Found 2 DMs requiring response — both were simple enough to handle without escalating to Martin.",
        instructionsFollowed: "HEARTBEAT.md → 'Check Slack DMs' + protocols/COMMUNICATION.md → 'Reply to simple queries autonomously'",
        innerThoughts: "Alice's message was a follow-up on PR #142 — told her Martin will review by standup. Bob asked about the API rate limits — I know the answer from the docs. Didn't escalate either since both are low-risk responses.",
        output: "Reply to @alice: 'Martin will review PR #142 before the 10am sync 👍'\nReply to @bob: 'Rate limit is 100 req/min per API key. Docs: docs.y.uno/api/limits'",
      },
    },
    {
      action: "email_check", summary: "Gmail check — no new important emails", channel: "gmail", status: "success",
      detail: {
        whatHappened: "Scanned Gmail inbox. 1 new email — promotional, no action needed.",
        thinking: "Scheduled inbox check. Last scan was 40 minutes ago.",
        instructionsFollowed: "HEARTBEAT.md → 'Check Gmail inbox'",
        innerThoughts: "Only a promotional email from AWS about re:Invent. Not relevant right now. Inbox is clean.",
        output: "From: aws-marketing@amazon.com — 'AWS re:Invent 2025 Early Bird' [promotional, skipped]\nNo action items.",
      },
    },
    {
      action: "calendar_check", summary: "Next meeting in 45 minutes: Team sync", channel: "calendar", status: "success",
      detail: {
        whatHappened: "Checked upcoming meetings. Team Sync is in 45 minutes. Sent pre-meeting heads-up to Martin.",
        thinking: "Proactive calendar check — want to give Martin prep time before the meeting.",
        instructionsFollowed: "protocols/DAILY_BRIEFING.md → 'Alert 30-60 min before meetings'",
        innerThoughts: "Team Sync still has no agenda. Considered pinging the meeting organizer but that's not my role. Will just remind Martin so he can add items if needed.",
        output: "⏰ Heads up: Team Sync in 45 minutes (10:00 AM)\nNo agenda attached.\nAttendees: Martin, Sarah, Carlos, Dev team",
      },
    },
    {
      action: "reflection", summary: "Daily reflection: 14 tasks completed, all systems nominal", channel: "internal", status: "success",
      detail: {
        whatHappened: "Ran end-of-day reflection. 14 tasks completed, 1 failed (Jira timeout), 1 skipped. Overall success rate: 87%.",
        thinking: "End of active hours — time to summarize the day and identify patterns.",
        instructionsFollowed: "protocols/DAILY_BRIEFING.md → 'End-of-day reflection'",
        innerThoughts: "Good day overall. The Jira timeout is a recurring issue — third time this week. Should flag this to Martin as a potential infrastructure problem. Success rate dipped because of that one failure.",
        output: "Daily Summary:\n  Total actions: 16\n  Successful: 14 (87.5%)\n  Failed: 1 (Jira API timeout)\n  Skipped: 1 (Slack #general — low priority)\n\nPatterns noted:\n  - Jira API timeout 3x this week\n  - Slack DM volume increasing\n  - Build times trending up on martinmexia.com",
      },
    },
    {
      action: "message_sent", summary: "Sent daily summary to Martin via Telegram", channel: "telegram", status: "success",
      detail: {
        whatHappened: "Composed and sent the evening summary message to Martin via Telegram.",
        thinking: "End of day — Martin expects a summary of what I did and what needs his attention.",
        instructionsFollowed: "protocols/DAILY_BRIEFING.md → 'Send evening recap'",
        innerThoughts: "Kept it concise — Martin prefers bullet points. Highlighted the Jira issue since it's recurring. Didn't mention the newsletters I skipped — that's noise.",
        output: "📊 Evening Recap\n\n✅ 14 actions completed\n📧 Inbox clean (1 HR email flagged — benefits deadline Friday)\n💬 Replied to 2 Slack DMs\n🔧 Fixed mobile hero padding on martinmexia.com\n⚠️ Jira API timed out again (3rd time this week)\n\n📌 Needs your attention:\n- Review PR #142 (blocking release)\n- Benefits enrollment deadline Friday",
      },
    },
    {
      action: "cron_job", summary: "Ran scheduled inbox + calendar check", channel: "internal", status: "success",
      detail: {
        whatHappened: "Executed scheduled cron job: combined inbox and calendar check.",
        thinking: "Cron trigger fired at the scheduled interval. Batching inbox + calendar into one check for efficiency.",
        instructionsFollowed: "HEARTBEAT.md → batch check (Gmail + Calendar)",
        innerThoughts: "Batching these two saves an API call cycle. Nothing new in either — inbox clean, no calendar changes. Quick check, moving on.",
        output: "Gmail: 0 new emails\nCalendar: No changes since last check\nExecution time: 1.2s",
      },
    },
    {
      action: "slack_check", summary: "Slack check — new thread in #engineering", channel: "slack", status: "success",
      detail: {
        whatHappened: "Found a new thread in #engineering about a production incident. Monitoring but not escalating yet.",
        thinking: "Periodic Slack check picked up activity in #engineering. Assessing severity.",
        instructionsFollowed: "HEARTBEAT.md → 'Check Slack channels'",
        innerThoughts: "Thread is about a minor CSS regression in production. Not related to Martin's work. Carlos is already on it. Will only escalate if it affects martinmexia.com or Yuno dashboards.",
        output: "#engineering thread: 'CSS regression on dashboard sidebar'\nStarted by: @carlos\nSeverity: Minor (cosmetic)\nStatus: Carlos investigating\nAction: Monitoring, no escalation needed.",
      },
    },
    {
      action: "error", summary: "Failed to fetch Jira board — API timeout", channel: "internal", status: "failed", details: { error: "ETIMEDOUT" },
      detail: {
        whatHappened: "Attempted to fetch the Jira sprint board for Martin's project. API request timed out after 30 seconds.",
        thinking: "Scheduled Jira check to include sprint status in the daily summary.",
        instructionsFollowed: "HEARTBEAT.md → 'Check Jira board status'",
        innerThoughts: "This is the 3rd timeout this week. The Jira instance might be under heavy load or there's a network issue. Retried once, still failed. Not critical — Martin doesn't rely heavily on Jira. Will mention in the daily summary as a pattern.",
        output: "Error: ETIMEDOUT\nEndpoint: https://yuno.atlassian.net/rest/agile/1.0/board/42/sprint\nTimeout: 30000ms\nRetries: 1/1\nLast successful fetch: 18h ago",
      },
    },
    {
      action: "browser_action", summary: "Opened Vercel dashboard to check deployment status", channel: "browser", status: "success",
      detail: {
        whatHappened: "Opened the Vercel dashboard to verify that the martinmexia.com deployment succeeded after the CSS fix push.",
        thinking: "I pushed a code change earlier — should verify the deployment went through cleanly.",
        instructionsFollowed: "Self-initiated — post-deploy verification",
        innerThoughts: "Build succeeded in 52 seconds. That's up from 45s last week but still reasonable. Checked the preview — hero padding looks correct on mobile viewport. No errors in build log.",
        output: "Vercel Dashboard: martinmexia.com\nLatest deploy: ✅ Ready\nBuild time: 52s\nCommit: 'fix: responsive hero padding on mobile'\nURL: https://martinmexia-com-git-main.vercel.app",
      },
    },
    {
      action: "rag_monitor", summary: "New question in #rag — drafted response", channel: "slack", status: "success",
      detail: {
        whatHappened: "New question in #rag from @dave about vector DB indexing strategy. Drafted a response using internal docs.",
        thinking: "Monitoring #rag picked up a new unanswered question. It's been 10 minutes with no reply — I can help.",
        instructionsFollowed: "HEARTBEAT.md → 'Monitor #rag for questions' + protocols/RAG_SUPPORT.md → 'Draft responses for technical questions'",
        innerThoughts: "Dave's question is about HNSW vs IVF indexing. I found the answer in our internal docs (Confluence page on vector DB architecture). Drafted a response but didn't post — Martin prefers to review #rag answers before they go out.",
        output: "Draft response for @dave:\n\n'For our use case, HNSW is recommended for <1M vectors with high recall requirements. IVF is better for larger datasets where you can trade some recall for speed. See: confluence.yuno.com/wiki/vector-db-architecture\n\nTL;DR: Start with HNSW, switch to IVF when you hit scale issues.'\n\nStatus: Draft saved, awaiting Martin's review.",
      },
    },
    {
      action: "email_check", summary: "Gmail scan — 1 email from HR flagged", channel: "gmail", status: "success", details: { flagged: 1 },
      detail: {
        whatHappened: "Gmail scan found a follow-up from HR about benefits enrollment. Deadline is Friday.",
        thinking: "Periodic inbox check. The HR thread has a new reply.",
        instructionsFollowed: "HEARTBEAT.md → 'Check Gmail inbox'",
        innerThoughts: "This is the second email about benefits enrollment. Deadline is Friday — 3 days away. Important enough to flag but not urgent enough for an immediate ping. Already included in the evening summary.",
        output: "From: hr@company.com — 'RE: Benefits Enrollment — Reminder'\nBody: 'Hi Martin, just a reminder that the enrollment window closes Friday at 5pm. Please complete your selections in Workday.'\nAction: Flagged, included in evening summary.",
      },
    },
    {
      action: "slack_check", summary: "Periodic Slack check — all clear", channel: "slack", status: "skipped",
      detail: {
        whatHappened: "Ran periodic Slack check. No new DMs, no activity in monitored channels since last check.",
        thinking: "Scheduled check, but nothing new to process.",
        instructionsFollowed: "HEARTBEAT.md → 'Check Slack DMs'",
        innerThoughts: "Last check was only 20 minutes ago and it's end of day. Activity has slowed down. Marking as skipped since there was nothing to do. Will reduce check frequency for the evening.",
        output: "DMs: 0 new\n#rag: No new messages\n#engineering: Thread resolved\nStatus: All clear, reducing check frequency.",
      },
    },
    {
      action: "code_change", summary: "Committed memory updates to openclaw repo", channel: "github", status: "success",
      detail: {
        whatHappened: "Committed today's memory notes and updated MEMORY.md with key learnings.",
        thinking: "End of day — persisting what I learned today for future sessions.",
        instructionsFollowed: "AGENTS.md → 'Capture what matters in daily notes and MEMORY.md'",
        innerThoughts: "Key things to remember: Jira API is unstable this week, Martin prefers bullet-point summaries, build times are trending up. Updated MEMORY.md with these patterns. Cleaned up some outdated notes from last week.",
        output: "git add memory/2025-02-19.md MEMORY.md\ngit commit -m 'chore: daily memory update'\ngit push origin main\n\nFiles changed: 2\nInsertions: +34\nDeletions: -8",
      },
    },
    {
      action: "reminder_set", summary: "Set reminder: Follow up on deployment", channel: "internal", status: "success",
      detail: {
        whatHappened: "Set a reminder for tomorrow morning to verify the martinmexia.com deployment is stable after 24h.",
        thinking: "The CSS fix deployed today. Good practice to check stability after a day.",
        instructionsFollowed: "Self-initiated — post-deploy follow-up",
        innerThoughts: "The deploy looked clean but I want to verify no edge cases pop up. Setting a morning reminder so I check it during tomorrow's briefing prep.",
        output: "Reminder set: 'Verify martinmexia.com deploy stability' → Tomorrow 7:45 AM\nDelivery: Internal (part of briefing prep)",
      },
    },
    {
      action: "calendar_check", summary: "Tomorrow's schedule: 3 meetings, 1 focus block", channel: "calendar", status: "success",
      detail: {
        whatHappened: "Pulled tomorrow's calendar for the evening recap. 3 meetings and a 2-hour focus block.",
        thinking: "Preparing tomorrow's preview for the evening summary.",
        instructionsFollowed: "protocols/DAILY_BRIEFING.md → 'Include tomorrow preview in evening recap'",
        innerThoughts: "Tomorrow is heavier than today — 3 meetings vs 2. The focus block is from 11am-1pm which is good. No conflicts detected. Martin might want to prep for the product review — will include a reminder.",
        output: "Tomorrow (Feb 20):\n  9:00 AM - Standup (15 min)\n  11:00 AM - Focus Block (2h) 🔒\n  1:30 PM - Product Review with stakeholders\n  3:00 PM - 1:1 with Manager\n\nNote: Product Review may need prep.",
      },
    },
    {
      action: "briefing_sent", summary: "Evening recap sent to Telegram", channel: "telegram", status: "success",
      detail: {
        whatHappened: "Compiled and sent the evening recap to Martin via Telegram. Included today's summary, action items, and tomorrow's preview.",
        thinking: "End of active hours — time for the final summary of the day.",
        instructionsFollowed: "protocols/DAILY_BRIEFING.md → 'Send evening recap'",
        innerThoughts: "Kept the recap structured: what was done, what needs attention, what's tomorrow. Highlighted the recurring Jira issue — Martin should know about infrastructure problems. Didn't include every small check — just the highlights.",
        output: "🌙 Evening Recap — Feb 19\n\n✅ Done today: 14 actions, 87% success rate\n🔧 Fixed: Mobile hero padding on martinmexia.com\n💬 Handled: 2 Slack DMs, 1 #rag draft\n📧 Flagged: HR benefits deadline (Friday)\n\n⚠️ Issues:\n- Jira API timeout (3rd time this week)\n\n📌 Action items:\n- Review PR #142 (blocking release)\n- Benefits enrollment by Friday\n- Review #rag draft response\n\n📅 Tomorrow: 3 meetings + focus block\n  Product Review at 1:30 PM (may need prep)",
      },
    },
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
