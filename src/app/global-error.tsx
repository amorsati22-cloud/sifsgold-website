"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#04101E",
          color: "#F5EFE0",
          fontFamily: "var(--font-montserrat), system-ui, sans-serif",
          padding: "24px",
        }}
      >
        <main
          style={{
            maxWidth: "680px",
            width: "100%",
            textAlign: "center",
            border: "1px solid #D4A84355",
            borderRadius: "20px",
            background: "#06080FCC",
            padding: "36px 24px",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#F5EFE0",
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
            }}
          >
            We can&apos;t display this right now.
          </h1>
          <p style={{ marginTop: "14px", color: "#F5EFE0CC", lineHeight: 1.6 }}>
            Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: "22px",
              border: "1px solid #D4A843",
              borderRadius: "999px",
              padding: "12px 24px",
              background: "#D4A843",
              color: "#04101E",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}

