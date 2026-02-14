"use client";

import { useState, useEffect } from "react";

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

function GlitchText({ text }: { text: string }) {
  return (
    <h1
      style={{
        fontSize: "clamp(3rem, 10vw, 8rem)",
        fontWeight: 800,
        letterSpacing: "-0.03em",
        lineHeight: 1,
        color: "var(--text)",
        position: "relative",
      }}
    >
      {text}
    </h1>
  );
}

function GridBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage: `
          linear-gradient(var(--border) 1px, transparent 1px),
          linear-gradient(90deg, var(--border) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        opacity: 0.3,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

function FloatingOrb() {
  return (
    <div
      style={{
        position: "fixed",
        top: "20%",
        right: "10%",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, var(--accent), transparent 70%)",
        opacity: 0.08,
        filter: "blur(80px)",
        pointerEvents: "none",
        zIndex: 0,
        animation: "float 8s ease-in-out infinite",
      }}
    />
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
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
          margin-left: 4px;
          animation: blink 1s step-end infinite;
          vertical-align: text-bottom;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>

      <GridBackground />
      <FloatingOrb />
      <ThemeToggle />

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "2rem clamp(2rem, 8vw, 10rem)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {mounted && (
          <>
            <div className="fade-up" style={{ marginBottom: "1.5rem" }}>
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
                }}
              >
                <span style={{ color: "var(--accent)", marginRight: "0.5rem" }}>●</span>
                Online
              </div>
            </div>

            <div className="fade-up fade-up-delay-1">
              <GlitchText text="Martin" />
              <GlitchText text="Mexia" />
            </div>

            <div
              className="fade-up fade-up-delay-2"
              style={{
                marginTop: "2rem",
                maxWidth: "500px",
              }}
            >
              <p
                style={{
                  fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
                  color: "var(--text-secondary)",
                  fontWeight: 300,
                  letterSpacing: "0.15em",
                  fontStyle: "italic",
                }}
              >
                Cerca Trova
                <span className="cursor-blink" />
              </p>
            </div>

            <div
              className="fade-up fade-up-delay-3"
              style={{
                marginTop: "4rem",
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
                onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
              >
                LinkedIn →
              </a>
              <a
                href="mailto:hello@martinmexia.com"
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
                onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
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
