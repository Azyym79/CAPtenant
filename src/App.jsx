import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

import FlashlightLogo from "./components/FlashlightLogo";
import LanguageSelector from "./components/LanguageSelector";

// Pages
import Home from "./pages/Home";
import AGIExplainer from "./pages/AGIExplainer";
import LetterGenerator from "./pages/LetterGenerator";
import RightsFAQ from "./pages/RightsFAQ";
import VoiceAssistant from "./pages/VoiceAssistant";
import Glossary from "./pages/Glossary";
import TenantPALAnalyzer from "./pages/TenantPALAnalyzer";

export default function App() {
  /* ================= GLOBAL LANGUAGE STATE ================= */
  // Initialized to English or the previously saved preference
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("captenant_lang") || "en";
  });

  // Sync state with localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("captenant_lang", lang);
  }, [lang]);

  return (
    <Router>
      <div
        style={{
          fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fcfcfc"
        }}
      >
        {/* ================= NAVIGATION BAR ================= */}
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 2rem",
            borderBottom: "1px solid #eee",
            background: "#fff",
            position: "sticky",
            top: 0,
            zIndex: 100,
            boxShadow: "0 2px 10px rgba(0,0,0,0.03)"
          }}
        >
          {/* LEFT: LOGO & BRAND */}
          <Link to={lang === "fr" ? "/?lang=fr" : "/"} style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FlashlightLogo />
              <h2 style={{ margin: 0, fontSize: "1.6rem", color: "#0d6efd", fontWeight: "bold" }}>
                CAPtenant
              </h2>
            </div>
          </Link>

          {/* RIGHT: NAV LINKS (BILINGUAL SUPPORT) */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <NavLink lang={lang} to="/analyze" labelEn="Analyze" labelFr="Analyser" />
            <NavLink lang={lang} to="/agi" labelEn="AGI Tool" labelFr="Outil AGI" />
            <NavLink lang={lang} to="/letters" labelEn="Letters" labelFr="Lettres" />
            <NavLink lang={lang} to="/rights" labelEn="Rights FAQ" labelFr="Droits (FAQ)" />
            <NavLink lang={lang} to="/voice" labelEn="Voice" labelFr="Voix" />
            <NavLink lang={lang} to="/glossary" labelEn="Glossary" labelFr="Glossaire" />

            <div
              style={{
                borderLeft: "1px solid #ddd",
                height: "24px",
                margin: "0 10px"
              }}
            />

            {/* Selector updates the global 'lang' state */}
            <LanguageSelector lang={lang} setLang={setLang} />
          </div>
        </nav>

        {/* ================= MAIN CONTENT ROUTES ================= */}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<TenantPALAnalyzer />} />
            <Route path="/agi" element={<AGIExplainer />} />
            <Route path="/letters" element={<LetterGenerator />} />
            <Route path="/rights" element={<RightsFAQ />} />
            <Route path="/voice" element={<VoiceAssistant />} />
            <Route path="/glossary" element={<Glossary />} />
          </Routes>
        </main>

        {/* ================= FOOTER (BILINGUAL) ================= */}
        <footer style={{ padding: "2rem", textAlign: "center", borderTop: "1px solid #eee", color: "#888", fontSize: "0.9rem" }}>
          <p>© 2025 CAPtenant — {lang === "fr" ? "Aider les locataires de l'Ontario" : "Helping Ontario Tenants"}</p>
        </footer>
      </div>
    </Router>
  );
}

/**
 * Enhanced NavLink Component
 * Automatically handles label switching and URL parameter persistence
 */
const NavLink = ({ to, labelEn, labelFr, lang }) => {
  const label = lang === "fr" ? labelFr : labelEn;
  // This ensures that when a user clicks a link, the ?lang=fr stays in the URL
  const destination = lang === "fr" ? `${to}?lang=fr` : to;

  return (
    <Link
      to={destination}
      style={{
        textDecoration: "none",
        color: "#444",
        fontWeight: "600",
        fontSize: "15px",
        transition: "all 0.2s ease"
      }}
      onMouseEnter={(e) => (e.target.style.color = "#0d6efd")}
      onMouseLeave={(e) => (e.target.style.color = "#444")}
    >
      {label}
    </Link>
  );
};