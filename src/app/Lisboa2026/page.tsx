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

  // Ownership matrix: true = this platform touches this business unit column
  const matrix: Record<string, Record<string, boolean>> = {
    "Core": {
      "Card Payments & Integrations": true, "Tokenization": true,
      "APM Integrations": true,
      "Core Ancillaries": true, "Reconciliations": true,
      "Banking Connectivity": false, "Agentic Payments": false, "Banking Tech / WhiteLabel": false,
    },
    "Routing": {
      "Card Payments & Integrations": true, "Tokenization": true,
      "APM Integrations": false,
      "Core Ancillaries": true, "Reconciliations": false,
      "Banking Connectivity": false, "Agentic Payments": false, "Banking Tech / WhiteLabel": false,
    },
    "Data Enablement": {
      "Card Payments & Integrations": true, "Tokenization": true,
      "APM Integrations": true,
      "Core Ancillaries": true, "Reconciliations": true,
      "Banking Connectivity": true, "Agentic Payments": true, "Banking Tech / WhiteLabel": true,
    },
    "Internal Tools & Architecture": {
      "Card Payments & Integrations": true, "Tokenization": true,
      "APM Integrations": true,
      "Core Ancillaries": true, "Reconciliations": true,
      "Banking Connectivity": true, "Agentic Payments": true, "Banking Tech / WhiteLabel": true,
    },
    "Dashboard": {
      "Card Payments & Integrations": true, "Tokenization": false,
      "APM Integrations": true,
      "Core Ancillaries": true, "Reconciliations": true,
      "Banking Connectivity": false, "Agentic Payments": false, "Banking Tech / WhiteLabel": false,
    },
    "Checkout": {
      "Card Payments & Integrations": true, "Tokenization": false,
      "APM Integrations": true,
      "Core Ancillaries": false, "Reconciliations": false,
      "Banking Connectivity": false, "Agentic Payments": false, "Banking Tech / WhiteLabel": false,
    },
    "SDK & Plugins": {
      "Card Payments & Integrations": true, "Tokenization": false,
      "APM Integrations": true,
      "Core Ancillaries": false, "Reconciliations": false,
      "Banking Connectivity": false, "Agentic Payments": false, "Banking Tech / WhiteLabel": false,
    },
  };

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
                    {allSubs.map((s) => {
                      const filled = matrix[row]?.[s.sub] ?? false;
                      return (
                        <td
                          key={`${row}-${s.sub}`}
                          style={{
                            padding: 4,
                            borderBottom: "1px solid rgba(255,255,255,0.03)",
                            borderLeft: "1px solid rgba(255,255,255,0.03)",
                            minWidth: 65,
                          }}
                        >
                          {filled ? (
                            <div
                              style={{
                                width: "100%",
                                height: 28,
                                borderRadius: 6,
                                background: `linear-gradient(135deg, ${s.color}30, ${s.color}15)`,
                                border: `1px solid ${s.color}25`,
                                boxShadow: `inset 0 1px 0 ${s.color}15`,
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: 28,
                                borderRadius: 6,
                                background: "rgba(255,255,255,0.02)",
                                border: "1px solid rgba(255,255,255,0.03)",
                              }}
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
        <div style={{ fontSize: 12, color: COLORS.textMuted, display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 14, height: 14, borderRadius: 4, background: "linear-gradient(135deg, #ffffff30, #ffffff15)", border: "1px solid rgba(255,255,255,0.25)" }} />
          Active ownership
        </div>
        <div style={{ fontSize: 12, color: COLORS.textMuted, display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 14, height: 14, borderRadius: 4, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }} />
          No direct interaction
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 12, flexWrap: "wrap" }}>
        <div style={{ fontSize: 12, color: COLORS.textMuted, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14 }}>👥</span>
          Product Teams own the full stack — <strong style={{ color: COLORS.text }}>Backend, Frontend, Mobile</strong>
        </div>
        <div style={{ fontSize: 12, color: COLORS.accent, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14 }}>✦</span>
          Cross-team PRs unblocked by upcoming tech initiatives
        </div>
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

      {/* Sprint markers */}
      <AnimatedText active={active} delay={1.0}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginTop: 28,
            padding: "0 5%",
          }}
        >
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                maxWidth: 200,
                textAlign: "center",
                padding: "8px 12px",
                borderRadius: 8,
                background: `${COLORS.primary}10`,
                border: `1px solid ${COLORS.primary}20`,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.primaryLight }}>
                Sprint {s}
              </div>
              <div style={{ fontSize: 10, color: COLORS.textMuted }}>2 weeks</div>
            </div>
          ))}
        </div>
      </AnimatedText>

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

/* ─────────────────────── INTEGRATIONS FLOW ─────────────────────── */
function IntegrationsFlow({ active }: { active: boolean }) {
  const lanes = [
    {
      label: "COMMERCIAL",
      color: "#3E4FE0",
      bg: "rgba(62,79,224,0.06)",
      steps: [
        { name: "Start", icon: "▶", type: "start" as const },
        { name: "Commercial\nRequest", icon: "📄", type: "step" as const, variant: "yellow" as const },
        { name: "GM\nApproval", icon: "✅", type: "step" as const, variant: "yellow" as const },
      ],
    },
    {
      label: "PRODUCT\nOWNER",
      color: "#E91E8C",
      bg: "rgba(233,30,140,0.05)",
      steps: [
        { name: "Product\nAnalysis", icon: "🔍", type: "step" as const, variant: "pink" as const },
        { name: "TAM\nValidation", icon: "📋", type: "step" as const, variant: "pink" as const },
        { name: "TL Review +\nEstimation", icon: "⏱️", type: "step" as const, variant: "pink" as const },
        { name: "PO UAT", icon: "👤", type: "step" as const, variant: "pink" as const },
        { name: "UAT\nPassed?", icon: "✕", type: "decision" as const },
        { name: "Commercial\nHandoff", icon: "📥", type: "step" as const, variant: "pink" as const },
        { name: "Process\nComplete", icon: "⏹", type: "end" as const },
      ],
    },
    {
      label: "DEVELOPER",
      color: "#22C55E",
      bg: "rgba(34,197,94,0.05)",
      steps: [
        { name: "Development", icon: "💻", type: "step" as const, variant: "pink" as const },
        { name: "Self-QA", icon: "☑️", type: "step" as const, variant: "green" as const },
        { name: "Code\nReview", icon: "🔎", type: "step" as const, variant: "green" as const },
        { name: "Release +\nMonitoring", icon: "📡", type: "step" as const, variant: "pink" as const },
      ],
    },
    {
      label: "OPERATIONS",
      color: "#F59E0B",
      bg: "rgba(245,158,11,0.05)",
      steps: [
        { name: "Blocker\nResolution", icon: "🔧", type: "step" as const, variant: "pink" as const },
      ],
    },
  ];

  const stepColors = {
    yellow: { bg: "#FEF3C7", border: "#F59E0B", text: "#92400E" },
    pink: { bg: "#FCE4EC", border: "#E91E63", text: "#880E4F" },
    green: { bg: "#D1FAE5", border: "#22C55E", text: "#065F46" },
  };

  return (
    <div
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s ease 0.2s",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: "100%",
        maxWidth: 900,
      }}
    >
      {lanes.map((lane, li) => (
        <div
          key={lane.label}
          style={{
            display: "flex",
            alignItems: "stretch",
            borderRadius: 10,
            overflow: "hidden",
            border: `1px solid ${lane.color}25`,
            background: lane.bg,
            minHeight: lane.steps.length <= 1 ? 60 : 70,
            opacity: active ? 1 : 0,
            transition: `opacity 0.5s ease ${0.3 + li * 0.12}s`,
          }}
        >
          {/* Lane label */}
          <div
            style={{
              width: 36,
              minWidth: 36,
              background: `${lane.color}15`,
              borderRight: `2px solid ${lane.color}40`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px 2px",
            }}
          >
            <span
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                transform: "rotate(180deg)",
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: lane.color,
                textTransform: "uppercase",
                whiteSpace: "pre-line",
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              {lane.label}
            </span>
          </div>
          {/* Steps */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              flexWrap: "nowrap",
              overflowX: "auto",
            }}
          >
            {lane.steps.map((step, si) => (
              <div key={step.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {si > 0 && (
                  <div style={{ color: lane.color, fontSize: 14, opacity: 0.6 }}>→</div>
                )}
                {step.type === "start" ? (
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      border: `2px solid ${lane.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      color: lane.color,
                      flexShrink: 0,
                    }}
                  >
                    {step.icon}
                  </div>
                ) : step.type === "end" ? (
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      border: `3px solid ${lane.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      color: lane.color,
                      flexShrink: 0,
                    }}
                  >
                    {step.icon}
                  </div>
                ) : step.type === "decision" ? (
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      transform: "rotate(45deg)",
                      border: `2px solid ${lane.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(255,255,255,0.9)",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ transform: "rotate(-45deg)", fontSize: 10, fontWeight: 700, color: "#333" }}>
                      {step.icon}
                    </span>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      background: stepColors[step.variant || "pink"].bg,
                      border: `1px solid ${stepColors[step.variant || "pink"].border}30`,
                      flexShrink: 0,
                      textAlign: "center",
                      minWidth: 70,
                    }}
                  >
                    <div style={{ fontSize: 12, marginBottom: 2 }}>{step.icon}</div>
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        color: stepColors[step.variant || "pink"].text,
                        whiteSpace: "pre-line",
                        lineHeight: 1.2,
                      }}
                    >
                      {step.name}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* Connection labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          marginTop: 6,
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "Approved", from: "Commercial", to: "Product Owner" },
          { label: "Ready for Dev", from: "Product Owner", to: "Developer" },
          { label: "Ready for UAT", from: "Developer", to: "Product Owner" },
          { label: "Blocked → Resolved", from: "Developer", to: "Operations" },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              fontSize: 9,
              color: COLORS.textMuted,
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "rgba(255,255,255,0.03)",
              padding: "3px 8px",
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span style={{ borderBottom: "1px dashed rgba(255,255,255,0.3)", width: 12, display: "inline-block" }} />
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── MAIN PRESENTATION ─────────────────────── */
export default function Lisboa2026() {
  const [current, setCurrent] = useState(0);
  const transitioning = useRef(false);
  const TOTAL_SLIDES = 8;

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
