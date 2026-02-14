"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Theme Toggle ─── */
function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setDark(current === "dark");
  }, []);

  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setDark(!dark);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      style={{
        position: "fixed",
        top: "2rem",
        right: "2rem",
        background: "var(--toggle-bg)",
        border: "none",
        borderRadius: "50%",
        width: "44px",
        height: "44px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.2rem",
        transition: "all 0.3s ease",
        zIndex: 100,
      }}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

/* ─── Neural Network Canvas ─── */
interface NetNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  label?: string;
  isCompany?: boolean;
  baseX: number;
  baseY: number;
}

function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const clickRef = useRef({ x: -1000, y: -1000, time: 0 });
  const nodesRef = useRef<NetNode[]>([]);
  const animRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  const companies = [
    { label: "Revolut" },
    { label: "Rappi" },
    { label: "PayIt" },
  ];

  const initNodes = useCallback((w: number, h: number) => {
    const nodes: NetNode[] = [];

    // Company nodes — well separated, anchored positions
    const positions = [
      { x: w * 0.15, y: h * 0.3 },
      { x: w * 0.5, y: h * 0.18 },
      { x: w * 0.85, y: h * 0.35 },
    ];

    companies.forEach((c, i) => {
      const pos = positions[i];
      nodes.push({
        x: pos.x,
        y: pos.y,
        vx: 0,
        vy: 0,
        radius: 38,
        label: c.label,
        isCompany: true,
        baseX: pos.x,
        baseY: pos.y,
      });
    });

    // Ambient particles
    const numParticles = Math.floor((w * h) / 14000);
    for (let i = 0; i < numParticles; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      nodes.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: Math.random() * 2.5 + 1,
        baseX: x,
        baseY: y,
      });
    }

    return nodes;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(dpr, dpr);
      sizeRef.current = { w: window.innerWidth, h: window.innerHeight };
      nodesRef.current = initNodes(window.innerWidth, window.innerHeight);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const handleClick = (e: MouseEvent) => {
      clickRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    };

    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("click", handleClick);

    const isDark = () =>
      document.documentElement.getAttribute("data-theme") === "dark";

    const animate = () => {
      const { w, h } = sizeRef.current;
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;
      const dark = isDark();

      ctx.clearRect(0, 0, w, h);

      const connectionDist = 160;
      const mouseDist = 220;
      const accentColor = dark ? "100, 160, 255" : "0, 90, 220";
      const particleColor = dark ? "150, 180, 255" : "40, 60, 120";

      // Update positions
      nodes.forEach((node) => {
        if (node.isCompany) {
          // ANCHOR behavior — very strong pull back to base, minimal drift
          const dx = node.baseX - node.x;
          const dy = node.baseY - node.y;
          // Strong spring back to base
          node.vx += dx * 0.02;
          node.vy += dy * 0.02;
          // Heavy damping
          node.vx *= 0.9;
          node.vy *= 0.9;

          // Mouse influence is very subtle — just a tiny nudge
          const mdx = mouse.x - node.x;
          const mdy = mouse.y - node.y;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < 150) {
            node.vx += (mdx / md) * 0.01;
            node.vy += (mdy / md) * 0.01;
          }

          // Clamp max displacement from base (never more than 20px)
          const distFromBase = Math.sqrt(
            (node.x + node.vx - node.baseX) ** 2 +
            (node.y + node.vy - node.baseY) ** 2
          );
          if (distFromBase > 20) {
            node.vx *= 0.5;
            node.vy *= 0.5;
          }
        } else {
          // Particles — subtle movement

          // Repel from company nodes (don't overlap labels)
          const companyNodes = nodes.filter((n) => n.isCompany);
          companyNodes.forEach((cn) => {
            const cdx = node.x - cn.x;
            const cdy = node.y - cn.y;
            const cd = Math.sqrt(cdx * cdx + cdy * cdy);
            const minDist = cn.radius + 25; // keep clear of label area
            if (cd < minDist && cd > 0) {
              const repelForce = (minDist - cd) / minDist;
              node.vx += (cdx / cd) * repelForce * 0.3;
              node.vy += (cdy / cd) * repelForce * 0.3;
            }
          });

          // Click attraction — gentle drift toward click point
          const click = clickRef.current;
          const timeSinceClick = Date.now() - click.time;
          if (timeSinceClick < 3000) { // effect lasts 3 seconds
            const cdx = click.x - node.x;
            const cdy = click.y - node.y;
            const cd = Math.sqrt(cdx * cdx + cdy * cdy);
            if (cd > 5) {
              const fade = 1 - timeSinceClick / 3000;
              node.vx += (cdx / cd) * 0.03 * fade;
              node.vy += (cdy / cd) * 0.03 * fade;
            }
          }

          // Very gentle mouse influence (hover, not attract aggressively)
          const mdx = mouse.x - node.x;
          const mdy = mouse.y - node.y;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < mouseDist) {
            const force = (mouseDist - md) / mouseDist;
            node.vx += (mdx / md) * force * 0.04;
            node.vy += (mdy / md) * force * 0.04;
          }

          // Drift back to base — very gentle
          node.vx += (node.baseX - node.x) * 0.0001;
          node.vy += (node.baseY - node.y) * 0.0001;
          // Strong damping for subtle motion
          node.vx *= 0.985;
          node.vy *= 0.985;
        }

        node.x += node.vx;
        node.y += node.vy;

        // Wrap particles (not companies)
        if (!node.isCompany) {
          if (node.x < -50) node.x = w + 50;
          if (node.x > w + 50) node.x = -50;
          if (node.y < -50) node.y = h + 50;
          if (node.y > h + 50) node.y = -50;
        }
      });

      // Helper: check if a line segment passes through any company node
      const companyNodes = nodes.filter((n) => n.isCompany);
      const clearRadius = 50; // clear zone around company centers

      const linePassesThroughCompany = (x1: number, y1: number, x2: number, y2: number) => {
        for (const cn of companyNodes) {
          // Distance from point to line segment
          const dx = x2 - x1;
          const dy = y2 - y1;
          const lenSq = dx * dx + dy * dy;
          if (lenSq === 0) continue;
          let t = ((cn.x - x1) * dx + (cn.y - y1) * dy) / lenSq;
          t = Math.max(0, Math.min(1, t));
          const closestX = x1 + t * dx;
          const closestY = y1 + t * dy;
          const distSq = (cn.x - closestX) ** 2 + (cn.y - closestY) ** 2;
          if (distSq < clearRadius * clearRadius) return true;
        }
        return false;
      };

      // Draw connections — skip any that pass through company nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          // Skip connections between two non-company nodes if they cross a company
          if (nodes[i].isCompany || nodes[j].isCompany) continue; // company connections drawn separately

          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            // Skip if line passes through any company node
            if (linePassesThroughCompany(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y)) continue;

            const opacity = (1 - dist / connectionDist) * 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${particleColor}, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw connections from particles to company nodes — only from edge of clear zone outward
      companyNodes.forEach((cn) => {
        nodes.forEach((node) => {
          if (node.isCompany) return;
          const dx = node.x - cn.x;
          const dy = node.y - cn.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          // Only connect if particle is outside clear zone but within range
          if (dist > clearRadius && dist < connectionDist * 1.8) {
            const opacity = (1 - dist / (connectionDist * 1.8)) * 0.6;
            // Start line from edge of clear zone, not center
            const ratio = clearRadius / dist;
            const startX = cn.x + dx * ratio;
            const startY = cn.y + dy * ratio;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = `rgba(${accentColor}, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      });

      // Mouse connections — also avoid company zones
      nodes.forEach((node) => {
        if (node.isCompany) return;
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseDist) {
          if (linePassesThroughCompany(node.x, node.y, mouse.x, mouse.y)) return;
          const opacity = (1 - dist / mouseDist) * 0.8;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${accentColor}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach((node) => {
        if (node.isCompany) {
          const mdx = mouse.x - node.x;
          const mdy = mouse.y - node.y;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);
          const hover = md < 90;
          const scale = hover ? 1.1 : 1;
          const r = node.radius * scale;

          // Outer glow
          ctx.beginPath();
          ctx.arc(node.x, node.y, r + 20, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${accentColor}, ${hover ? 0.12 : 0.04})`;
          ctx.fill();

          // Circle — solid fill to fully occlude lines behind + outline
          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
          ctx.fillStyle = dark ? "rgb(10, 10, 10)" : "rgb(255, 255, 255)";
          ctx.fill();
          ctx.strokeStyle = `rgba(${accentColor}, ${hover ? 0.9 : 0.45})`;
          ctx.lineWidth = hover ? 2 : 1.5;
          ctx.stroke();

          // Elegant brand text — same color as connections, outline style
          const fontSize = hover ? 14 : 13;
          ctx.font = `300 ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Stroke text for outline effect
          ctx.strokeStyle = `rgba(${accentColor}, ${hover ? 1 : 0.7})`;
          ctx.lineWidth = 0.8;
          ctx.strokeText(node.label || "", node.x, node.y);
          // Light fill
          ctx.fillStyle = `rgba(${accentColor}, ${hover ? 0.9 : 0.5})`;
          ctx.fillText(node.label || "", node.x, node.y);

          if (hover) {
            ctx.font =
              '300 9px -apple-system, BlinkMacSystemFont, sans-serif';
            ctx.fillStyle = dark
              ? "rgba(255,255,255,0.4)"
              : "rgba(0,0,0,0.4)";
            ctx.textAlign = "center";
            ctx.fillText("coming soon", node.x, node.y + r + 18);
          }
        } else {
          // Particle
          const mdx = mouse.x - node.x;
          const mdy = mouse.y - node.y;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);
          const glow = md < mouseDist ? (mouseDist - md) / mouseDist : 0;

          ctx.beginPath();
          ctx.arc(
            node.x,
            node.y,
            node.radius + glow * 3,
            0,
            Math.PI * 2
          );
          ctx.fillStyle =
            glow > 0
              ? `rgba(${accentColor}, ${0.4 + glow * 0.5})`
              : `rgba(${particleColor}, 0.35)`;
          ctx.fill();
        }
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("click", handleClick);
    };
  }, [initNodes]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "auto",
      }}
    />
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          opacity: 0;
          animation: fadeUp 0.8s ease forwards;
        }
        .fade-up-delay-1 { animation-delay: 0.2s; }
        .fade-up-delay-2 { animation-delay: 0.4s; }
        .fade-up-delay-3 { animation-delay: 0.6s; }
        .cursor-blink {
          display: inline-block;
          width: 3px;
          height: 1em;
          background: var(--accent);
          margin-left: 6px;
          animation: blink 1s step-end infinite;
          vertical-align: text-bottom;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>

      <NeuralNetwork />
      <ThemeToggle />

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          pointerEvents: "none",
          textAlign: "center",
        }}
      >
        {mounted && (
          <>
            <div className="fade-up" style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "0.4rem 1rem",
                  border: "1px solid var(--border)",
                  borderRadius: "100px",
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  background: "var(--bg)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <span
                  style={{ color: "var(--accent)", marginRight: "0.5rem" }}
                >
                  ●
                </span>
                Online
              </div>
            </div>

            <div className="fade-up fade-up-delay-1">
              <h1
                style={{
                  fontSize: "clamp(2.5rem, 8vw, 6rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  color: "var(--text)",
                }}
              >
                Martin Mexia
              </h1>
            </div>

            <div
              className="fade-up fade-up-delay-2"
              style={{ marginTop: "2rem" }}
            >
              <p
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                  color: "var(--accent)",
                  fontWeight: 300,
                  letterSpacing: "0.25em",
                  fontStyle: "italic",
                  textTransform: "uppercase",
                }}
              >
                Cerca Trova
                <span className="cursor-blink" />
              </p>
            </div>

            <div
              className="fade-up fade-up-delay-3"
              style={{
                marginTop: "3rem",
                pointerEvents: "auto",
                display: "flex",
                gap: "1rem",
              }}
            >
              <a
                href="https://linkedin.com/in/martinmexia"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "0.8rem 2rem",
                  background: "var(--accent)",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  border: "none",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.opacity = "0.85")
                }
                onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
              >
                LinkedIn →
              </a>
              <a
                href="mailto:martinmexia@gmail.com"
                style={{
                  padding: "0.8rem 2rem",
                  background: "transparent",
                  color: "var(--text)",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  border: "1px solid var(--border)",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.borderColor = "var(--accent)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              >
                Contact
              </a>
            </div>
          </>
        )}
      </main>

      <footer
        style={{
          position: "fixed",
          bottom: "2rem",
          left: "0",
          right: "0",
          textAlign: "center",
          fontSize: "0.75rem",
          color: "var(--text-secondary)",
          letterSpacing: "0.1em",
          zIndex: 1,
        }}
      >
        © {new Date().getFullYear()} MARTIN MEXIA
      </footer>
    </>
  );
}
