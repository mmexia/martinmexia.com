"use client";

export default function SuccessPage() {
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
        <div style={{ fontSize: 72, marginBottom: 16 }}>✅</div>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Fist Bump Received!</h1>
        <p style={{ color: "rgba(255,255,255,0.6)", marginTop: 8 }}>
          Payment successful. You are now officially cool.
        </p>
        <a
          href="/StripeTest"
          style={{ color: "#635bff", marginTop: 24, display: "inline-block" }}
        >
          ← Back
        </a>
      </div>
    </div>
  );
}
