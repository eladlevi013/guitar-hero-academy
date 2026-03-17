"use client";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #04020f 0%, #0b0420 100%)",
        color: "#f0e8d8",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚠️</div>
      <h1
        style={{
          fontSize: "2.25rem",
          fontWeight: 700,
          margin: "0 0 1.25rem",
          color: "#f0e8d8",
        }}
      >
        Something broke
      </h1>
      {error.message && (
        <code
          style={{
            display: "block",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "0.5rem",
            padding: "0.75rem 1.25rem",
            marginBottom: "2rem",
            fontFamily: "monospace",
            fontSize: "0.85rem",
            color: "rgba(240,232,216,0.6)",
            maxWidth: "480px",
            wordBreak: "break-word",
            textAlign: "left",
          }}
        >
          {error.message}
        </code>
      )}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={reset}
          style={{
            display: "inline-block",
            padding: "0.75rem 1.75rem",
            borderRadius: "0.5rem",
            background: "linear-gradient(135deg, #c8553d 0%, #a63518 100%)",
            color: "#f0e8d8",
            fontWeight: 600,
            fontSize: "1rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        <a
          href="/"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.75rem",
            borderRadius: "0.5rem",
            background: "transparent",
            color: "#f0e8d8",
            fontWeight: 600,
            fontSize: "1rem",
            textDecoration: "none",
            border: "1.5px solid rgba(240,232,216,0.35)",
          }}
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
