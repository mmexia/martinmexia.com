"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────── YUNO LOGO (official SVG) ─────── */
function YunoLogo({ color = "#FFFFFF", width = 120 }: { color?: string; width?: number }) {
  const height = width * (24 / 88);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 88 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M11.3079 11.9272L5.71611 0.508398H0.0781555L8.70175 18.2236L6.36692 23.8043H11.8836L21.3038 0.508398H15.8289L11.3079 11.9272Z" fill={color}/>
      <path d="M36.9935 11.2043C36.9935 11.2043 34.9646 15.7874 31.2617 14.4833C29.4781 13.8558 29.3021 11.4732 29.2776 10.9252V0.515607H23.6367V12.9725C23.641 13.6867 23.6742 14.5946 23.8214 15.118C25.2746 20.2737 31.0713 19.2877 32.0641 19.0419C36.2056 18.0154 37.741 13.9368 37.741 13.9368V19.1069H42.6401V0.51416H36.9935V11.2043Z" fill={color}/>
      <path d="M84.8083 3.09349C83.8934 2.17253 82.8126 1.46265 81.599 0.986987C78.648 -0.0698809 75.3983 -0.0698809 72.4472 0.986987C71.2264 1.45976 70.1398 2.16964 69.2163 3.09783C68.3548 3.97542 67.6924 5.00771 67.2537 6.16145C66.8093 7.33976 66.5856 8.5788 66.59 9.84097C66.5842 11.1017 66.8078 12.3306 67.2537 13.5017C67.7097 14.6887 68.3995 15.7499 69.3014 16.652C70.2033 17.5542 71.2654 18.2453 72.4559 18.7036C73.9076 19.2516 75.4372 19.5147 76.9943 19.4887H77.0116H77.0289C78.5946 19.5234 80.1314 19.2545 81.5961 18.7007C82.8068 18.2265 83.8905 17.508 84.8069 16.5696C85.6698 15.6848 86.3321 14.6511 86.7766 13.4973C87.2211 12.3292 87.4433 11.1002 87.439 9.84675C87.4433 8.57879 87.2196 7.33976 86.7752 6.16C86.3365 5.00626 85.6741 3.97398 84.8083 3.09205V3.09349ZM81.0535 12.4824L81.0391 12.5128C80.6769 13.2776 80.1083 13.921 79.394 14.3749L79.3709 14.3894C78.8327 14.7089 78.2454 14.9113 77.6234 14.9894C77.4315 15.014 77.2381 15.0255 77.0462 15.0255C76.6205 15.0255 76.1963 14.9648 75.7821 14.8448C75.1818 14.6699 74.632 14.3793 74.15 13.9802C73.668 13.5812 73.2799 13.0954 72.997 12.5359L72.9812 12.5041C72.5988 11.6713 72.4068 10.7475 72.4256 9.83229C72.4054 8.91566 72.5973 7.99036 72.9812 7.15759C73.3419 6.38265 73.9119 5.73639 74.6334 5.2853L74.6493 5.27518C75.1876 4.95277 75.7749 4.74891 76.3983 4.6694C77.0202 4.58988 77.6407 4.63759 78.2425 4.81253C78.8442 4.98747 79.394 5.27952 79.876 5.68144C80.358 6.08193 80.7447 6.5706 81.0275 7.13012L81.0506 7.18073C81.4114 8.02362 81.5947 8.91422 81.5947 9.83229C81.5947 10.7504 81.4114 11.641 81.0506 12.4839L81.0535 12.4824Z" fill={color}/>
      <path d="M55.9393 0.573506C51.7978 1.60001 50.2624 5.67857 50.2624 5.67857V0.508444H45.3633V19.1012H51.0099V8.4111C51.0099 8.4111 53.0388 3.82796 56.7416 5.13206C58.5252 5.75953 58.7013 8.14218 58.7258 8.69013V19.0998H64.3666V6.64291C64.3623 5.92869 64.3291 5.02073 64.1819 4.49736C62.7288 -0.658304 56.9321 0.327723 55.9393 0.573506Z" fill={color}/>
    </svg>
  );
}

/* ─────────────────────── YUNO BRAND COLORS (Brandbook 2026) ─────── */
const COLORS = {
  // Primary palette
  primary: "#3E4FE0",        // Yuno Blue
  primaryDark: "#1726A6",    // Deep Blue (extended)
  primaryLight: "#5967E4",   // Medium Blue (extended)
  primaryLighter: "#7C89EF", // Light Blue (extended)
  primaryPale: "#BDC3F6",    // Pale Blue (extended)
  dark: "#282A30",           // Unity Black
  darkCard: "#2F3138",       // Slightly lighter card bg
  darkSurface: "#363840",    // Surface variant
  accent: "#38ADFF",         // Sky Blue (gradient accent)
  accentAlt: "#E0ED80",      // Lime (extended, small details only)
  text: "#FFFFFF",
  textMuted: "#92959B",      // Security Gray
  lilac: "#E8EAF5",          // Harmony Lilac
  cardBlue: "rgba(62, 79, 224, 0.15)",
  cardPurple: "rgba(89, 103, 228, 0.15)",
  cardGreen: "rgba(56, 173, 255, 0.15)",
  cardOrange: "rgba(224, 237, 128, 0.15)",
  // Matrix colors (brand-aligned)
  matrixBlue: "#5967E4",
  matrixPurple: "#7C89EF",
  matrixGreen: "#38ADFF",
  matrixOrange: "#E0ED80",
  // Neutral
  gray: "#616366",           // Dark Gray (extended)
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
        transition: `opacity 1s cubic-bezier(0.4,0,0.2,1) ${delay}s, transform 1s cubic-bezier(0.4,0,0.2,1) ${delay}s`,
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

/* ─────────────────────── PRINCIPLE CARD (hover like AnimatedCard) ─────────────────────── */
function PrincipleCard({ active, delay, color, icon, title, children }: {
  active: boolean; delay: number; color: string; icon: string; title: string; children: React.ReactNode;
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
          padding: "40px 36px",
          textAlign: "center",
          maxWidth: 380,
          transition: "all 0.4s ease",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered ? `0 20px 60px ${color}15` : "none",
          backdropFilter: "blur(20px)",
          height: "100%",
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "flex-start",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>{title}</h3>
        <p style={{ fontSize: 15, color: COLORS.textMuted, lineHeight: 1.6, margin: 0 }}>{children}</p>
      </div>
    </AnimatedText>
  );
}

/* ─────────────────────── MATRIX COMPONENT ─────────────────────── */
function OrgMatrix({ active }: { active: boolean }) {
  const platformGroups = [
    { label: "Core Platforms", color: "#5967E4", bg: "#4d65ff12", rows: ["Core", "Routing"] },
    { label: "Internal", color: "#5967E4", bg: "#5967E412", rows: ["Data Enablement", "Internal Tools & Architecture"] },
    { label: "Experience", color: "#38ADFF", bg: "#38ADFF10", rows: ["Dashboard", "Checkout", "SDK & Plugins"] },
  ];

  const columns = [
    { group: "Cards", color: "#5967E4", subs: ["Card Payments & Integrations", "Tokenization"] },
    { group: "APMs", color: "#5967E4", subs: ["APM Integrations"] },
    { group: "Payment Ancillaries", color: "#38ADFF", subs: ["Core Ancillaries", "Reconciliations"] },
    { group: "New Bets", color: "#E0ED80", subs: ["Banking Connectivity", "Agentic Payments", "Banking Tech / WhiteLabel"] },
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
          { label: "Cards", color: "#5967E4" },
          { label: "APMs", color: "#5967E4" },
          { label: "Payment Ancillaries", color: "#38ADFF" },
          { label: "New Bets", color: "#E0ED80" },
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
    { y: 74, h: 100, label: "PRODUCT OWNER", color: "#3E4FE0", bg: "rgba(62,79,224,0.05)" },
    { y: 178, h: 80, label: "DEVELOPER", color: "#38ADFF", bg: "rgba(56,173,255,0.05)" },
    { y: 262, h: 65, label: "OPERATIONS", color: "#92959B", bg: "rgba(146,149,155,0.05)" },
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
        <text x={gmX + gmW / 2 + 8} y={(gmY + gmH + paY) / 2 - 2} fontSize={6.5} fill="#38ADFF" fontWeight={600} fontStyle="italic">Approved</text>

        {/* ══════ PRODUCT OWNER LANE ══════ */}
        <Box x={paX} y={paY} w={paW} h={paH} c={P} lines={["Product", "Analysis"]} />
        <line x1={paX + paW} y1={paY + paH / 2} x2={tamX} y2={tamY + tamH / 2} {...sa} markerEnd="url(#ah)" />
        <Box x={tamX} y={tamY} w={tamW} h={tamH} c={P} lines={["TAM", "Validation"]} />
        <line x1={tamX + tamW} y1={tamY + tamH / 2} x2={tlX} y2={tlY + tlH / 2} {...sa} markerEnd="url(#ah)" />
        <Box x={tlX} y={tlY} w={tlW} h={tlH} c={P} lines={["TL Review +", "Estimation"]} />

        {/* ── Cross: TL Review → Development (Ready for dev) ── */}
        <path d={`M ${tlX + tlW / 2} ${tlY + tlH} L ${tlX + tlW / 2} ${(tlY + tlH + devY) / 2} L ${devX + devW / 2} ${(tlY + tlH + devY) / 2} L ${devX + devW / 2} ${devY}`}
          stroke="rgba(255,255,255,0.35)" {...da} markerEnd="url(#ahd)" />
        <text x={tlX + tlW / 2 - 48} y={(tlY + tlH + devY) / 2 - 4} fontSize={6.5} fill="#38ADFF" fontWeight={600} fontStyle="italic">Ready for dev</text>

        {/* No direct line from TL Review to PO UAT */}
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
        <text x={(crwX + crwW / 2 + uatX + uatW / 2) / 2 - 20} y={(crwY + uatY + uatH) / 2 - 4} fontSize={6.5} fill="#38ADFF" fontWeight={600} fontStyle="italic">Ready for UAT</text>

        {/* ── Cross: PO UAT (Passed) → Release+Monitoring ── */}
        {/* Goes straight down from PO UAT to Release+Monitoring top */}
        <path d={`M ${uatX + uatW / 2} ${uatY + uatH} L ${uatX + uatW / 2} ${(uatY + uatH + relY) / 2} L ${relX + relW / 2} ${(uatY + uatH + relY) / 2} L ${relX + relW / 2} ${relY}`}
          stroke="rgba(59,255,157,0.4)" {...da} markerEnd="url(#ahd)" />
        <text x={(uatX + uatW / 2 + relX + relW / 2) / 2 + 8} y={(uatY + uatH + relY) / 2 - 4} fontSize={6.5} fill="#38ADFF" fontWeight={600} fontStyle="italic">Passed</text>

        {/* ── Cross: Release+Monitoring → Commercial Handoff (Released) ── */}
        {/* Goes up from Release right, right along gap, then up to Commercial Handoff bottom */}
        <path d={`M ${relX + relW} ${relY + relH / 2} L ${chX + chW / 2} ${relY + relH / 2} L ${chX + chW / 2} ${chY + chH}`}
          stroke="rgba(255,255,255,0.35)" {...da} markerEnd="url(#ahd)" />
        <text x={chX + chW / 2 + 8} y={(relY + relH / 2 + chY + chH) / 2} fontSize={6.5} fill="#38ADFF" fontWeight={600} fontStyle="italic">Released</text>

        {/* ══════ DEVELOPER LANE ══════ */}
        <Box x={devX} y={devY} w={devW} h={devH} c={P} lines={["💻 Development"]} />
        <line x1={devX + devW} y1={devY + devH / 2} x2={qaX} y2={qaY + qaH / 2} stroke="rgba(255,255,255,0.5)" {...da} strokeWidth={1.5} markerEnd="url(#ahd)" />
        <Box x={qaX} y={qaY} w={qaW} h={qaH} c={G} lines={["☑️ Self-QA"]} />
        {/* Self-QA → Development feedback loop (dashed, U-shaped under) */}
        <path d={`M ${qaX} ${qaY + qaH} L ${qaX} ${qaY + qaH + 14} L ${devX + devW} ${qaY + qaH + 14} L ${devX + devW} ${devY + devH}`}
          stroke="rgba(255,255,255,0.3)" {...da} markerEnd="url(#ahd)" />
        <line x1={qaX + qaW} y1={qaY + qaH / 2} x2={crwX} y2={crwY + crwH / 2} stroke="rgba(255,255,255,0.5)" {...da} strokeWidth={1.5} markerEnd="url(#ahd)" />
        <Box x={crwX} y={crwY} w={crwW} h={crwH} c={G} lines={["🔎 Code", "Review"]} />
        {/* NO direct arrow from Code Review to Release+Monitoring — work goes up via Ready for UAT then back down via Passed */}
        <Box x={relX} y={relY} w={relW} h={relH} c={P} lines={["📡 Release +", "Monitoring"]} />

        {/* ── AC Failed: Diamond (X) → Development (cross-lane, dashed) ── */}
        <path d={`M ${diaX} ${diaY + 16} L ${diaX} ${lanes[1].y + lanes[1].h + 6} L ${devX + devW / 2} ${lanes[1].y + lanes[1].h + 6} L ${devX + devW / 2} ${devY}`}
          stroke="rgba(255,94,0,0.45)" {...da} markerEnd="url(#ahd)" />
        <text x={(diaX + devX + devW / 2) / 2} y={lanes[1].y + lanes[1].h + 3} fontSize={6.5} fill="#E0ED80" fontWeight={600} fontStyle="italic">AC Failed</text>

        {/* ── Cross: Dev → Ops (Blocked) — [ shape: down, left, down ── */}
        <path d={`M ${devX} ${devY + devH / 2} L ${devX - 18} ${devY + devH / 2} L ${devX - 18} ${brY + brH / 2} L ${brX} ${brY + brH / 2}`}
          stroke="rgba(245,158,11,0.45)" {...da} markerEnd="url(#ahd)" />
        <text x={devX - 16 - 40} y={(devY + devH / 2 + brY + brH / 2) / 2 + 3} fontSize={6.5} fill="#92959B" fontWeight={600} fontStyle="italic">Blocked</text>

        {/* ══════ OPERATIONS LANE ══════ */}
        <Box x={brX} y={brY} w={brW} h={brH} c={Y} lines={["🔧 Blocker", "Resolution"]} />

        {/* ── Cross: Ops → Dev (Resolved) — straight up from Blocker Resolution to Development ── */}
        <path d={`M ${brX + brW / 2} ${brY} L ${brX + brW / 2} ${devY + devH}`}
          stroke="rgba(34,197,94,0.45)" {...da} markerEnd="url(#ahd)" />
        <text x={brX + brW / 2 + 8} y={(brY + devY + devH) / 2} fontSize={6.5} fill="#38ADFF" fontWeight={600} fontStyle="italic">Resolved</text>

        {/* ── Animated flow dot (slow, follows main happy path) ── */}
        {active && (
          <>
            {/* Dot 1: full happy path */}
            <circle r={3} fill="#38ADFF" opacity={0.85}>
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
                  // PO lane: UAT → Diamond → back to UAT → (Passed down) → Release → (Released up) → Commercial Handoff
                  `L ${diaX} ${diaY}`,
                  `L ${uatX + uatW / 2} ${uatY + uatH / 2}`,
                  // Passed: down from PO UAT to Release+Monitoring
                  `L ${uatX + uatW / 2} ${(uatY + uatH + relY) / 2}`,
                  `L ${relX + relW / 2} ${(uatY + uatH + relY) / 2}`,
                  `L ${relX + relW / 2} ${relY + relH / 2}`,
                  // Released: right then up to Commercial Handoff
                  `L ${chX + chW / 2} ${relY + relH / 2}`,
                  `L ${chX + chW / 2} ${chY + chH / 2}`,
                  `L ${endCx} ${endCy}`,
                ].join(" ")}
              />
            </circle>
            {/* Dot 2: staggered */}
            <circle r={2.5} fill="#38ADFF" opacity={0.5}>
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
                  `L ${uatX + uatW / 2} ${uatY + uatH / 2}`,
                  `L ${uatX + uatW / 2} ${(uatY + uatH + relY) / 2}`,
                  `L ${relX + relW / 2} ${(uatY + uatH + relY) / 2}`,
                  `L ${relX + relW / 2} ${relY + relH / 2}`,
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

/* ─────────────────────── CYCLE CALENDAR VIEW ─────────────────────── */
function CycleCalendarView({ active }: { active: boolean }) {
  const cycles = [
    {
      name: "Cycle 1",
      start: "May 1",
      end: "Jun 30",
      months: ["May", "Jun"],
      color: COLORS.primary,
      sprints: [
        { label: "S1", start: "May 1", end: "May 14" },
        { label: "S2", start: "May 15", end: "May 28" },
        { label: "S3", start: "May 29", end: "Jun 11" },
        { label: "S4", start: "Jun 12", end: "Jun 25" },
      ],
      review: "Jun 1",
    },
    {
      name: "Cycle 2",
      start: "Jul 1",
      end: "Aug 31",
      months: ["Jul", "Aug"],
      color: COLORS.primary,
      sprints: [
        { label: "S1", start: "Jul 1", end: "Jul 14" },
        { label: "S2", start: "Jul 15", end: "Jul 28" },
        { label: "S3", start: "Jul 29", end: "Aug 11" },
        { label: "S4", start: "Aug 12", end: "Aug 25" },
      ],
      review: "Aug 1",
    },
    {
      name: "Cycle 3",
      start: "Sep 1",
      end: "Oct 31",
      months: ["Sep", "Oct"],
      color: COLORS.primary,
      sprints: [
        { label: "S1", start: "Sep 1", end: "Sep 14" },
        { label: "S2", start: "Sep 15", end: "Sep 28" },
        { label: "S3", start: "Sep 29", end: "Oct 12" },
        { label: "S4", start: "Oct 13", end: "Oct 26" },
      ],
      review: "Oct 1",
    },
    {
      name: "Cycle 4",
      start: "Nov 1",
      end: "Dec 31",
      months: ["Nov", "Dec"],
      color: COLORS.primary,
      sprints: [
        { label: "S1", start: "Nov 1", end: "Nov 14" },
        { label: "S2", start: "Nov 15", end: "Nov 28" },
        { label: "S3", start: "Nov 29", end: "Dec 12" },
        { label: "S4", start: "Dec 13", end: "Dec 26" },
      ],
      review: "Dec 1",
    },
  ];

  return (
    <div style={{ width: "100%", maxWidth: 900, margin: "0 auto" }}>
      {/* Timeline header */}
      <AnimatedText active={active} delay={0.3}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
            padding: "0 4px",
          }}
        >
          <span style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600 }}>MAY 2026</span>
          <span style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600 }}>DEC 2026</span>
        </div>
        {/* Full timeline bar */}
        <div
          style={{
            height: 4,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 2,
            marginBottom: 24,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: active ? "100%" : "0%",
              background: COLORS.primary,
              borderRadius: 2,
              transition: "width 1.5s ease 0.5s",
            }}
          />
        </div>
      </AnimatedText>

      {/* Cycle rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {cycles.map((cycle, ci) => (
          <AnimatedText key={cycle.name} active={active} delay={0.4 + ci * 0.15}>
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                gap: 12,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
                padding: 12,
                borderLeft: `3px solid ${cycle.color}`,
              }}
            >
              {/* Cycle label */}
              <div
                style={{
                  minWidth: 90,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: cycle.color }}>{cycle.name}</div>
                <div style={{ fontSize: 10, color: COLORS.textMuted }}>
                  {cycle.start} – {cycle.end}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: COLORS.textMuted,
                    marginTop: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <span>◆</span> Review: {cycle.review}
                </div>
              </div>

              {/* Sprint blocks */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  gap: 6,
                }}
              >
                {cycle.sprints.map((sprint, si) => (
                  <div
                    key={sprint.label}
                    style={{
                      flex: 1,
                      background: `${cycle.color}15`,
                      border: `1px solid ${cycle.color}30`,
                      borderRadius: 8,
                      padding: "8px 6px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      opacity: active ? 1 : 0,
                      transform: active ? "scale(1)" : "scale(0.8)",
                      transition: `all 0.3s ease ${0.6 + ci * 0.15 + si * 0.05}s`,
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, color: cycle.color }}>{sprint.label}</div>
                    <div style={{ fontSize: 8, color: COLORS.textMuted, textAlign: "center", lineHeight: 1.2 }}>
                      {sprint.start}
                    </div>
                    <div style={{ fontSize: 8, color: COLORS.textMuted, textAlign: "center", lineHeight: 1.2 }}>
                      {sprint.end}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedText>
        ))}
      </div>

      {/* Legend */}
      <AnimatedText active={active} delay={1.1}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            marginTop: 20,
            flexWrap: "wrap",
          }}
        >
          {[
            { icon: "📅", label: "2-month cycles", color: COLORS.textMuted },
            { icon: "🏃", label: "4 × 2-week sprints per cycle", color: COLORS.textMuted },
            { icon: "◆", label: "Mid-cycle review", color: COLORS.textMuted },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: item.color,
              }}
            >
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
        </div>
      </AnimatedText>
    </div>
  );
}

/* ─────────────────────── MAIN PRESENTATION ─────────────────────── */
export default function Lisboa2026() {
  const [current, setCurrent] = useState(0);
  const transitioning = useRef(false);
  const TOTAL_SLIDES = 11;

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
        @import url('https://fonts.googleapis.com/css2?family=Titillium+Web:wght@200;300;400;600;700;900&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        html, body {
          width: 100%; height: 100%;
          overflow: hidden;
          font-family: 'Titillium Web', -apple-system, BlinkMacSystemFont, sans-serif;
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
          background: linear-gradient(90deg, ${COLORS.text} 0%, ${COLORS.primaryLight} 50%, ${COLORS.text} 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s ease-in-out 1 forwards;
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
            <div style={{ marginBottom: 32, textAlign: "center" }}>
              <YunoLogo color={COLORS.primary} width={140} />
            </div>
          </AnimatedText>
          <AnimatedText active={current === 0} delay={0.15}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: COLORS.textMuted,
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              Product Leadership Vision
            </div>
          </AnimatedText>
          <AnimatedText active={current === 0} delay={0.3}>
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
          <AnimatedText active={current === 0} delay={0.6}>
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
          <AnimatedText active={current === 0} delay={0.9}>
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
              style={{
                fontSize: "clamp(32px, 4vw, 56px)",
                fontWeight: 800,
                textAlign: "center",
                letterSpacing: "-0.02em",
                marginBottom: 48,
              }}
            >
              Create{" "}
              <span className="yuno-logo-text">World-Class Products</span>
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

        {/* ═══════════ SLIDE 2: MOTTO ═══════════ */}
        <Slide active={current === 2} index={2}>
          <AnimatedText active={current === 2} delay={0}>
            <div style={{ marginBottom: 32, textAlign: "center" }}>
              <YunoLogo color={COLORS.primary} width={100} />
            </div>
          </AnimatedText>
          <AnimatedText active={current === 2} delay={0.3}>
            <div
              style={{
                fontSize: "clamp(36px, 5.5vw, 72px)",
                fontWeight: 300,
                fontStyle: "italic",
                textAlign: "center",
                lineHeight: 1.4,
                letterSpacing: "0.01em",
                maxWidth: 800,
                color: COLORS.lilac,
              }}
            >
              <span style={{ fontSize: "1.2em", fontWeight: 200 }}>&ldquo;</span>
              <span className="yuno-logo-text" style={{ fontStyle: "italic" }}>
                Maintain the standard,
                <br />
                Keep each other accountable
              </span>
              <span style={{ fontSize: "1.2em", fontWeight: 200 }}>&rdquo;</span>
            </div>
          </AnimatedText>
        </Slide>

        {/* ═══════════ SLIDE 3: VALUES ═══════════ */}
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
              How We Operate
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
              active={current === 3}
              delay={0.25}
              color={COLORS.primary}
            />
            <ValueCard
              icon="⚡"
              title="Accountability"
              description="This is ours. When things go wrong, we respond. When things succeed, we built that. No finger-pointing, just results."
              active={current === 3}
              delay={0.4}
              color={COLORS.accent}
            />
            <ValueCard
              icon="🎯"
              title="Agency"
              description="It is 100% on us to make whatever we need happen. No blockers. No excuses. We find a way, always."
              active={current === 3}
              delay={0.55}
              color={COLORS.matrixOrange}
            />
          </div>
        </Slide>

        {/* ═══════════ SLIDE 4: TEAM STRUCTURE - PRINCIPLES ═══════════ */}
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
              Organization
            </div>
          </AnimatedText>
          <AnimatedText active={current === 4} delay={0.1}>
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
            <PrincipleCard active={current === 4} delay={0.25} color={COLORS.primary} icon="👥" title="Full Stack Ownership">
              Product Teams are the full owners of their domain — <strong style={{ color: COLORS.text }}>Backend, Frontend, and Mobile</strong>. One team, one mission, complete ownership.
            </PrincipleCard>
            <PrincipleCard active={current === 4} delay={0.4} color={COLORS.primary} icon="✦" title="Cross-Team Collaboration">
              Pending tech initiatives will enable teams to <strong style={{ color: COLORS.accent }}>submit PRs to other teams&apos; codebases</strong>, unblocking ourselves without dependencies.
            </PrincipleCard>
          </div>
        </Slide>

        {/* ═══════════ SLIDE 5: TEAM STRUCTURE - MATRIX ═══════════ */}
        <Slide active={current === 5} index={5}>
          <AnimatedText active={current === 5} delay={0}>
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
          <AnimatedText active={current === 5} delay={0.1}>
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
          <OrgMatrix active={current === 5} />
          <AnimatedText active={current === 5} delay={0.8}>
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

        {/* ═══════════ SLIDE 6: TEAM STRUCTURE - INTEGRATIONS ═══════════ */}
        <Slide active={current === 6} index={6}>
          <AnimatedText active={current === 6} delay={0}>
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
          <AnimatedText active={current === 6} delay={0.1}>
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
          <AnimatedText active={current === 6} delay={0.15}>
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
              3 teams will have integrations: <strong style={{ color: "#5967E4" }}>Cards</strong>,{" "}
              <strong style={{ color: "#5967E4" }}>APMs</strong>, and{" "}
              <strong style={{ color: "#E0ED80" }}>Banking Connectivity</strong>.
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
              <IntegrationsFlow active={current === 6} />
            </div>

            {/* Key points - right side */}
            <div
              style={{
                flex: "0 1 300px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                opacity: current === 6 ? 1 : 0,
                transform: current === 6 ? "translateX(0)" : "translateX(20px)",
                transition: "all 0.6s ease 0.6s",
              }}
            >
              {[
                {
                  icon: "🔄",
                  title: "Flexible Team Sizes",
                  text: "Devs are mobile between integration teams depending on priorities",
                  color: COLORS.primary,
                },
                {
                  icon: "🔗",
                  title: "Full Payment Flow",
                  text: "They will be owners of the whole payment flow, not just integrating the API",
                  color: COLORS.matrixOrange,
                },
              ].map((point, i) => (
                <AnimatedText key={point.title} active={current === 6} delay={0.5 + i * 0.12}>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 14,
                      padding: "24px 28px",
                      borderLeft: `4px solid ${point.color}`,
                      flex: 1,
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 700, color: point.color, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 22 }}>{point.icon}</span>
                      {point.title}
                    </div>
                    <div style={{ fontSize: 15, color: COLORS.textMuted, lineHeight: 1.6 }}>
                      {point.text}
                    </div>
                  </div>
                </AnimatedText>
              ))}
            </div>
          </div>

          <AnimatedText active={current === 6} delay={0.9}>
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

        {/* ═══════════ SLIDE 7: WAYS OF WORKING ═══════════ */}
        <Slide active={current === 7} index={7}>
          <AnimatedText active={current === 7} delay={0}>
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
          <AnimatedText active={current === 7} delay={0.1}>
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
          <AnimatedText active={current === 7} delay={0.2}>
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
          <CycleVisualization active={current === 7} />
        </Slide>

        {/* ═══════════ SLIDE 8: CYCLE CALENDAR VIEW ═══════════ */}
        <Slide active={current === 8} index={8}>
          <AnimatedText active={current === 8} delay={0}>
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
              Planning
            </div>
          </AnimatedText>
          <AnimatedText active={current === 8} delay={0.1}>
            <h2
              style={{
                fontSize: "clamp(28px, 3.5vw, 48px)",
                fontWeight: 800,
                textAlign: "center",
                letterSpacing: "-0.02em",
                marginBottom: 12,
              }}
            >
              2026{" "}
              <span className="yuno-logo-text">Cycle View</span>
            </h2>
          </AnimatedText>
          <AnimatedText active={current === 8} delay={0.2}>
            <p
              style={{
                fontSize: 16,
                color: COLORS.textMuted,
                textAlign: "center",
                marginBottom: 32,
                maxWidth: 550,
              }}
            >
              4 delivery cycles from{" "}
              <span style={{ color: COLORS.accent, fontWeight: 600 }}>May</span> to{" "}
              <span style={{ color: COLORS.accent, fontWeight: 600 }}>December 2026</span>
            </p>
          </AnimatedText>
          <CycleCalendarView active={current === 8} />
        </Slide>

        {/* ═══════════ SLIDE 9: STRATEGIC PROJECTS ═══════════ */}
        <Slide active={current === 9} index={9}>
          <AnimatedText active={current === 9} delay={0}>
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
          <AnimatedText active={current === 9} delay={0.1}>
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
          <AnimatedText active={current === 9} delay={0.15}>
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
          <StrategicProjectsTable active={current === 9} />
        </Slide>

        {/* ═══════════ SLIDE 10: THANK YOU ═══════════ */}
        <Slide active={current === 10} index={10}>
          <AnimatedText active={current === 10} delay={0}>
            <div style={{ marginBottom: 32, textAlign: "center" }}>
              <YunoLogo color={COLORS.primary} width={160} />
            </div>
          </AnimatedText>
          <AnimatedText active={current === 10} delay={0.2}>
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
          <AnimatedText active={current === 10} delay={0.5}>
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
