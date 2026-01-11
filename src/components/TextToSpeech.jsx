import React from "react";

export default function TextToSpeech() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "1.5rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <h2 style={{ marginBottom: "0.75rem", color: "#333", fontWeight: "700" }}>
        Spoken Output
      </h2>

      <p style={{ marginBottom: "0.75rem", color: "#444", lineHeight: "1.6" }}>
        This feature is designed to read information aloud for accessibility
        and convenience. Spoken output mirrors on-screen text and does not
        provide legal advice or interpretations.
      </p>

      <p
        style={{
          marginBottom: "0.75rem",
          color: "#555",
          fontSize: "0.95rem",
          lineHeight: "1.6"
        }}
      >
        All spoken legal information is generated in English or French only.
        Any spoken summaries are informational and non-authoritative.
      </p>

      <p
        style={{
          fontSize: "0.85rem",
          color: "#777",
          borderTop: "1px solid #eee",
          paddingTop: "0.75rem"
        }}
      >
        CAPtenant provides general information only. Spoken content should not
        be relied upon as legal advice or a substitute for professional legal
        guidance.
      </p>

      {/*
        Future text-to-speech playback logic will be implemented here.
        This component currently establishes safe user-facing boundaries.
      */}
    </div>
  );
}
export default ()=> <div>TTS</div>;