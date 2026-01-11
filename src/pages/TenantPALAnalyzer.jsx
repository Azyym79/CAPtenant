import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import API_BASE from "../Api";

export default function TenantPALAnalyzer() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // 🇨🇦 Bilingual UI lock (EN / FR only)
  const lang = params.get("lang") === "fr" ? "fr" : "en";

  const t = {
    en: {
      title: "CAPtenant – Situation Analyzer",
      subtitle:
        "Get a clear, structured overview of your tenant situation based on the information you provide.",
      placeholder:
        "Paste tenant-related text here (notice, email, message, or description)…",
      analyze: "Analyze with CAPtenant",
      analyzing: "CAPtenant is processing your information...",
      error:
        "Unable to reach the service. Please ensure the server is available.",
      summary: "Situation Summary",
      plain: "Plain-Language Overview",
      steps: "Suggested Next Considerations",
      disclaimer:
        "This tool provides general information and educational summaries only. It does not replace official sources or professional guidance."
    },
    fr: {
      title: "CAPtenant – Analyseur de situation",
      subtitle:
        "Obtenez un aperçu clair et structuré de votre situation locative à partir des informations fournies.",
      placeholder:
        "Collez ici un texte lié à votre situation (avis, courriel, message ou description)…",
      analyze: "Analyser avec CAPtenant",
      analyzing: "CAPtenant traite les informations...",
      error:
        "Impossible de joindre le service. Veuillez vérifier que le serveur est accessible.",
      summary: "Résumé de la situation",
      plain: "Aperçu en langage clair",
      steps: "Pistes de réflexion suggérées",
      disclaimer:
        "Cet outil fournit des informations générales et des résumés éducatifs uniquement. Il ne remplace pas les sources officielles ni un accompagnement professionnel."
    }
  }[lang];

  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Primary route
      let response = await fetch(`${API_BASE}/captenant-rewrite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang })
      });

      // 🔁 Fallback for legacy support
      if (!response.ok) {
        response = await fetch(`${API_BASE}/tenantpal-rewrite`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, lang })
        });
      }

      if (!response.ok) throw new Error("API_ERROR");

      const data = await response.json();

      // ✅ Defensive check before rendering
      if (data && data.summary) {
        setResult(data);
      } else {
        throw new Error("EMPTY_DATA");
      }
    } catch (err) {
      console.error("Analyzer Error:", err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "950px",
        margin: "3rem auto",
        padding: "2rem",
        fontFamily: "'Segoe UI', Tahoma, sans-serif"
      }}
    >
      <h1
        style={{
          color: "#333",
          fontSize: "2.2rem",
          marginBottom: "0.5rem"
        }}
      >
        {t.title}
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: "1.5rem",
          fontSize: "1.1rem"
        }}
      >
        {t.subtitle}
      </p>

      <p
        style={{
          fontSize: "0.85rem",
          color: "#777",
          borderLeft: "4px solid #ffc107",
          paddingLeft: "1rem",
          marginBottom: "2rem"
        }}
      >
        ⚠️ {t.disclaimer}
      </p>

      <textarea
        rows={10}
        placeholder={t.placeholder}
        style={{
          width: "100%",
          padding: "1.2rem",
          fontSize: "1.1rem",
          borderRadius: "12px",
          border: "2px solid #e0e0e0",
          boxSizing: "border-box",
          boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          outlineColor: "#0d6efd",
          transition: "border 0.3s"
        }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={analyze}
        disabled={loading}
        style={{
          marginTop: "1.5rem",
          padding: "1rem 2rem",
          cursor: loading ? "not-allowed" : "pointer",
          background: loading ? "#cbd5e0" : "#0d6efd",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "1.1rem",
          transition: "all 0.2s ease-in-out"
        }}
      >
        {loading ? t.analyzing : t.analyze}
      </button>

      {error && (
        <div style={errorContainer}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={resultCard}>
          <h2 style={sectionHeader}>{t.summary}</h2>
          <p style={sectionText}>{result.summary}</p>

          <h2 style={sectionHeader}>{t.plain}</h2>
          <p style={sectionText}>{result.plainLanguage}</p>

          <h2 style={sectionHeader}>{t.steps}</h2>
          <ul style={{ ...sectionText, paddingLeft: "1.5rem" }}>
            {Array.isArray(result.nextSteps) &&
              result.nextSteps.map((step, index) => (
                <li key={index} style={{ marginBottom: "12px" }}>
                  {step}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */
const resultCard = {
  marginTop: "3rem",
  padding: "2.5rem",
  background: "#ffffff",
  border: "1px solid #edf2f7",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
};

const sectionHeader = {
  color: "#0d6efd",
  fontSize: "1.4rem",
  borderBottom: "2px solid #f0f4f8",
  paddingBottom: "8px",
  marginBottom: "1rem"
};

const sectionText = {
  lineHeight: "1.7",
  fontSize: "1.15rem",
  color: "#2d3748"
};

const errorContainer = {
  marginTop: "2rem",
  padding: "1rem",
  background: "#fff5f5",
  color: "#c53030",
  borderRadius: "8px",
  borderLeft: "5px solid #fc8181"
};
