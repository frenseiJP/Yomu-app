"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#020617", color: "#f1f5f9", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 20, margin: 0 }}>Frensei — app error</h1>
          <p style={{ marginTop: 8, fontSize: 14, color: "#94a3b8", maxWidth: 360 }}>
            {error.message || "An unexpected error occurred."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{ marginTop: 24, padding: "10px 16px", borderRadius: 12, border: "none", background: "#ec4899", color: "#fff", cursor: "pointer" }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
