import React from "react";

/**
 * UI Language Selector
 * 🔒 EN / FR ONLY
 * 🔒 No routing, no voice logic, no local state
 * Source of truth = App.jsx
 */
export default function LanguageSelector({ lang, setLang }) {
  const isFrench = lang === "fr";

  const toggleLanguage = () => {
    setLang(isFrench ? "en" : "fr");
  };

  return (
    <button
      onClick={toggleLanguage}
      style={{
        padding: "6px 14px",
        borderRadius: "20px",
        border: "2px solid #0d6efd",
        background: "#fff",
        color: "#0d6efd",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "14px",
        transition: "0.2s"
      }}
      title={isFrench ? "Switch to English" : "Passer en français"}
    >
      {isFrench ? "English" : "Français"}
    </button>
  );
}
