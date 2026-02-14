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
interface Node {
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
  const nodesRef = useRef<Node[]>([]);
  const animRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  const companies = [
    { label: "REVOLUT" },
    { label: "RAPPI" },
    { label: "PAYIT" },
  ];

  const initNodes = useCallback((w: number, h: number) => {
    const nodes: Node[] = [];

    // Company nodes — spread across the canvas
    const positions = [
      { x: w * 0.2, y: h * 0.35 },
      { x: w * 0.5, y: h * 0.25 },
      { x: w * 0.8, y: h * 0.4 },
    ];

    companies.forEach((c, i) => {
      const pos = positions[i];
      nodes.push({
        x: pos.x,
        y: pos.y,
        vx: 0,
        vy: 0,
        radius: 32,
        label: c.label,
        isCompany: true,
        baseX: pos.x,
        baseY: pos.y,
      });
    });

    // Ambient particle nodes
    const numParticles = Math.floor((w * h) / 12000);
    for (let i = 0; i < numParticles; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      nodes.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1,
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

    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("mouseleave", handleMouseLeave);

    const isDark = () =>
      document.documentElement.getAttribute("data-theme") === "dark";

    const animate = () => {
      const { w, h } = sizeRef.current;
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;
      const dark = isDark();

      ctx.clearRect(0, 0, w, h);

      const connectionDist = 150;
      const mouseDist = 200;
      const accentColor = dark ? "59, 130, 246" : "0, 102, 255";
      const particleColor = dark ? "255, 255, 255" : "0, 0, 0";

      // Update positions
      nodes.forEach((node) => {
        if (node.isCompany) {
          // Company nodes gently float around base position
          const dx = node.baseX - node.x;
          const dy = node.baseY - node.y;
          node.vx += dx * 0.001;
          node.vy += dy * 0.001;
          node.vx *= 0.98;
          node.vy *= 0.98;

          // React to mouse — attract slightly
          const mdx = mouse.x - node.x;
          const mdy = mouse.y - node.y;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < 250) {
            node.vx += (mdx / md) * 0.15;
            node.vy += (mdy / md) * 0.15;
          }
        } else {
          // Particles drift and react to mouse
          const mdx = mouse.x - node.x;
          const mdy = mouse.y - node.y;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);

          if (md < mouseDist) {
            const force = (mouseDist - md) / mouseDist;
            node.vx += (mdx / md) * force * 0.5;
            node.vy += (mdy / md) * force * 0.5;
          }

          // Drift back to base
          node.vx += (node.baseX - node.x) * 0.0005;
          node.vy += (node.baseY - node.y) * 0.0005;
          node.vx *= 0.99;
          node.vy *= 0.99;
        }

        node.x += node.vx;
        node.y += node.vy;

        // Wrap around edges
        if (node.x < -50) node.x = w + 50;
        if (node.x > w + 50) node.x = -50;
        if (node.y < -50) node.y = h + 50;
        if (node.y > h + 50) node.y = -50;
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist =
            nodes[i].isCompany || nodes[j].isCompany
              ? connectionDist * 1.5
              : connectionDist;

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.4;
            const color =
              nodes[i].isCompany || nodes[j].isCompany
                ? accentColor
                : particleColor;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${color}, ${opacity})`;
            ctx.lineWidth =
              nodes[i].isCompany && nodes[j].isCompany ? 1.5 : 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw mouse connections
      nodes.forEach((node) => {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseDist) {
          const opacity = (1 - dist / mouseDist) * 0.6;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${accentColor}, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach((node) => {
        if (node.isCompany) {
          // Company node — circle with label
          const mdx = mouse.x - node.x;
          const mdy = mouse.y - node.y;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);
          const hover = md < 80;
          const scale = hover ? 1.15 : 1;
          const r = node.radius * scale;

          // Glow
          if (hover) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, r + 15, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${accentColor}, 0.08)`;
            ctx.fill();
          }

          // Circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
          ctx.fillStyle = dark
            ? `rgba(20, 20, 20, ${hover ? 0.95 : 0.85})`
            : `rgba(255, 255, 255, ${hover ? 0.95 : 0.85})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(${accentColor}, ${hover ? 0.8 : 0.3})`;
          ctx.lineWidth = hover ? 2 : 1;
          ctx.stroke();

          // Label
          ctx.font = `${hover ? "bold " : ""}${
            hover ? 11 : 10
          }px -apple-system, BlinkMacSystemFont, sans-serif`;
          ctx.fillStyle = `rgba(${accentColor}, ${hover ? 1 : 0.7})`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(node.label || "", node.x, node.y);

          // Hover hint
          if (hover) {
            ctx.font =
              "9px -apple-system, BlinkMacSystemFont, sans-serif";
            ctx.fillStyle = dark
              ? "rgba(255,255,255,0.4)"
              : "rgba(0,0,0,0.4)";
            ctx.fillText("coming soon", node.x, node.y + r + 16);
          }
        } else {
          // Particle
          const mdx = mouse.x - node.x;
          const mdy = mouse.y - node.y;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);
          const glow = md < mouseDist ? (mouseDist - md) / mouseDist : 0;

          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + glow * 2, 0, Math.PI * 2);
          ctx.fillStyle = glow > 0
            ? `rgba(${accentColor}, ${0.3 + glow * 0.5})`
            : `rgba(${particleColor}, 0.15)`;
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
                <span style={{ color: "var(--accent)", marginRight: "0.5rem" }}>●</span>
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
                onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
              >
                LinkedIn →
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
