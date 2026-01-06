import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useSearchParams
} from "react-router-dom";

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

/**
 * Router-safe wrapper
 */
export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

function AppShell() {
  const [searchParams, setSearchParams] = useSearchParams();

  /* =====================================================
     🌍 UI LANGUAGE (EN / FR ONLY — CANONICAL)
     Source of truth priority:
     1) URL ?lang=
     2) localStorage
     3) default "en"
  ===================================================== */
  const initialLang =
    searchParams.get("lang") ||
    localStorage.getItem("captenant_lang") ||
    "en";

  const [lang, setLang] = useState(initialLang);

  /* =====================================================
     🔄 SYNC STATE ↔ URL ↔ LOCALSTORAGE
     FIX: preserve ALL existing query params
  ===================================================== */
  useEffect(() => {
    localStorage.setItem("captenant_lang", lang);

    const params = new URLSearchParams(searchParams);

    if (lang === "fr") {
      params.set("lang", "fr");
    } else {
      params.delete("lang");
    }

    setSearchParams(params, { replace: true });
  }, [lang, searchParams, setSearchParams]);

  return (
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
        {/* LEFT: LOGO */}
        <Link
          to={lang === "fr" ? "/?lang=fr" : "/"}
          style={{ textDecoration: "none" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <FlashlightLogo />
            <h2
              style={{
                margin: 0,
                fontSize: "1.6rem",
                color: "#0d6efd",
                fontWeight: "bold"
              }}
            >
              CAPtenant
            </h2>
          </div>
        </Link>

        {/* RIGHT: NAV LINKS */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <SafeLink to="/analyze" lang={lang} en="Analyze" fr="Analyser" />
          <SafeLink to="/agi" lang={lang} en="AGI Tool" fr="Outil AGI" />
          <SafeLink to="/letters" lang={lang} en="Letters" fr="Lettres" />
          <SafeLink to="/rights" lang={lang} en="Rights FAQ" fr="Droits (FAQ)" />
          <SafeLink to="/voice" lang={lang} en="Voice" fr="Voix" />
          <SafeLink to="/glossary" lang={lang} en="Glossary" fr="Glossaire" />

          <div
            style={{
              borderLeft: "1px solid #ddd",
              height: "24px",
              margin: "0 10px"
            }}
          />

          {/* UI language selector (EN / FR ONLY) */}
          <LanguageSelector lang={lang} setLang={setLang} />
        </div>
      </nav>

      {/* ================= ROUTES ================= */}
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

      {/* ================= FOOTER ================= */}
      <footer
        style={{
          padding: "2rem",
          textAlign: "center",
          borderTop: "1px solid #eee",
          color: "#888",
          fontSize: "0.9rem"
        }}
      >
        <p>
          © 2025 CAPtenant —{" "}
          {lang === "fr"
            ? "Aider les locataires de l'Ontario"
            : "Helping Ontario Tenants"}
        </p>

        <p style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "#999" }}>
  {lang === "fr"
    ? "Avertissement : CAPtenant fournit des informations juridiques générales à des fins éducatives uniquement. Il ne s’agit pas d’un avis juridique et ne remplace pas les conseils d’un professionnel du droit ou de la Commission de la location immobilière de l’Ontario."
    : "Disclaimer: CAPtenant provides general legal information for educational purposes only. It is not legal advice and does not replace advice from a qualified legal professional or the Ontario Landlord and Tenant Board."}
</p>

      </footer>
    </div>
  );
}

/**
 * Safe navigation link
 * Preserves ?lang=fr across navigation
 */
function SafeLink({ to, en, fr, lang }) {
  const label = lang === "fr" ? fr : en;
  const href = lang === "fr" ? `${to}?lang=fr` : to;

  return (
    <Link
      to={href}
      style={{
        textDecoration: "none",
        color: "#444",
        fontWeight: "600",
        fontSize: "15px"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#0d6efd")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}
    >
      {label}
    </Link>
  );
}
