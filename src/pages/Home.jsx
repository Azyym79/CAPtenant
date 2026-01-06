import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  // 🇨🇦 BILINGUAL REALITY: Locking UI to EN or FR only
  const lang = params.get("lang") === "fr" ? "fr" : "en";

  const content = {
    en: {
      title: "Welcome to CAPtenant",
      desc: "CAPtenant guides tenants through Ontario’s rental rules and rights, helping them act early and avoid unnecessary conflict.",
      tagline: "Helping tenants find their way — before disputes escalate.",
      agiTitle: "AGI Explained",
      agiDesc: "Understand Above Guideline Rent Increases and what to do when your landlord demands too much.",
      letterTitle: "Generate Letters",
      letterDesc: "Easily create formal letters for AGI disputes, repair requests, payment plans, and more.",
      rightsTitle: "Your Rights",
      rightsDesc: "Learn your core legal protections as a tenant — simplified and easy to understand.",
      // 🌍 MULTILINGUAL SCOPE: Only on Voice Assistant
      voiceTitle: "Voice Assistant",
      voiceDesc: "Ask questions or fill forms hands-free — supports English, French, Spanish, Arabic, and Urdu.",
      glossaryTitle: "Glossary",
      glossaryDesc: "Explore key terms like AGI, N12, eviction orders, and more — all simplified.",
      switchBtn: "Français"
    },
    fr: {
      title: "Bienvenue sur CAPtenant",
      desc: "CAPtenant aide les locataires à comprendre les règles et droits locatifs en Ontario afin d’agir tôt et d’éviter des conflits inutiles.",
      tagline: "Aider les locataires à trouver leur voie — avant que les différends ne s’aggravent.",
      agiTitle: "AGI expliqué",
      agiDesc: "Comprenez les augmentations de loyer au-delà de la ligne directrice et les mesures à prendre.",
      letterTitle: "Générer des lettres",
      letterDesc: "Créez facilement des lettres officielles pour les litiges AGI, réparations, plans de paiement et plus.",
      rightsTitle: "Vos droits",
      rightsDesc: "Découvrez vos protections juridiques essentielles en tant que locataire — simplifiées.",
      // 🌍 MULTILINGUAL SCOPE: Only on Voice Assistant
      voiceTitle: "Assistant vocal",
      voiceDesc: "Posez des questions ou remplissez des formulaires — supporte l'anglais, le français, l'espagnol, l'arabe et l'ourdou.",
      glossaryTitle: "Glossaire",
      glossaryDesc: "Explorez des termes clés comme AGI, N12, avis d’expulsion et plus — expliqués simplement.",
      switchBtn: "English"
    }
  };

  const t = content[lang];

  // Helper to persist the bilingual choice in the URL for all sub-pages
  const withLang = (path) => (lang === "fr" ? `${path}?lang=fr` : path);

  // Toggle function for the strict EN/FR switcher
  const toggleLanguage = () => {
    const newLang = lang === "en" ? "fr" : "en";
    params.set("lang", newLang);
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
  };

  return (
    <div
      style={{
        padding: "1.5rem",
        maxWidth: "1000px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >

      {/* --- HEADER --- */}
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "#333", fontWeight: "800" }}>
          {t.title}
        </h1>

        <p
          style={{
            maxWidth: "750px",
            lineHeight: "1.7",
            color: "#444",
            marginBottom: "0.5rem",
            fontSize: "1.15rem"
          }}
        >
          <strong>CAPtenant</strong> {t.desc}
        </p>

        <div style={{ width: "40px", height: "3px", background: "#0d6efd", marginBottom: "0.5rem" }} />

        <p style={{ fontStyle: "italic", color: "#666", marginBottom: "2rem", fontSize: "1rem" }}>
          {t.tagline}
        </p>
      </header>

      {/* --- ACTION GRID --- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem"
        }}
      >
        <Link to={withLang("/agi")} style={cardStyle}>
          <h3 style={cardTitleStyle}>{t.agiTitle}</h3>
          <p style={cardDescStyle}>{t.agiDesc}</p>
        </Link>

        <Link to={withLang("/letters")} style={cardStyle}>
          <h3 style={cardTitleStyle}>{t.letterTitle}</h3>
          <p style={cardDescStyle}>{t.letterDesc}</p>
        </Link>

        <Link to={withLang("/rights")} style={cardStyle}>
          <h3 style={cardTitleStyle}>{t.rightsTitle}</h3>
          <p style={cardDescStyle}>{t.rightsDesc}</p>
        </Link>

        <Link to={withLang("/voice")} style={cardStyle}>
          <h3 style={cardTitleStyle}>{t.voiceTitle}</h3>
          <p style={cardDescStyle}>{t.voiceDesc}</p>
        </Link>

        <Link to={withLang("/glossary")} style={cardStyle}>
          <h3 style={cardTitleStyle}>{t.glossaryTitle}</h3>
          <p style={cardDescStyle}>{t.glossaryDesc}</p>
        </Link>
      </div>
    </div>
  );
}

/* ---- STYLES ---- */
const cardStyle = {
  padding: "1.5rem",
  background: "#ffffff",
  borderRadius: "12px",
  border: "1px solid #f0f2f5",
  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
  textDecoration: "none",
  color: "#333",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column"
};

const cardTitleStyle = {
  fontSize: "1.3rem",
  marginBottom: "0.5rem",
  color: "#0d6efd",
  fontWeight: "700"
};

const cardDescStyle = {
  fontSize: "0.95rem",
  lineHeight: "1.5",
  color: "#555",
  margin: 0
};
