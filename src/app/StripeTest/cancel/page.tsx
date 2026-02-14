"use client";

export default function CancelPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
      }}
    >
      <div>
        <div style={{ fontSize: 72, marginBottom: 16 }}>😔</div>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>No Fist Bump?</h1>
        <p style={{ color: "rgba(255,255,255,0.6)", marginTop: 8 }}>
          Payment cancelled. The fist bump will be waiting.
        </p>
        <a
          href="/StripeTest"
          style={{ color: "#635bff", marginTop: 24, display: "inline-block" }}
        >
          ← Try again
        </a>
      </div>
    </div>
  );
}
