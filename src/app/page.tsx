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
  const edgesRef = useRef<[number, number][]>([]);
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

    // Ambient particles — grid-based with jitter for even distribution (no empty gaps)
    const spacing = 90; // grid cell size — ensures every area has nodes within connection range
    const cols = Math.ceil(w / spacing);
    const rows = Math.ceil(h / spacing);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * spacing + (Math.random() - 0.5) * spacing * 0.8 + spacing / 2;
        const y = row * spacing + (Math.random() - 0.5) * spacing * 0.8 + spacing / 2;
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

      // Pre-compute permanent edges based on initial positions
      const nodes = nodesRef.current;
      const edges: [number, number][] = [];
      const edgeDist = 160;
      const companyNodes = nodes.filter((n) => n.isCompany);
      const clearRadius = 50;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (nodes[i].isCompany && nodes[j].isCompany) continue;
          // Company-to-particle edges
          if (nodes[i].isCompany || nodes[j].isCompany) {
            const cn = nodes[i].isCompany ? nodes[i] : nodes[j];
            const pn = nodes[i].isCompany ? nodes[j] : nodes[i];
            const dx = pn.x - cn.x;
            const dy = pn.y - cn.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > clearRadius && dist < edgeDist * 1.8) {
              edges.push([i, j]);
            }
          } else {
            // Particle-to-particle edges
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < edgeDist) {
              // Skip if passes through company node
              let blocked = false;
              for (const cn of companyNodes) {
                const ldx = nodes[j].x - nodes[i].x;
                const ldy = nodes[j].y - nodes[i].y;
                const lenSq = ldx * ldx + ldy * ldy;
                if (lenSq === 0) continue;
                let t = ((cn.x - nodes[i].x) * ldx + (cn.y - nodes[i].y) * ldy) / lenSq;
                t = Math.max(0, Math.min(1, t));
                const cx = nodes[i].x + t * ldx;
                const cy = nodes[i].y + t * ldy;
                if ((cn.x - cx) ** 2 + (cn.y - cy) ** 2 < clearRadius * clearRadius) {
                  blocked = true;
                  break;
                }
              }
              if (!blocked) edges.push([i, j]);
            }
          }
        }
      }
      edgesRef.current = edges;
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

        // Bounce particles at edges (no wrapping — keeps permanent edges intact)
        if (!node.isCompany) {
          if (node.x < 0) { node.x = 0; node.vx *= -1; }
          if (node.x > w) { node.x = w; node.vx *= -1; }
          if (node.y < 0) { node.y = 0; node.vy *= -1; }
          if (node.y > h) { node.y = h; node.vy *= -1; }
        }
      });

      // Draw permanent edges — connections never break
      const clearRadius = 50;
      const edges = edgesRef.current;
      edges.forEach(([i, j]) => {
        const a = nodes[i];
        const b = nodes[j];
        const isCompanyEdge = a.isCompany || b.isCompany;

        if (isCompanyEdge) {
          const cn = a.isCompany ? a : b;
          const pn = a.isCompany ? b : a;
          const dx = pn.x - cn.x;
          const dy = pn.y - cn.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const ratio = dist > 0 ? clearRadius / dist : 0;
          const startX = cn.x + dx * ratio;
          const startY = cn.y + dy * ratio;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(pn.x, pn.y);
          ctx.strokeStyle = `rgba(${accentColor}, 0.35)`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${particleColor}, 0.35)`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      // Mouse connections
      nodes.forEach((node) => {
        if (node.isCompany) return;
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseDist) {
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

/* ─── Matrix Rain ─── */
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.scale(dpr, dpr);

    const w = window.innerWidth;
    const h = window.innerHeight;
    const fontSize = 14;
    const columns = Math.floor(w / fontSize);
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -100);
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFCERCATROVA";

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;

        // Lead character — bright green
        ctx.fillStyle = "#00ff41";
        ctx.fillText(char, x, y * fontSize);

        // Trail character — dimmer
        if (y > 1) {
          ctx.fillStyle = "rgba(0, 255, 65, 0.3)";
          const trailChar = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(trailChar, x, (y - 1) * fontSize);
        }

        drops[i] += 0.5 + Math.random() * 0.5;

        if (y * fontSize > h && Math.random() > 0.98) {
          drops[i] = 0;
        }
      });
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        background: "#000",
      }}
    />
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [inputActive, setInputActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [matrixMode, setMatrixMode] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (inputActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputActive]);

  const handleCursorClick = () => {
    setInputValue("CERCA TROVA");
    setInputActive(true);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setMatrixMode(true);
    }
    if (e.key === "Escape") {
      setInputActive(false);
      setInputValue("");
    }
  };

  const exitMatrix = () => {
    setMatrixMode(false);
    setInputActive(false);
    setInputValue("");
  };

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
          cursor: text;
          pointer-events: auto;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        .shake {
          animation: shake 0.4s ease;
        }
        .secret-input {
          background: transparent;
          border: none;
          outline: none;
          color: var(--accent);
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          font-weight: 300;
          letter-spacing: 0.25em;
          font-style: italic;
          text-transform: uppercase;
          font-family: inherit;
          width: 100%;
          text-align: center;
          caret-color: var(--accent);
          pointer-events: auto;
        }
        .secret-input::placeholder {
          color: var(--accent);
          opacity: 0.3;
        }
        @keyframes matrixFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .matrix-overlay {
          animation: matrixFadeIn 1s ease forwards;
        }
        @keyframes glitch {
          0%, 100% { text-shadow: 2px 0 #00ff41, -2px 0 #ff0040; }
          25% { text-shadow: -2px -1px #00ff41, 2px 1px #ff0040; }
          50% { text-shadow: 1px 2px #00ff41, -1px -2px #ff0040; }
          75% { text-shadow: -1px 1px #00ff41, 1px -1px #ff0040; }
        }
      `}</style>

      {matrixMode ? (
        <div className="matrix-overlay" style={{ position: "fixed", inset: 0, zIndex: 50 }}>
          <MatrixRain />
          <div
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 51,
            }}
          >
            <h1
              style={{
                fontSize: "clamp(2rem, 6vw, 5rem)",
                fontWeight: 800,
                color: "#00ff41",
                fontFamily: "monospace",
                letterSpacing: "0.1em",
                animation: "glitch 0.3s ease infinite",
                textShadow: "0 0 20px rgba(0,255,65,0.5)",
              }}
            >
              SEEK AND YOU WILL FIND
            </h1>
            <p
              style={{
                marginTop: "2rem",
                color: "#00ff41",
                fontFamily: "monospace",
                fontSize: "1rem",
                opacity: 0.7,
                letterSpacing: "0.2em",
              }}
            >
              YOU FOUND IT
            </p>
            <button
              onClick={exitMatrix}
              style={{
                marginTop: "3rem",
                padding: "0.6rem 2rem",
                background: "transparent",
                border: "1px solid #00ff41",
                color: "#00ff41",
                fontFamily: "monospace",
                fontSize: "0.85rem",
                letterSpacing: "0.15em",
                cursor: "pointer",
                transition: "all 0.3s ease",
                borderRadius: "4px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(0,255,65,0.1)";
                e.currentTarget.style.boxShadow = "0 0 15px rgba(0,255,65,0.3)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              RETURN →
            </button>
          </div>
        </div>
      ) : (
        <>
          <NeuralNetwork />
          <ThemeToggle />
        </>
      )}

      {!matrixMode && (
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
                className={`fade-up fade-up-delay-2 ${shake ? "shake" : ""}`}
                style={{ marginTop: "2rem" }}
              >
                {inputActive ? (
                  <input
                    ref={inputRef}
                    type="text"
                    className="secret-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    onBlur={() => {
                      if (!inputValue) {
                        setInputActive(false);
                      }
                    }}
                    placeholder="..."
                    maxLength={20}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                ) : (
                  <p
                    onClick={handleCursorClick}
                    style={{
                      fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                      color: "var(--accent)",
                      fontWeight: 300,
                      letterSpacing: "0.25em",
                      fontStyle: "italic",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Cerca Trova
                    <span
                      className="cursor-blink"
                      title=""
                    />
                  </p>
                )}
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
      )}

      {!matrixMode && (
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
      )}
    </>
  );
}
