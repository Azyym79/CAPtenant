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
        The Voice Assistant helps you describe your situation and organize
        information hands-free. It is designed to support understanding and
        communication, not to provide legal advice.
      </p>

      <p
        style={{
          marginBottom: "0.75rem",
          color: "#555",
          fontSize: "0.95rem",
          lineHeight: "1.6"
        }}
      >
        You may speak in multiple languages for convenience. All legal
        information and generated letters are provided in English or French
        only.
      </p>

      <p
        style={{
          fontSize: "0.85rem",
          color: "#777",
          borderTop: "1px solid #eee",
          paddingTop: "0.75rem"
        }}
      >
        CAPtenant provides general information only and does not offer legal
        advice. You remain responsible for how you use any information or
        drafts generated.
      </p>

      {/* 
        Future voice capture and transcription UI will live here.
        Intentionally left minimal to ensure legal-safe framing first.
      */}
    </div>
  );
}
export default ()=> <div>Voice</div>;