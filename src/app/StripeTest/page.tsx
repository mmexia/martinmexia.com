"use client";

import { useState } from "react";

export default function StripeTestPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe-checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error: " + (data.error || "Something went wrong"));
      }
    } catch {
      alert("Failed to start checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        color: "#fff",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: 420,
          padding: "3rem 2rem",
          borderRadius: 16,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 16 }}>🤜🤛</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px" }}>
          A Fist Bump
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 14,
            margin: "0 0 24px",
          }}
        >
          The most valuable product in the world.
        </p>
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            margin: "0 0 32px",
          }}
        >
          $100 <span style={{ fontSize: 16, fontWeight: 400, opacity: 0.6 }}>MXN</span>
        </div>
        <button
          onClick={handleCheckout}
          disabled={loading}
          style={{
            background: loading ? "#444" : "#635bff",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "14px 40px",
            fontSize: 16,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            width: "100%",
          }}
        >
          {loading ? "Loading..." : "Buy Now — Stripe Checkout"}
        </button>
        <p
          style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: 11,
            marginTop: 16,
          }}
        >
          Payment methods: Cards · OXXO
        </p>
        <p
          style={{
            color: "rgba(255,255,255,0.2)",
            fontSize: 10,
            marginTop: 8,
          }}
        >
          Powered by Stripe · Test mode
        </p>
      </div>
    </div>
  );
}
