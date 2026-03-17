import Link from "next/link";

export default function NotFound() {
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
      <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🎸</div>
      <h1
        style={{
          font: "var(--font-display)",
          fontSize: "6rem",
          fontWeight: 700,
          margin: "0 0 0.5rem",
          lineHeight: 1,
          color: "#f0e8d8",
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: 500,
          margin: "0 0 1rem",
          color: "rgba(240,232,216,0.8)",
        }}
      >
        Level not found
      </h2>
      <p
        style={{
          fontSize: "1rem",
          color: "rgba(240,232,216,0.55)",
          margin: "0 0 2.5rem",
          maxWidth: "360px",
        }}
      >
        That page doesn&apos;t exist or was moved.
      </p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.75rem",
            borderRadius: "0.5rem",
            background: "linear-gradient(135deg, #c8553d 0%, #a63518 100%)",
            color: "#f0e8d8",
            fontWeight: 600,
            fontSize: "1rem",
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
        >
          Go Home
        </Link>
        <Link
          href="/practice"
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
            transition: "border-color 0.2s",
          }}
        >
          World Map
        </Link>
      </div>
    </div>
  );
}
