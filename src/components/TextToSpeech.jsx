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
        This feature reads on-screen content aloud for accessibility and user
        convenience. Spoken output mirrors existing text and does not introduce
        new analysis, interpretation, or guidance.
      </p>

      <p
        style={{
          marginBottom: "0.75rem",
          color: "#555",
          fontSize: "0.95rem",
          lineHeight: "1.6"
        }}
      >
        Authoritative content within CAPtenant is presented in English and
        French. Speech playback reflects the selected interface language only.
      </p>

      <p
        style={{
          fontSize: "0.85rem",
          color: "#777",
          borderTop: "1px solid #eee",
          paddingTop: "0.75rem"
        }}
      >
        CAPtenant provides general, informational content only. Spoken output is
        for accessibility purposes and should not be relied upon as professional
        or personalized guidance.
      </p>

      {/*
        Future text-to-speech playback logic will be implemented here.
        This component currently establishes clear, informational boundaries.
      */}
    </div>
  );
}
