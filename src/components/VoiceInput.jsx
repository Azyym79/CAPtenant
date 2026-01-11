import React from "react";

export default function VoiceInput() {
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
        Voice Assistant
      </h2>

      <p style={{ marginBottom: "0.75rem", color: "#444", lineHeight: "1.6" }}>
        The Voice Assistant allows you to describe your situation hands-free and
        organize information more easily. It is designed to support clarity,
        preparation, and communication.
      </p>

      <p
        style={{
          marginBottom: "0.75rem",
          color: "#555",
          fontSize: "0.95rem",
          lineHeight: "1.6"
        }}
      >
        You may speak in multiple languages for convenience. English and French
        are used for the primary interface and for generating written content.
      </p>

      <p
        style={{
          fontSize: "0.85rem",
          color: "#777",
          borderTop: "1px solid #eee",
          paddingTop: "0.75rem"
        }}
      >
        CAPtenant provides general information and drafting tools only. You
        remain responsible for reviewing, verifying, and deciding how to use
        any generated content.
      </p>

      {/*
        Future voice capture and transcription UI will live here.
        Intentionally minimal to ensure clear, informational-only framing.
      */}
    </div>
  );
}
