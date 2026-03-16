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
        padding: "40px 80px",
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
          width: 320,
          height: "100%",
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "flex-start",
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
    { label: "Core Platforms", color: "#4d65ff", bg: "#4d65ff12", rows: ["Core", "Routing"] },
    { label: "Internal", color: "#7E41E9", bg: "#7E41E912", rows: ["Data Enablement", "Internal Tools & Architecture"] },
    { label: "Experience", color: "#3BFF9D", bg: "#3BFF9D10", rows: ["Dashboard", "Checkout", "SDK & Plugins"] },
  ];

  const columns = [
    { group: "Cards", color: "#4d65ff", subs: ["Card Payments & Integrations", "Tokenization"] },
    { group: "APMs", color: "#7E41E9", subs: ["APM Integrations"] },
    { group: "Payment Ancillaries", color: "#3BFF9D", subs: ["Core Ancillaries", "Reconciliations"] },
    { group: "New Bets", color: "#FF5E00", subs: ["Banking Connectivity", "Agentic Payments", "Banking Tech / WhiteLabel"] },
  ];

  const allSubs = columns.flatMap((c) =>
    c.subs.map((s) => ({ sub: s, color: c.color }))
  );

  let rowIndex = 0;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.8s cubic-bezier(0.4,0,0.2,1) 0.2s",
      }}
    >
      <div
        style={{
          overflowX: "auto",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(20px)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
          <thead>
            <tr>
              <th style={{ width: 36, padding: "10px 6px", borderBottom: "1px solid rgba(255,255,255,0.06)" }} />
              <th style={{ width: 170, padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }} />
              {columns.map((c) => (
                <th
                  key={c.group}
                  colSpan={c.subs.length}
                  style={{
                    padding: "12px 8px",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: c.color,
                    borderBottom: `2px solid ${c.color}40`,
                    textAlign: "center",
                  }}
                >
                  {c.group}
                </th>
              ))}
            </tr>
            <tr>
              <th style={{ padding: "6px", borderBottom: "1px solid rgba(255,255,255,0.08)" }} />
              <th
                style={{
                  padding: "6px 14px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  fontSize: 10,
                  fontWeight: 600,
                  color: COLORS.textMuted,
                  textAlign: "left",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Platform
              </th>
              {allSubs.map((s) => (
                <th
                  key={s.sub}
                  style={{
                    padding: "8px 4px",
                    fontSize: 9,
                    fontWeight: 500,
                    color: `${s.color}AA`,
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    textAlign: "center",
                    lineHeight: 1.3,
                  }}
                >
                  {s.sub}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {platformGroups.map((group) =>
              group.rows.map((row, ri) => {
                const idx = rowIndex++;
                return (
                  <tr
                    key={row}
                    style={{
                      opacity: active ? 1 : 0,
                      transition: `opacity 0.5s ease ${0.3 + idx * 0.07}s`,
                    }}
                  >
                    {ri === 0 && (
                      <td
                        rowSpan={group.rows.length}
                        style={{
                          padding: "6px 3px",
                          fontSize: 9,
                          fontWeight: 700,
                          color: group.color,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          writingMode: "vertical-rl",
                          textOrientation: "mixed",
                          transform: "rotate(180deg)",
                          textAlign: "center",
                          background: group.bg,
                          borderRight: `2px solid ${group.color}30`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {group.label}
                      </td>
                    )}
                    <td
                      style={{
                        padding: "10px 14px",
                        fontSize: 12,
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
                            padding: 4,
                            borderBottom: "1px solid rgba(255,255,255,0.03)",
                            borderLeft: "1px solid rgba(255,255,255,0.03)",
                            minWidth: 65,
                          }}
                        >
                          <div
                            style={{
                              width: "100%",
                              height: 28,
                              borderRadius: 6,
                              background: `linear-gradient(135deg, ${s.color}30, ${s.color}15)`,
                              border: `1px solid ${s.color}20`,
                            }}
                          />
                        </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {/* Color legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
        {[
          { label: "Cards", color: "#4d65ff" },
          { label: "APMs", color: "#7E41E9" },
          { label: "Payment Ancillaries", color: "#3BFF9D" },
          { label: "New Bets", color: "#FF5E00" },
        ].map((c) => (
          <div key={c.label} style={{ fontSize: 11, color: c.color, display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: `linear-gradient(135deg, ${c.color}40, ${c.color}20)`, border: `1px solid ${c.color}30` }} />
            {c.label}
          </div>
        ))}
      </div>
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
                  padding: "4px 11px",
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
                  padding: "4px 11px",
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
                  padding: "4px 11px",
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
            marginTop: 24,
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
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(20px)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
        <thead>
          <tr>
            {["Initiative", "Status", "Priority", "Strategic Pillar", "Owner"].map(
              (h) => (
                <th
                  key={h}
                  style={{
                    padding: "5px 11px",
                    fontSize: 10,
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
              <tr
                key={p.name}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  transition: `background 0.2s ease, opacity 0.5s ease ${0.15 + i * 0.04}s`,
                  opacity: active ? 1 : 0,
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
                    padding: "4px 11px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: COLORS.text,
                  }}
                >
                  {p.name}
                </td>
                <td style={{ padding: "8px 14px" }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: statusColor(p.status),
                      background: `${statusColor(p.status)}15`,
                      padding: "3px 10px",
                      borderRadius: 20,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.status === "In Progress" && "● "}
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: "8px 14px" }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: priorityColor(p.priority),
                    }}
                  >
                    {p.priority}
                  </span>
                </td>
                <td style={{ padding: "8px 14px" }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: pillarColor(p.pillar),
                      background: `${pillarColor(p.pillar)}15`,
                      padding: "3px 10px",
                      borderRadius: 20,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.pillar}
                  </span>
                </td>
                <td
                  style={{
                    padding: "4px 11px",
                    fontSize: 12,
                    color: p.owner === "TBD" ? COLORS.textMuted : COLORS.text,
                    fontWeight: p.owner === "TBD" ? 400 : 600,
                    fontStyle: p.owner === "TBD" ? "italic" : "normal",
                  }}
                >
                  {p.owner}
                </td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────── INTEGRATIONS FLOW (SVG) ─────────────────────── */
function IntegrationsFlow({ active }: { active: boolean }) {
  const W = 780;
  const H = 380;
  /* Lane geometry */
  const LW = 32; // label column width
  const laneGap = 4;
  const lanes = [
    { y: 0, h: 70, label: "COMMERCIAL", color: "#3E4FE0", bg: "rgba(62,79,224,0.07)" },
    { y: 74, h: 100, label: "PRODUCT OWNER", color: "#E91E8C", bg: "rgba(233,30,140,0.05)" },
    { y: 178, h: 80, label: "DEVELOPER", color: "#22C55E", bg: "rgba(34,197,94,0.05)" },
    { y: 262, h: 65, label: "OPERATIONS", color: "#F59E0B", bg: "rgba(245,158,11,0.05)" },
  ];
  /* Step colors */
  const Y = { bg: "#FEF3C7", bd: "#D4A017", tx: "#78350F" }; // yellow
  const P = { bg: "#FCE7F3", bd: "#DB2777", tx: "#831843" }; // pink
  const G = { bg: "#D1FAE5", bd: "#059669", tx: "#064E3B" }; // green

  /* Solid arrow style */
  const sa = { stroke: "rgba(255,255,255,0.6)", strokeWidth: 1.8 };
  /* Dashed arrow style */
  const da = { strokeWidth: 1.2, strokeDasharray: "5 3", fill: "none" };

  /* Box helper */
  const Box = ({ x, y, w, h, c, lines }: { x: number; y: number; w: number; h: number; c: typeof Y; lines: string[] }) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={5} fill={c.bg} stroke={c.bd} strokeWidth={0.8} strokeOpacity={0.5} />
      {lines.map((t, i) => (
        <text key={i} x={x + w / 2} y={y + (h / 2) + (i - (lines.length - 1) / 2) * 11} textAnchor="middle" dominantBaseline="central" fontSize={8} fontWeight={600} fill={c.tx}>{t}</text>
      ))}
    </g>
  );

  /* ── Step center coordinates ── */
  // Commercial
  const startCx = 62, startCy = 35;
  const crX = 100, crY = 12, crW = 85, crH = 44;
  const gmX = 215, gmY = 12, gmW = 80, gmH = 44;
  // Product Owner (lane y=74)
  const paX = 50, paY = 86, paW = 80, paH = 38;
  const tamX = 155, tamY = 86, tamW = 80, tamH = 38;
  const tlX = 260, tlY = 86, tlW = 88, tlH = 38;
  const uatX = 470, uatY = 86, uatW = 70, uatH = 38;
  const diaX = 568, diaY = 105; // decision diamond center
  const chX = 630, chY = 86, chW = 80, chH = 38;
  const endCx = 742, endCy = 105;
  // Developer (lane y=178)
  const devX = 80, devY = 192, devW = 90, devH = 38;
  const qaX = 200, qaY = 192, qaW = 75, qaH = 38;
  const crwX = 305, crwY = 192, crwW = 85, crwH = 38;
  const relX = 470, relY = 192, relW = 95, relH = 38;
  // Operations (lane y=262)
  const brX = 80, brY = 274, brW = 100, brH = 38;

  /* Main flow animation path (slow) */
  /* Happy path: Start → Commercial Request → GM Approval → (Approved) → Product Analysis → TAM → TL Review → (Ready for dev) → Development → Self-QA → Code Review → (Ready for UAT) → PO UAT → Diamond → (Passed) → Release → (Released) → Commercial Handoff → End */

  return (
    <div
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s ease 0.2s",
        width: "100%",
        maxWidth: W + 10,
      }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        <defs>
          <marker id="ah" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="rgba(255,255,255,0.7)" />
          </marker>
          <marker id="ahd" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="rgba(255,255,255,0.4)" />
          </marker>
        </defs>

        {/* ── Swim lane backgrounds ── */}
        {lanes.map((l) => (
          <g key={l.label}>
            <rect x={0} y={l.y} width={W} height={l.h} rx={6} fill={l.bg} stroke={`${l.color}20`} strokeWidth={0.5} />
            <rect x={0} y={l.y} width={LW} height={l.h} rx={6} fill={`${l.color}12`} />
            <text x={LW / 2} y={l.y + l.h / 2} textAnchor="middle" dominantBaseline="central"
              fill={l.color} fontSize={6.5} fontWeight={700} letterSpacing="0.06em"
              transform={`rotate(-90, ${LW / 2}, ${l.y + l.h / 2})`}>{l.label}</text>
          </g>
        ))}

        {/* ══════ COMMERCIAL LANE ══════ */}
        <circle cx={startCx} cy={startCy} r={12} fill="none" stroke={lanes[0].color} strokeWidth={1.5} />
        <polygon points={`${startCx - 3},${startCy - 5} ${startCx - 3},${startCy + 5} ${startCx + 5},${startCy}`} fill={lanes[0].color} />
        <line x1={startCx + 12} y1={startCy} x2={crX} y2={startCy} {...sa} markerEnd="url(#ah)" />
        <Box x={crX} y={crY} w={crW} h={crH} c={Y} lines={["Commercial", "Request"]} />
        <line x1={crX + crW} y1={crY + crH / 2} x2={gmX} y2={gmY + gmH / 2} {...sa} markerEnd="url(#ah)" />
        <Box x={gmX} y={gmY} w={gmW} h={gmH} c={Y} lines={["GM", "Approval"]} />

        {/* ── Cross: GM Approval → Product Analysis (Approved) ── */}
        <path d={`M ${gmX + gmW / 2} ${gmY + gmH} L ${gmX + gmW / 2} ${paY - 2} L ${paX + paW / 2} ${paY - 2} L ${paX + paW / 2} ${paY}`}
          stroke="rgba(255,255,255,0.35)" {...da} markerEnd="url(#ahd)" />
        <text x={gmX + gmW / 2 + 8} y={(gmY + gmH + paY) / 2 - 2} fontSize={6.5} fill="#3BFF9D" fontWeight={600} fontStyle="italic">Approved</text>

        {/* ══════ PRODUCT OWNER LANE ══════ */}
        <Box x={paX} y={paY} w={paW} h={paH} c={P} lines={["Product", "Analysis"]} />
        <line x1={paX + paW} y1={paY + paH / 2} x2={tamX} y2={tamY + tamH / 2} {...sa} markerEnd="url(#ah)" />
        <Box x={tamX} y={tamY} w={tamW} h={tamH} c={P} lines={["TAM", "Validation"]} />
        <line x1={tamX + tamW} y1={tamY + tamH / 2} x2={tlX} y2={tlY + tlH / 2} {...sa} markerEnd="url(#ah)" />
        <Box x={tlX} y={tlY} w={tlW} h={tlH} c={P} lines={["TL Review +", "Estimation"]} />

        {/* ── Cross: TL Review → Development (Ready for dev) ── */}
        <path d={`M ${tlX + tlW / 2} ${tlY + tlH} L ${tlX + tlW / 2} ${(tlY + tlH + devY) / 2} L ${devX + devW / 2} ${(tlY + tlH + devY) / 2} L ${devX + devW / 2} ${devY}`}
          stroke="rgba(255,255,255,0.35)" {...da} markerEnd="url(#ahd)" />
        <text x={tlX + tlW / 2 + 8} y={(tlY + tlH + devY) / 2 - 4} fontSize={6.5} fill="#3BFF9D" fontWeight={600} fontStyle="italic">Ready for dev</text>

        <line x1={tlX + tlW} y1={tlY + tlH / 2} x2={uatX} y2={uatY + uatH / 2} {...sa} markerEnd="url(#ah)" />
        <Box x={uatX} y={uatY} w={uatW} h={uatH} c={P} lines={["PO UAT"]} />
        <line x1={uatX + uatW} y1={uatY + uatH / 2} x2={diaX - 16} y2={diaY} {...sa} markerEnd="url(#ah)" />

        {/* Decision diamond */}
        <rect x={diaX - 14} y={diaY - 14} width={28} height={28} rx={2}
          fill="rgba(255,255,255,0.9)" stroke={lanes[1].color} strokeWidth={1.2}
          transform={`rotate(45, ${diaX}, ${diaY})`} />
        <text x={diaX} y={diaY + 1} textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight={700} fill="#333">✕</text>

        {/* No direct line from diamond to Commercial Handoff — flow goes through Release+Monitoring */}
        <Box x={chX} y={chY} w={chW} h={chH} c={P} lines={["Commercial", "Handoff"]} />
        <line x1={chX + chW} y1={chY + chH / 2} x2={endCx - 12} y2={endCy} {...sa} markerEnd="url(#ah)" />
        <circle cx={endCx} cy={endCy} r={11} fill="none" stroke={lanes[1].color} strokeWidth={2.5} />
        <rect x={endCx - 5} y={endCy - 5} width={10} height={10} rx={1.5} fill={lanes[1].color} />

        {/* ── Cross: Code Review → PO UAT (Ready for UAT) ── */}
        {/* Goes straight up from Code Review top to PO UAT bottom */}
        <path d={`M ${crwX + crwW / 2} ${crwY} L ${crwX + crwW / 2} ${(crwY + uatY + uatH) / 2} L ${uatX + uatW / 2} ${(crwY + uatY + uatH) / 2} L ${uatX + uatW / 2} ${uatY + uatH}`}
          stroke="rgba(255,255,255,0.35)" {...da} markerEnd="url(#ahd)" />
        <text x={(crwX + crwW / 2 + uatX + uatW / 2) / 2 - 20} y={(crwY + uatY + uatH) / 2 - 4} fontSize={6.5} fill="#3BFF9D" fontWeight={600} fontStyle="italic">Ready for UAT</text>

        {/* ── Cross: Diamond (Passed) → Release+Monitoring ── */}
        {/* Goes straight down from diamond to Release+Monitoring top */}
        <path d={`M ${diaX} ${diaY + 16} L ${diaX} ${(diaY + 16 + relY) / 2} L ${relX + relW / 2 + 20} ${(diaY + 16 + relY) / 2} L ${relX + relW / 2 + 20} ${relY}`}
          stroke="rgba(59,255,157,0.4)" {...da} markerEnd="url(#ahd)" />
        <text x={diaX + 8} y={(diaY + 16 + relY) / 2 - 4} fontSize={6.5} fill="#3BFF9D" fontWeight={600} fontStyle="italic">Passed</text>

        {/* ── Cross: Release+Monitoring → Commercial Handoff (Released) ── */}
        {/* Goes up from Release right, right along gap, then up to Commercial Handoff bottom */}
        <path d={`M ${relX + relW} ${relY + relH / 2} L ${chX + chW / 2} ${relY + relH / 2} L ${chX + chW / 2} ${chY + chH}`}
          stroke="rgba(255,255,255,0.35)" {...da} markerEnd="url(#ahd)" />
        <text x={chX + chW / 2 + 8} y={(relY + relH / 2 + chY + chH) / 2} fontSize={6.5} fill="#3BFF9D" fontWeight={600} fontStyle="italic">Released</text>

        {/* ══════ DEVELOPER LANE ══════ */}
        <Box x={devX} y={devY} w={devW} h={devH} c={P} lines={["💻 Development"]} />
        <line x1={devX + devW} y1={devY + devH / 2} x2={qaX} y2={qaY + qaH / 2} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} {...da} markerEnd="url(#ahd)" />
        <Box x={qaX} y={qaY} w={qaW} h={qaH} c={G} lines={["☑️ Self-QA"]} />
        {/* Self-QA → Development feedback loop (dashed, U-shaped under) */}
        <path d={`M ${qaX} ${qaY + qaH} L ${qaX} ${qaY + qaH + 14} L ${devX + devW} ${qaY + qaH + 14} L ${devX + devW} ${devY + devH}`}
          stroke="rgba(255,255,255,0.3)" {...da} markerEnd="url(#ahd)" />
        <line x1={qaX + qaW} y1={qaY + qaH / 2} x2={crwX} y2={crwY + crwH / 2} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} {...da} markerEnd="url(#ahd)" />
        <Box x={crwX} y={crwY} w={crwW} h={crwH} c={G} lines={["🔎 Code", "Review"]} />
        {/* NO direct arrow from Code Review to Release+Monitoring — work goes up via Ready for UAT then back down via Passed */}
        <Box x={relX} y={relY} w={relW} h={relH} c={P} lines={["📡 Release +", "Monitoring"]} />

        {/* ── AC Failed: Release+Monitoring → Development (U-shaped under Developer lane) ── */}
        <path d={`M ${relX + relW / 2} ${relY + relH} L ${relX + relW / 2} ${relY + relH + 14} L ${devX + devW / 2} ${relY + relH + 14} L ${devX + devW / 2} ${devY + devH}`}
          stroke="rgba(255,94,0,0.45)" {...da} markerEnd="url(#ahd)" />
        <text x={(relX + relW / 2 + devX + devW / 2) / 2 - 15} y={relY + relH + 11} fontSize={6.5} fill="#FF5E00" fontWeight={600} fontStyle="italic">AC Failed</text>

        {/* ── Cross: Dev → Ops (Blocked) ── */}
        <path d={`M ${devX + devW / 2} ${devY + devH} L ${devX + devW / 2} ${brY}`}
          stroke="rgba(245,158,11,0.45)" {...da} markerEnd="url(#ahd)" />
        <text x={devX + devW / 2 + 8} y={(devY + devH + brY) / 2} fontSize={6.5} fill="#F59E0B" fontWeight={600} fontStyle="italic">Blocked</text>

        {/* ══════ OPERATIONS LANE ══════ */}
        <Box x={brX} y={brY} w={brW} h={brH} c={Y} lines={["🔧 Blocker", "Resolution"]} />

        {/* ── Cross: Ops → Dev (Resolved) ── */}
        <path d={`M ${brX + brW} ${brY + brH / 2} L ${brX + brW + 25} ${brY + brH / 2} L ${brX + brW + 25} ${devY + devH}`}
          stroke="rgba(34,197,94,0.45)" {...da} markerEnd="url(#ahd)" />
        <text x={brX + brW + 30} y={(brY + brH / 2 + devY + devH) / 2} fontSize={6.5} fill="#22C55E" fontWeight={600} fontStyle="italic">Resolved</text>

        {/* ── Animated flow dot (slow, follows main happy path) ── */}
        {active && (
          <>
            {/* Dot 1: full happy path */}
            <circle r={3} fill="#3BFF9D" opacity={0.85}>
              <animateMotion dur="16s" repeatCount="indefinite"
                path={[
                  `M ${startCx + 12} ${startCy}`,
                  `L ${crX + crW / 2} ${crY + crH / 2}`,
                  `L ${gmX + gmW / 2} ${gmY + gmH / 2}`,
                  // Approved: down then left
                  `L ${gmX + gmW / 2} ${paY - 2}`,
                  `L ${paX + paW / 2} ${paY - 2}`,
                  `L ${paX + paW / 2} ${paY + paH / 2}`,
                  // PO lane
                  `L ${tamX + tamW / 2} ${tamY + tamH / 2}`,
                  `L ${tlX + tlW / 2} ${tlY + tlH / 2}`,
                  // Ready for dev: down then left
                  `L ${tlX + tlW / 2} ${(tlY + tlH + devY) / 2}`,
                  `L ${devX + devW / 2} ${(tlY + tlH + devY) / 2}`,
                  `L ${devX + devW / 2} ${devY + devH / 2}`,
                  // Dev lane
                  `L ${qaX + qaW / 2} ${qaY + qaH / 2}`,
                  `L ${crwX + crwW / 2} ${crwY + crwH / 2}`,
                  // Ready for UAT: up from Code Review to PO UAT
                  `L ${crwX + crwW / 2} ${(crwY + uatY + uatH) / 2}`,
                  `L ${uatX + uatW / 2} ${(crwY + uatY + uatH) / 2}`,
                  `L ${uatX + uatW / 2} ${uatY + uatH / 2}`,
                  // PO lane: UAT → Diamond → (Passed down) → Release → (Released up) → Commercial Handoff
                  `L ${diaX} ${diaY}`,
                  // Passed: down to Release+Monitoring top
                  `L ${diaX} ${(diaY + 16 + relY) / 2}`,
                  `L ${relX + relW / 2 + 20} ${(diaY + 16 + relY) / 2}`,
                  `L ${relX + relW / 2 + 20} ${relY + relH / 2}`,
                  // Released: right then up to Commercial Handoff
                  `L ${chX + chW / 2} ${relY + relH / 2}`,
                  `L ${chX + chW / 2} ${chY + chH / 2}`,
                  `L ${endCx} ${endCy}`,
                ].join(" ")}
              />
            </circle>
            {/* Dot 2: staggered */}
            <circle r={2.5} fill="#3BFF9D" opacity={0.5}>
              <animateMotion dur="16s" repeatCount="indefinite" begin="5.3s"
                path={[
                  `M ${startCx + 12} ${startCy}`,
                  `L ${crX + crW / 2} ${crY + crH / 2}`,
                  `L ${gmX + gmW / 2} ${gmY + gmH / 2}`,
                  `L ${gmX + gmW / 2} ${paY - 2}`,
                  `L ${paX + paW / 2} ${paY - 2}`,
                  `L ${paX + paW / 2} ${paY + paH / 2}`,
                  `L ${tamX + tamW / 2} ${tamY + tamH / 2}`,
                  `L ${tlX + tlW / 2} ${tlY + tlH / 2}`,
                  `L ${tlX + tlW / 2} ${(tlY + tlH + devY) / 2}`,
                  `L ${devX + devW / 2} ${(tlY + tlH + devY) / 2}`,
                  `L ${devX + devW / 2} ${devY + devH / 2}`,
                  `L ${qaX + qaW / 2} ${qaY + qaH / 2}`,
                  `L ${crwX + crwW / 2} ${crwY + crwH / 2}`,
                  `L ${crwX + crwW / 2} ${(crwY + uatY + uatH) / 2}`,
                  `L ${uatX + uatW / 2} ${(crwY + uatY + uatH) / 2}`,
                  `L ${uatX + uatW / 2} ${uatY + uatH / 2}`,
                  `L ${diaX} ${diaY}`,
                  `L ${diaX} ${(diaY + 16 + relY) / 2}`,
                  `L ${relX + relW / 2 + 20} ${(diaY + 16 + relY) / 2}`,
                  `L ${relX + relW / 2 + 20} ${relY + relH / 2}`,
                  `L ${chX + chW / 2} ${relY + relH / 2}`,
                  `L ${chX + chW / 2} ${chY + chH / 2}`,
                  `L ${endCx} ${endCy}`,
                ].join(" ")}
              />
            </circle>
          </>
        )}
      </svg>
    </div>
  );
}

/* ─────────────────────── MAIN PRESENTATION ─────────────────────── */
export default function Lisboa2026() {
  const [current, setCurrent] = useState(0);
  const transitioning = useRef(false);
  const TOTAL_SLIDES = 9;

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
              alignItems: "stretch",
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
              alignItems: "stretch",
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

        {/* ═══════════ SLIDE 3: TEAM STRUCTURE - PRINCIPLES ═══════════ */}
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
                fontSize: "clamp(32px, 4vw, 56px)",
                fontWeight: 800,
                textAlign: "center",
                letterSpacing: "-0.02em",
                marginBottom: 48,
              }}
            >
              Product Team{" "}
              <span className="yuno-logo-text">Structure</span>
            </h2>
          </AnimatedText>

          <div
            style={{
              display: "flex",
              gap: 32,
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: 900,
            }}
          >
            <AnimatedText active={current === 3} delay={0.25}>
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(62,79,224,0.12), rgba(62,79,224,0.04))",
                  border: "1px solid rgba(62,79,224,0.2)",
                  borderRadius: 20,
                  padding: "40px 36px",
                  textAlign: "center",
                  maxWidth: 380,
                  backdropFilter: "blur(20px)",
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>
                  Full Stack Ownership
                </h3>
                <p style={{ fontSize: 15, color: COLORS.textMuted, lineHeight: 1.6, margin: 0 }}>
                  Product Teams are the full owners of their domain — <strong style={{ color: COLORS.text }}>Backend, Frontend, and Mobile</strong>. One team, one mission, complete ownership.
                </p>
              </div>
            </AnimatedText>
            <AnimatedText active={current === 3} delay={0.4}>
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(59,255,157,0.1), rgba(59,255,157,0.03))",
                  border: "1px solid rgba(59,255,157,0.2)",
                  borderRadius: 20,
                  padding: "40px 36px",
                  textAlign: "center",
                  maxWidth: 380,
                  backdropFilter: "blur(20px)",
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>✦</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>
                  Cross-Team Collaboration
                </h3>
                <p style={{ fontSize: 15, color: COLORS.textMuted, lineHeight: 1.6, margin: 0 }}>
                  Pending tech initiatives will enable teams to <strong style={{ color: COLORS.accent }}>submit PRs to other teams&apos; codebases</strong>, unblocking ourselves without dependencies.
                </p>
              </div>
            </AnimatedText>
          </div>
        </Slide>

        {/* ═══════════ SLIDE 4: TEAM STRUCTURE - MATRIX ═══════════ */}
        <Slide active={current === 4} index={4}>
          <AnimatedText active={current === 4} delay={0}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: COLORS.primary,
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Organization
            </div>
          </AnimatedText>
          <AnimatedText active={current === 4} delay={0.1}>
            <h2
              style={{
                fontSize: "clamp(24px, 3vw, 40px)",
                fontWeight: 800,
                textAlign: "center",
                letterSpacing: "-0.02em",
                marginBottom: 20,
              }}
            >
              Product Team{" "}
              <span className="yuno-logo-text">Structure</span>
            </h2>
          </AnimatedText>
          <OrgMatrix active={current === 4} />
          <AnimatedText active={current === 4} delay={0.8}>
            <a
              href="https://docs.google.com/spreadsheets/d/1emwUjf4Jei6gjX67zvSsZ-lACc6EDkAAQlmvRPYdicg/edit?pli=1&gid=273124883#gid=273124883"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginTop: 16,
                fontSize: 12,
                color: COLORS.primaryLight,
                textDecoration: "none",
                padding: "6px 14px",
                borderRadius: 8,
                background: "rgba(62,79,224,0.08)",
                border: "1px solid rgba(62,79,224,0.15)",
                transition: "all 0.2s ease",
              }}
            >
              📊 View Full Team Matrix Spreadsheet →
            </a>
          </AnimatedText>
        </Slide>

        {/* ═══════════ SLIDE 5: TEAM STRUCTURE - INTEGRATIONS ═══════════ */}
        <Slide active={current === 5} index={5}>
          <AnimatedText active={current === 5} delay={0}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: COLORS.primary,
                marginBottom: 6,
                textAlign: "center",
              }}
            >
              Organization
            </div>
          </AnimatedText>
          <AnimatedText active={current === 5} delay={0.1}>
            <h2
              style={{
                fontSize: "clamp(22px, 2.8vw, 36px)",
                fontWeight: 800,
                textAlign: "center",
                letterSpacing: "-0.02em",
                marginBottom: 6,
              }}
            >
              Team Structure:{" "}
              <span className="yuno-logo-text">Integrations</span>
            </h2>
          </AnimatedText>
          <AnimatedText active={current === 5} delay={0.15}>
            <p
              style={{
                fontSize: 13,
                color: COLORS.textMuted,
                textAlign: "center",
                marginBottom: 16,
                maxWidth: 700,
                lineHeight: 1.4,
              }}
            >
              3 teams will have integrations: <strong style={{ color: "#4d65ff" }}>Cards</strong>,{" "}
              <strong style={{ color: "#7E41E9" }}>APMs</strong>, and{" "}
              <strong style={{ color: "#FF5E00" }}>Banking Connectivity</strong>.
              They will have a different way of working but within the same team.
            </p>
          </AnimatedText>

          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "flex-start",
              width: "100%",
              maxWidth: 1200,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {/* Flow map - left side */}
            <div style={{ flex: "1 1 580px", minWidth: 500, maxWidth: 900 }}>
              <IntegrationsFlow active={current === 5} />
            </div>

            {/* Key points - right side */}
            <div
              style={{
                flex: "0 1 300px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                opacity: current === 5 ? 1 : 0,
                transform: current === 5 ? "translateX(0)" : "translateX(20px)",
                transition: "all 0.6s ease 0.6s",
              }}
            >
              {[
                {
                  icon: "🔄",
                  title: "Mobile Developers",
                  text: "Devs are mobile between integration teams depending on priorities",
                  color: COLORS.primary,
                },
                {
                  icon: "📅",
                  title: "Weekly Cadence",
                  text: "Will most likely not work on sprints but more on a weekly cadence",
                  color: COLORS.accent,
                },
                {
                  icon: "🔗",
                  title: "Full Payment Flow",
                  text: "They will be owners of the whole payment flow, not just integrating the API",
                  color: COLORS.matrixOrange,
                },
              ].map((point, i) => (
                <AnimatedText key={point.title} active={current === 5} delay={0.5 + i * 0.12}>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12,
                      padding: "12px 16px",
                      borderLeft: `3px solid ${point.color}`,
                    }}
                  >
                    <div style={{ fontSize: 10, fontWeight: 700, color: point.color, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 14 }}>{point.icon}</span>
                      {point.title}
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.4 }}>
                      {point.text}
                    </div>
                  </div>
                </AnimatedText>
              ))}
            </div>
          </div>

          <AnimatedText active={current === 5} delay={0.9}>
            <a
              href="https://docs.google.com/presentation/d/1RdDD0MTeU3XFXcOVj836-E5Ye5aeSIQda9_vQCwt7UY/edit?slide=id.g3ce6d675f99_0_1#slide=id.g3ce6d675f99_0_1"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginTop: 12,
                fontSize: 12,
                color: COLORS.primaryLight,
                textDecoration: "none",
                padding: "6px 14px",
                borderRadius: 8,
                background: "rgba(62,79,224,0.08)",
                border: "1px solid rgba(62,79,224,0.15)",
                transition: "all 0.2s ease",
              }}
            >
              📑 View Integrations Process Presentation →
            </a>
          </AnimatedText>
        </Slide>

        {/* ═══════════ SLIDE 6: WAYS OF WORKING ═══════════ */}
        <Slide active={current === 6} index={6}>
          <AnimatedText active={current === 6} delay={0}>
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
          <AnimatedText active={current === 6} delay={0.1}>
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
          <AnimatedText active={current === 6} delay={0.2}>
            <p
              style={{
                fontSize: 16,
                color: COLORS.textMuted,
                textAlign: "center",
                marginBottom: 36,
                maxWidth: 550,
              }}
            >
              2-Month Delivery Cycles with Built-in Flexibility
              <br />
              <span style={{ color: COLORS.accent, fontWeight: 600, fontSize: 15 }}>
                2-Week Sprints
              </span>{" "}
              <span style={{ fontSize: 14 }}>within each cycle</span>
            </p>
          </AnimatedText>
          <CycleVisualization active={current === 6} />
        </Slide>

        {/* ═══════════ SLIDE 7: STRATEGIC PROJECTS ═══════════ */}
        <Slide active={current === 7} index={7}>
          <AnimatedText active={current === 7} delay={0}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: COLORS.primary,
                marginBottom: 6,
                textAlign: "center",
              }}
            >
              Roadmap
            </div>
          </AnimatedText>
          <AnimatedText active={current === 7} delay={0.1}>
            <h2
              style={{
                fontSize: "clamp(22px, 2.8vw, 36px)",
                fontWeight: 800,
                textAlign: "center",
                letterSpacing: "-0.02em",
                marginBottom: 4,
              }}
            >
              Strategic{" "}
              <span className="yuno-logo-text">Projects</span>
            </h2>
          </AnimatedText>
          <AnimatedText active={current === 7} delay={0.15}>
            <p
              style={{
                fontSize: 13,
                color: COLORS.textMuted,
                textAlign: "center",
                marginBottom: 14,
                maxWidth: 600,
                lineHeight: 1.3,
              }}
            >
              Beyond everyday work, these are the special initiatives with{" "}
              <strong style={{ color: COLORS.accent }}>per-person ownership</strong>
            </p>
          </AnimatedText>
          <StrategicProjectsTable active={current === 7} />
        </Slide>

        {/* ═══════════ SLIDE 8: THANK YOU ═══════════ */}
        <Slide active={current === 8} index={8}>
          <AnimatedText active={current === 8} delay={0}>
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
          <AnimatedText active={current === 8} delay={0.2}>
            <h1
              style={{
                fontSize: "clamp(48px, 7vw, 90px)",
                fontWeight: 900,
                textAlign: "center",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                marginBottom: 20,
              }}
            >
              <span className="yuno-logo-text">Thank You</span>
            </h1>
          </AnimatedText>
          <AnimatedText active={current === 8} delay={0.5}>
            <p
              style={{
                fontSize: 20,
                color: COLORS.textMuted,
                textAlign: "center",
                maxWidth: 500,
                lineHeight: 1.5,
              }}
            >
              Let&apos;s build world-class products together.
            </p>
          </AnimatedText>
          <AnimatedText active={current === 8} delay={0.8}>
            <div
              style={{
                marginTop: 48,
                display: "flex",
                gap: 16,
                justifyContent: "center",
              }}
            >
              {["🚀", "💎", "🔑", "⚡", "🎯"].map((e, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 32,
                    opacity: 0.7,
                    animation: `float${(i % 3) + 1} ${3 + i}s ease-in-out infinite`,
                  }}
                >
                  {e}
                </span>
              ))}
            </div>
          </AnimatedText>
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
