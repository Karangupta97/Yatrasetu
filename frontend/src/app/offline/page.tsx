"use client";

export default function OfflinePage() {
  return (
    <div
      style={{
        fontFamily: "'Google Sans', system-ui, sans-serif",
        background: "#f0f2f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "24px",
        textAlign: "center",
        color: "#181d2a",
      }}
    >
      <div style={{ fontSize: "72px", marginBottom: "24px" }}>🚂</div>
      <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "12px" }}>
        You&apos;re offline
      </h1>
      <p
        style={{
          color: "#6b7280",
          fontSize: "15px",
          lineHeight: "1.6",
          maxWidth: "360px",
          marginBottom: "32px",
        }}
      >
        It looks like you&apos;ve lost your internet connection. Please check
        your network and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          padding: "12px 32px",
          background: "#748efe",
          color: "white",
          border: "none",
          borderRadius: "12px",
          fontSize: "15px",
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Try again
      </button>
    </div>
  );
}
