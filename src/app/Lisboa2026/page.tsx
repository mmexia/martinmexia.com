"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────── YUNO BRAND COLORS ─────────────────────── */
const COLORS = {
  primary: "#3E4FE0",
  primaryDark: "#2A3BB8",
  primaryLight: "#5C6CF7",
  dark: "#0A0B1A",
  darkCard: "#12132A",
  darkSurface: "#1A1B35",
  accent: "#3BFF9D",
  accentAlt: "#DDE460",
  text: "#FFFFFF",
  textMuted: "#8E95B5",
  cardBlue: "rgba(62, 79, 224, 0.15)",
  cardPurple: "rgba(126, 65, 233, 0.15)",
  cardGreen: "rgba(59, 255, 157, 0.15)",
  cardOrange: "rgba(255, 94, 0, 0.15)",
  // Matrix colors
  matrixBlue: "#4d65ff",
  matrixPurple: "#7E41E9",
  matrixGreen: "#3BFF9D",
  matrixOrange: "#FF5E00",
};

/* ─────────────────────── SLIDE WRAPPER ─────────────────────── */
function Slide({
  children,
  active,
  index,
}: {
  children: React.ReactNode;
  active: boolean;
  index: number;
}) {
  return (
    <section
      className="slide"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 80px",
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
        transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)",
        pointerEvents: active ? "auto" : "none",
        overflow: "auto",
      }}
    >
      {children}
    </section>
  );
}

/* ─────────────────────── ANIMATED COUNTER ─────────────────────── */
function AnimatedText({
  children,
  delay = 0,
  active,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  active: boolean;
  direction?: "up" | "left" | "right";
}) {
  const translateFrom =
    direction === "up"
      ? "translateY(40px)"
      : direction === "left"
      ? "translateX(-40px)"
      : "translateX(40px)";
  return (
    <div
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translate(0)" : translateFrom,
        transition: `opacity 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}s, transform 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────── GLOWING ORB BG ─────────────────────── */
function BackgroundOrbs() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.primary}30, transparent 70%)`,
          top: "-10%",
          right: "-10%",
          animation: "float1 15s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.accent}20, transparent 70%)`,
          bottom: "-10%",
          left: "-5%",
          animation: "float2 18s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.matrixPurple}15, transparent 70%)`,
          top: "40%",
          left: "50%",
          animation: "float3 20s ease-in-out infinite",
        }}
      />
    </div>
  );
}

/* ─────────────────────── PROGRESS BAR ─────────────────────── */
function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: "rgba(255,255,255,0.05)",
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${((current + 1) / total) * 100}%`,
          background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`,
          transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: `0 0 20px ${COLORS.accent}50`,
        }}
      />
    </div>
  );
}

/* ─────────────────────── SLIDE NAV DOTS ─────────────────────── */
function NavDots({
  current,
  total,
  onNav,
}: {
  current: number;
  total: number;
  onNav: (i: number) => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        right: 30,
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        zIndex: 100,
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onNav(i)}
          style={{
            width: current === i ? 12 : 8,
            height: current === i ? 12 : 8,
            borderRadius: "50%",
            border: "none",
            background:
              current === i
                ? COLORS.accent
                : "rgba(255,255,255,0.2)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow:
              current === i ? `0 0 12px ${COLORS.accent}60` : "none",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────── VALUE CARD ─────────────────────── */
function ValueCard({
  icon,
  title,
  description,
  active,
  delay,
  color,
}: {
  icon: string;
  title: string;
  description: string;
  active: boolean;
  delay: number;
  color: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <AnimatedText active={active} delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered
            ? `linear-gradient(135deg, ${color}25, ${color}10)`
            : `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))`,
          border: `1px solid ${hovered ? color + "60" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 20,
          padding: "40px 32px",
          textAlign: "center",
          transition: "all 0.4s ease",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered ? `0 20px 60px ${color}15` : "none",
          minWidth: 280,
          maxWidth: 320,
          backdropFilter: "blur(20px)",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
        <h3
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: COLORS.text,
            margin: "0 0 12px",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: 15,
            color: COLORS.textMuted,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </AnimatedText>
  );
}

/* ─────────────────────── MATRIX COMPONENT ─────────────────────── */
function OrgMatrix({ active }: { active: boolean }) {
  const platformGroups = [
    {
      label: "Core Platforms",
      color: "#4d65ff20",
      rows: ["Core", "Routing"],
    },
    {
      label: "Internal",
      color: "#7E41E920",
      rows: ["Data Enablement", "Internal Tools & Architecture"],
    },
    {
      label: "Experience",
      color: "#3BFF9D15",
      rows: ["Dashboard", "Checkout", "SDK & Plugins"],
    },
  ];

  const businessUnits = [
    {
      group: "Business Units",
      units: [
        {
          label: "Cards",
          subs: ["Card Payments & Integrations", "Tokenization"],
          color: "#4d65ff",
          bg: "#4d65ff18",
        },
        {
          label: "APMs",
          subs: ["APM Integrations"],
          color: "#7E41E9",
          bg: "#7E41E918",
        },
        {
          label: "Payment Ancillaries",
          subs: ["Core Ancillaries", "Reconciliations"],
          color: "#3BFF9D",
          bg: "#3BFF9D15",
        },
      ],
    },
    {
      group: "New Bets",
      units: [
        {
          label: "New Bets",
          subs: ["Banking Connectivity", "Agentic Payments", "Banking Tech / WhiteLabel"],
          color: "#FF5E00",
          bg: "#FF5E0018",
        },
      ],
    },
  ];

  const allSubs = businessUnits.flatMap((g) =>
    g.units.flatMap((u) => u.subs.map((s) => ({ sub: s, color: u.color, bg: u.bg })))
  );
  const allRows = platformGroups.flatMap((g) => g.rows);

  return (
    <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
      <div
        style={{
          overflowX: "auto",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(20px)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 900,
          }}
        >
          <thead>
            {/* Tier 1 */}
            <tr>
              <th
                colSpan={2}
                style={{
                  padding: "12px 16px",
                  background: "transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              />
              {businessUnits.map((g) => (
                <th
                  key={g.group}
                  colSpan={g.units.reduce((a, u) => a + u.subs.length, 0)}
                  style={{
                    padding: "14px 16px",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: COLORS.textMuted,
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    textAlign: "center",
                  }}
                >
                  {g.group}
                </th>
              ))}
            </tr>
            {/* Tier 2 - Unit labels */}
            <tr>
              <th
                colSpan={2}
                style={{
                  padding: "10px 16px",
                  background: "transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              />
              {businessUnits.flatMap((g) =>
                g.units.map((u) => (
                  <th
                    key={u.label}
                    colSpan={u.subs.length}
                    style={{
                      padding: "10px 8px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: u.color,
                      borderBottom: `2px solid ${u.color}40`,
                      textAlign: "center",
                    }}
                  >
                    {u.label}
                  </th>
                ))
              )}
            </tr>
            {/* Tier 3 - Sub columns */}
            <tr>
              <th
                colSpan={2}
                style={{
                  padding: "10px 16px",
                  background: "transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              />
              {allSubs.map((s) => (
                <th
                  key={s.sub}
                  style={{
                    padding: "10px 8px",
                    fontSize: 11,
                    fontWeight: 500,
                    color: COLORS.textMuted,
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.sub}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {platformGroups.map((group, gi) =>
              group.rows.map((row, ri) => (
                <AnimatedText
                  key={row}
                  active={active}
                  delay={0.3 + (gi * group.rows.length + ri) * 0.08}
                >
                  <tr>
                    {ri === 0 && (
                      <td
                        rowSpan={group.rows.length}
                        style={{
                          padding: "12px 16px",
                          fontSize: 12,
                          fontWeight: 700,
                          color: COLORS.textMuted,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          writingMode: "vertical-rl",
                          textOrientation: "mixed",
                          transform: "rotate(180deg)",
                          textAlign: "center",
                          background: group.color,
                          borderRight: "1px solid rgba(255,255,255,0.06)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {group.label}
                      </td>
                    )}
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: 14,
                        fontWeight: 600,
                        color: COLORS.text,
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row}
                    </td>
                    {allSubs.map((s) => (
                      <td
                        key={`${row}-${s.sub}`}
                        style={{
                          padding: 8,
                          background: s.bg,
                          borderBottom: "1px solid rgba(255,255,255,0.03)",
                          borderLeft: "1px solid rgba(255,255,255,0.03)",
                          minWidth: 80,
                        }}
                      />
                    ))}
                  </tr>
                </AnimatedText>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p
        style={{
          textAlign: "center",
          fontSize: 13,
          color: COLORS.textMuted,
          marginTop: 20,
          opacity: 0.7,
        }}
      >
        Product Teams own the full stack — Backend, Frontend, Mobile
      </p>
      <p
        style={{
          textAlign: "center",
          fontSize: 13,
          color: COLORS.accent,
          marginTop: 8,
          opacity: 0.8,
        }}
      >
        ✦ Pending tech initiatives will unblock cross-team PRs to different codebases
      </p>
    </div>
  );
}

/* ─────────────────────── CYCLE VISUALIZATION ─────────────────────── */
function CycleVisualization({ active }: { active: boolean }) {
  return (
    <div style={{ width: "100%", maxWidth: 1000, margin: "0 auto" }}>
      {/* Timeline Container */}
      <div style={{ position: "relative", padding: "40px 0" }}>
        {/* Main timeline line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "5%",
            right: "5%",
            height: 3,
            background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent}, ${COLORS.primary})`,
            transform: "translateY(-50%)",
            opacity: active ? 1 : 0,
            transition: "opacity 0.8s ease 0.2s",
            borderRadius: 2,
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            padding: "0 5%",
          }}
        >
          {/* Week 0 — Cycle Start */}
          <AnimatedText active={active} delay={0.3}>
            <div style={{ textAlign: "center", position: "relative" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: 28,
                  boxShadow: `0 0 30px ${COLORS.primary}40`,
                  border: `2px solid ${COLORS.primary}60`,
                }}
              >
                🚀
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: COLORS.text,
                  marginBottom: 4,
                }}
              >
                Cycle Start
              </div>
              <div style={{ fontSize: 12, color: COLORS.textMuted }}>
                Week 0
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontSize: 12,
                  color: COLORS.accent,
                  fontWeight: 600,
                  background: `${COLORS.accent}15`,
                  padding: "6px 12px",
                  borderRadius: 8,
                }}
              >
                Key Milestones Defined
              </div>
            </div>
          </AnimatedText>

          {/* Mid-Cycle — Review */}
          <AnimatedText active={active} delay={0.6}>
            <div style={{ textAlign: "center", position: "relative" }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${COLORS.accentAlt}40, ${COLORS.accentAlt}20)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: 32,
                  boxShadow: `0 0 30px ${COLORS.accentAlt}30`,
                  border: `2px solid ${COLORS.accentAlt}50`,
                }}
              >
                🔍
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: COLORS.text,
                  marginBottom: 4,
                }}
              >
                Mid-Cycle Review
              </div>
              <div style={{ fontSize: 12, color: COLORS.textMuted }}>
                Week 4
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontSize: 12,
                  color: COLORS.accentAlt,
                  fontWeight: 600,
                  background: `${COLORS.accentAlt}15`,
                  padding: "6px 12px",
                  borderRadius: 8,
                }}
              >
                Assess & Adjust if Needed
              </div>
            </div>
          </AnimatedText>

          {/* Cycle End — Delivery */}
          <AnimatedText active={active} delay={0.9}>
            <div style={{ textAlign: "center", position: "relative" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${COLORS.accent}40, ${COLORS.accent}20)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: 28,
                  boxShadow: `0 0 30px ${COLORS.accent}30`,
                  border: `2px solid ${COLORS.accent}50`,
                }}
              >
                ✅
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: COLORS.text,
                  marginBottom: 4,
                }}
              >
                Cycle Delivery
              </div>
              <div style={{ fontSize: 12, color: COLORS.textMuted }}>
                Week 8
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontSize: 12,
                  color: COLORS.accent,
                  fontWeight: 600,
                  background: `${COLORS.accent}15`,
                  padding: "6px 12px",
                  borderRadius: 8,
                }}
              >
                Milestones MUST be Delivered
              </div>
            </div>
          </AnimatedText>
        </div>
      </div>

      {/* Bottom callout */}
      <AnimatedText active={active} delay={1.2}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            marginTop: 40,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: "20px 28px",
              textAlign: "center",
              backdropFilter: "blur(20px)",
              maxWidth: 280,
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>📋</div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: COLORS.text,
                marginBottom: 6,
              }}
            >
              Mandatory Milestones
            </div>
            <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.5 }}>
              Every cycle has key milestones that <strong style={{ color: COLORS.accent }}>MUST</strong> be delivered. Non-negotiable.
            </div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: "20px 28px",
              textAlign: "center",
              backdropFilter: "blur(20px)",
              maxWidth: 280,
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>🔄</div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: COLORS.text,
                marginBottom: 6,
              }}
            >
              Mid-Cycle Flexibility
            </div>
            <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.5 }}>
              At the midpoint, we review progress and can adjust scope if needed.
            </div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: "20px 28px",
              textAlign: "center",
              backdropFilter: "blur(20px)",
              maxWidth: 280,
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>⚡</div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: COLORS.text,
                marginBottom: 6,
              }}
            >
              Always Open to Inject
            </div>
            <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.5 }}>
              Critical work can <strong style={{ color: COLORS.accentAlt }}>ALWAYS</strong> be injected when needed. We stay agile.
            </div>
          </div>
        </div>
      </AnimatedText>
    </div>
  );
}

/* ─────────────────────── STRATEGIC PROJECTS TABLE ─────────────────────── */
const STRATEGIC_PROJECTS = [
  { name: "White Label (Zuora)", status: "Not Started", priority: "P0", pillar: "Strategic", owner: "TBD" },
  { name: "Agentic Payments", status: "Not Started", priority: "P0", pillar: "Strategic", owner: "Bea / TBD" },
  { name: "3DS", status: "In Progress", priority: "P0", pillar: "Table Stakes", owner: "Bea" },
  { name: "Banking Connectivity", status: "In Progress", priority: "P0", pillar: "New Bet", owner: "Palo" },
  { name: "Reconciliation", status: "In Progress", priority: "P0", pillar: "Table Stakes", owner: "Thiago" },
  { name: "Banking Tech", status: "Not Started", priority: "P1", pillar: "New Bet", owner: "TBD" },
  { name: "POS", status: "Not Started", priority: "P1", pillar: "POC", owner: "TBD" },
  { name: "Chargeback Dispute Automation", status: "Not Started", priority: "P2", pillar: "Revenue", owner: "Valen" },
  { name: "Tap2Pay", status: "In Progress", priority: "P2", pillar: "Strategic", owner: "Alek" },
  { name: "Tap2Add", status: "In Progress", priority: "P2", pillar: "Strategic", owner: "Alek" },
  { name: "Promo Codes", status: "Not Started", priority: "P3", pillar: "Core Ancillary", owner: "TBD" },
  { name: "Hotels", status: "Not Started", priority: "P3", pillar: "POC", owner: "TBD" },
];

function priorityColor(p: string) {
  if (p === "P0") return "#FF4D6A";
  if (p === "P1") return "#FF9F43";
  if (p === "P2") return COLORS.accentAlt;
  return COLORS.textMuted;
}

function statusColor(s: string) {
  if (s === "In Progress") return COLORS.accent;
  return COLORS.textMuted;
}

function pillarColor(p: string) {
  if (p === "Strategic") return COLORS.primaryLight;
  if (p === "Table Stakes") return "#46BEAA";
  if (p === "New Bet") return COLORS.matrixOrange;
  if (p === "Revenue") return COLORS.accentAlt;
  if (p === "POC") return COLORS.matrixPurple;
  if (p === "Core Ancillary") return "#32BCAD";
  return COLORS.textMuted;
}

function StrategicProjectsTable({ active }: { active: boolean }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
        overflowX: "auto",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(20px)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
        <thead>
          <tr>
            {["Initiative", "Status", "Priority", "Strategic Pillar", "Owner"].map(
              (h) => (
                <th
                  key={h}
                  style={{
                    padding: "16px 20px",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: COLORS.textMuted,
                    borderBottom: `1px solid ${COLORS.primary}30`,
                    textAlign: "left",
                  }}
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {STRATEGIC_PROJECTS.map((p, i) => (
            <AnimatedText key={p.name} active={active} delay={0.2 + i * 0.06}>
              <tr
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.03)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td
                  style={{
                    padding: "14px 20px",
                    fontSize: 14,
                    fontWeight: 600,
                    color: COLORS.text,
                  }}
                >
                  {p.name}
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: statusColor(p.status),
                      background: `${statusColor(p.status)}15`,
                      padding: "4px 12px",
                      borderRadius: 20,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.status === "In Progress" && "● "}
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: priorityColor(p.priority),
                    }}
                  >
                    {p.priority}
                  </span>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: pillarColor(p.pillar),
                      background: `${pillarColor(p.pillar)}15`,
                      padding: "4px 12px",
                      borderRadius: 20,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.pillar}
                  </span>
                </td>
                <td
                  style={{
                    padding: "14px 20px",
                    fontSize: 13,
                    color: p.owner === "TBD" ? COLORS.textMuted : COLORS.text,
                    fontWeight: p.owner === "TBD" ? 400 : 600,
                    fontStyle: p.owner === "TBD" ? "italic" : "normal",
                  }}
                >
                  {p.owner}
                </td>
              </tr>
            </AnimatedText>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────── MAIN PRESENTATION ─────────────────────── */
export default function Lisboa2026() {
  const [current, setCurrent] = useState(0);
  const transitioning = useRef(false);
  const TOTAL_SLIDES = 6;

  const goTo = useCallback(
    (n: number) => {
      if (transitioning.current) return;
      if (n < 0 || n >= TOTAL_SLIDES) return;
      transitioning.current = true;
      setCurrent(n);
      setTimeout(() => {
        transitioning.current = false;
      }, 700);
    },
    []
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      }
      if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      }
      if (e.key === "End") {
        e.preventDefault();
        goTo(TOTAL_SLIDES - 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, goTo]);

  /* Wheel navigation */
  useEffect(() => {
    let cooldown = false;
    const handler = (e: WheelEvent) => {
      if (cooldown) return;
      if (Math.abs(e.deltaY) < 30) return;
      cooldown = true;
      if (e.deltaY > 0) next();
      else prev();
      setTimeout(() => {
        cooldown = false;
      }, 1000);
    };
    window.addEventListener("wheel", handler, { passive: true });
    return () => window.removeEventListener("wheel", handler);
  }, [next, prev]);

  /* Touch navigation */
  useEffect(() => {
    let startY = 0;
    const start = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const end = (e: TouchEvent) => {
      const diff = startY - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) {
        if (diff > 0) next();
        else prev();
      }
    };
    window.addEventListener("touchstart", start);
    window.addEventListener("touchend", end);
    return () => {
      window.removeEventListener("touchstart", start);
      window.removeEventListener("touchend", end);
    };
  }, [next, prev]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        html, body {
          width: 100%; height: 100%;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: ${COLORS.dark};
          color: ${COLORS.text};
          -webkit-font-smoothing: antialiased;
        }

        ::selection {
          background: ${COLORS.primary}60;
          color: ${COLORS.text};
        }

        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 40px) scale(1.05); }
          66% { transform: translate(20px, -20px) scale(0.95); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 30px) scale(0.9); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, 30px) scale(1.08); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .yuno-logo-text {
          background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .shimmer-text {
          background: linear-gradient(90deg, ${COLORS.text} 0%, ${COLORS.accent} 50%, ${COLORS.text} 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s ease-in-out infinite;
        }

        /* Scrollbar for overflow slides */
        .slide::-webkit-scrollbar { width: 4px; }
        .slide::-webkit-scrollbar-track { background: transparent; }
        .slide::-webkit-scrollbar-thumb { background: ${COLORS.primary}40; border-radius: 4px; }
      `}</style>

      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <BackgroundOrbs />
        <ProgressBar current={current} total={TOTAL_SLIDES} />
        <NavDots current={current} total={TOTAL_SLIDES} onNav={goTo} />

        {/* ═══════════ SLIDE 0: TITLE ═══════════ */}
        <Slide active={current === 0} index={0}>
          <AnimatedText active={current === 0} delay={0}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: COLORS.accent,
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              Product Leadership Vision
            </div>
          </AnimatedText>
          <AnimatedText active={current === 0} delay={0.2}>
            <h1
              style={{
                fontSize: "clamp(42px, 6vw, 80px)",
                fontWeight: 900,
                textAlign: "center",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                marginBottom: 16,
              }}
            >
              The Future of
              <br />
              <span className="yuno-logo-text">Product at Yuno</span>
            </h1>
          </AnimatedText>
          <AnimatedText active={current === 0} delay={0.5}>
            <p
              style={{
                fontSize: 20,
                color: COLORS.textMuted,
                textAlign: "center",
                maxWidth: 500,
                lineHeight: 1.5,
                marginTop: 8,
              }}
            >
              A new era of world-class product development
            </p>
          </AnimatedText>
          <AnimatedText active={current === 0} delay={0.8}>
            <div
              style={{
                marginTop: 60,
                fontSize: 13,
                color: COLORS.textMuted,
                opacity: 0.5,
                animation: "pulse 2s ease-in-out infinite",
                textAlign: "center",
              }}
            >
              Press → or scroll to navigate
            </div>
          </AnimatedText>
        </Slide>

        {/* ═══════════ SLIDE 1: MAIN GOAL ═══════════ */}
        <Slide active={current === 1} index={1}>
          <AnimatedText active={current === 1} delay={0}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: COLORS.primary,
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Our North Star
            </div>
          </AnimatedText>
          <AnimatedText active={current === 1} delay={0.15}>
            <h2
              className="shimmer-text"
              style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 900,
                textAlign: "center",
                letterSpacing: "-0.02em",
                marginBottom: 48,
              }}
            >
              Create World-Class Products
            </h2>
          </AnimatedText>

          <div
            style={{
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: 1100,
            }}
          >
            <ValueCard
              icon="🚀"
              title="Elevate Orchestration"
              description="Bring our existing products — especially Orchestration — to the next level. We don't just ship features, we build excellence."
              active={current === 1}
              delay={0.3}
              color={COLORS.primary}
            />
            <ValueCard
              icon="💎"
              title="MLP over MVP"
              description="New products launch with at least a Minimum Lovable Product. We don't settle for bare minimums — we ship things people love."
              active={current === 1}
              delay={0.45}
              color={COLORS.accent}
            />
            <ValueCard
              icon="🛡️"
              title="No Orphaned Products"
              description="Every product has clear ownership and active investment. Nothing is left behind or forgotten."
              active={current === 1}
              delay={0.6}
              color={COLORS.accentAlt}
            />
          </div>
        </Slide>

        {/* ═══════════ SLIDE 2: VALUES ═══════════ */}
        <Slide active={current === 2} index={2}>
          <AnimatedText active={current === 2} delay={0}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: COLORS.primary,
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              How We Operate
            </div>
          </AnimatedText>
          <AnimatedText active={current === 2} delay={0.1}>
            <h2
              style={{
                fontSize: "clamp(32px, 4vw, 56px)",
                fontWeight: 800,
                textAlign: "center",
                letterSpacing: "-0.02em",
                marginBottom: 48,
              }}
            >
              Product Team{" "}
              <span className="yuno-logo-text">Values</span>
            </h2>
          </AnimatedText>

          <div
            style={{
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: 1100,
            }}
          >
            <ValueCard
              icon="🔑"
              title="Ownership"
              description="We care deeply about what we build. Our products are not just tasks — they are our craft, our reputation, our legacy."
              active={current === 2}
              delay={0.25}
              color={COLORS.primary}
            />
            <ValueCard
              icon="⚡"
              title="Accountability"
              description="This is ours. When things go wrong, we respond. When things succeed, we built that. No finger-pointing, just results."
              active={current === 2}
              delay={0.4}
              color={COLORS.accent}
            />
            <ValueCard
              icon="🎯"
              title="Agency"
              description="It is 100% on us to make whatever we need happen. No blockers. No excuses. We find a way, always."
              active={current === 2}
              delay={0.55}
              color={COLORS.matrixOrange}
            />
          </div>
        </Slide>

        {/* ═══════════ SLIDE 3: TEAM STRUCTURE ═══════════ */}
        <Slide active={current === 3} index={3}>
          <AnimatedText active={current === 3} delay={0}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: COLORS.primary,
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Organization
            </div>
          </AnimatedText>
          <AnimatedText active={current === 3} delay={0.1}>
            <h2
              style={{
                fontSize: "clamp(28px, 3.5vw, 48px)",
                fontWeight: 800,
                textAlign: "center",
                letterSpacing: "-0.02em",
                marginBottom: 36,
              }}
            >
              Product Team{" "}
              <span className="yuno-logo-text">Structure</span>
            </h2>
          </AnimatedText>
          <OrgMatrix active={current === 3} />
        </Slide>

        {/* ═══════════ SLIDE 4: WAYS OF WORKING ═══════════ */}
        <Slide active={current === 4} index={4}>
          <AnimatedText active={current === 4} delay={0}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: COLORS.primary,
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Process
            </div>
          </AnimatedText>
          <AnimatedText active={current === 4} delay={0.1}>
            <h2
              style={{
                fontSize: "clamp(28px, 3.5vw, 48px)",
                fontWeight: 800,
                textAlign: "center",
                letterSpacing: "-0.02em",
                marginBottom: 12,
              }}
            >
              Ways of{" "}
              <span className="yuno-logo-text">Working</span>
            </h2>
          </AnimatedText>
          <AnimatedText active={current === 4} delay={0.2}>
            <p
              style={{
                fontSize: 16,
                color: COLORS.textMuted,
                textAlign: "center",
                marginBottom: 36,
                maxWidth: 500,
              }}
            >
              2-Month Delivery Cycles with Built-in Flexibility
            </p>
          </AnimatedText>
          <CycleVisualization active={current === 4} />
        </Slide>

        {/* ═══════════ SLIDE 5: STRATEGIC PROJECTS ═══════════ */}
        <Slide active={current === 5} index={5}>
          <AnimatedText active={current === 5} delay={0}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: COLORS.primary,
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Roadmap
            </div>
          </AnimatedText>
          <AnimatedText active={current === 5} delay={0.1}>
            <h2
              style={{
                fontSize: "clamp(28px, 3.5vw, 48px)",
                fontWeight: 800,
                textAlign: "center",
                letterSpacing: "-0.02em",
                marginBottom: 12,
              }}
            >
              Strategic{" "}
              <span className="yuno-logo-text">Projects</span>
            </h2>
          </AnimatedText>
          <AnimatedText active={current === 5} delay={0.15}>
            <p
              style={{
                fontSize: 15,
                color: COLORS.textMuted,
                textAlign: "center",
                marginBottom: 32,
                maxWidth: 600,
                lineHeight: 1.5,
              }}
            >
              Beyond everyday work, these are the special initiatives with{" "}
              <strong style={{ color: COLORS.accent }}>per-person ownership</strong>
            </p>
          </AnimatedText>
          <StrategicProjectsTable active={current === 5} />
        </Slide>

        {/* Bottom nav hint */}
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 8,
            zIndex: 100,
          }}
        >
          <button
            onClick={prev}
            disabled={current === 0}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)",
              background: current === 0 ? "transparent" : "rgba(255,255,255,0.05)",
              color: current === 0 ? "rgba(255,255,255,0.2)" : COLORS.text,
              cursor: current === 0 ? "default" : "pointer",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              backdropFilter: "blur(10px)",
            }}
          >
            ←
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              fontSize: 13,
              color: COLORS.textMuted,
              background: "rgba(255,255,255,0.03)",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(10px)",
            }}
          >
            {current + 1} / {TOTAL_SLIDES}
          </div>
          <button
            onClick={next}
            disabled={current === TOTAL_SLIDES - 1}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)",
              background:
                current === TOTAL_SLIDES - 1
                  ? "transparent"
                  : "rgba(255,255,255,0.05)",
              color:
                current === TOTAL_SLIDES - 1
                  ? "rgba(255,255,255,0.2)"
                  : COLORS.text,
              cursor: current === TOTAL_SLIDES - 1 ? "default" : "pointer",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              backdropFilter: "blur(10px)",
            }}
          >
            →
          </button>
        </div>
      </div>
    </>
  );
}
