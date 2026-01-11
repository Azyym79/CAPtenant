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
      desc: "CAPtenant helps tenants understand Ontario’s rental rules and rights, supporting early communication and informed decisions.",
      tagline: "Helping tenants find their way — before disputes escalate.",
      agiTitle: "AGI Explained",
      agiDesc: "Learn about Above Guideline Rent Increases and common options tenants may consider.",
      letterTitle: "Generate Letters",
      letterDesc: "Draft structured letters for AGI concerns, repair requests, payment plans, and more.",
      rightsTitle: "Tenant Rights (Info)",
      rightsDesc: "Learn about common tenant protections under Ontario law — simplified and easy to understand.",
      voiceTitle: "Voice Assistant",
      voiceDesc:
        "Describe your situation or fill in information hands-free. Supports multiple languages for convenience.",
      voiceNote:
        "All legal information and letters are generated in English or French.",
      glossaryTitle: "Glossary",
      glossaryDesc:
        "Explore commonly used rental terms like AGI, N12, eviction orders, and more — simplified.",
      switchBtn: "Français",
      legalDisclaimer:
        "CAPtenant provides general information only and does not offer legal advice."
    },
    fr: {
      title: "Bienvenue sur CAPtenant",
      desc: "CAPtenant aide les locataires à comprendre les règles et droits locatifs en Ontario, favorisant une communication précoce et des décisions éclairées.",
      tagline: "Aider les locataires à trouver leur voie — avant que les différends ne s’aggravent.",
      agiTitle: "AGI expliqué",
      agiDesc:
        "Découvrez les augmentations de loyer au-delà de la ligne directrice et les options couramment envisagées.",
      letterTitle: "Générer des lettres",
      letterDesc:
        "Rédigez des brouillons de lettres structurées pour les enjeux AGI, réparations, plans de paiement et plus.",
      rightsTitle: "Droits des locataires (Info)",
      rightsDesc:
        "Découvrez les protections locatives courantes prévues par la loi ontarienne — expliquées simplement.",
      voiceTitle: "Assistant vocal",
      voiceDesc:
        "Décrivez votre situation ou saisissez des informations mains libres. Prend en charge plusieurs langues pour plus de commodité.",
      voiceNote:
        "Toutes les informations juridiques et lettres sont générées en anglais ou en français.",
      glossaryTitle: "Glossaire",
      glossaryDesc:
        "Explorez des termes locatifs courants comme AGI, N12, avis d’expulsion et plus — simplifiés.",
      switchBtn: "English",
      legalDisclaimer:
        "CAPtenant fournit des informations générales uniquement et ne constitue pas un avis juridique."
    }
  };

  const t = content[lang];

  // Persist bilingual choice
  const withLang = (path) => (lang === "fr" ? `${path}?lang=fr` : path);

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
        <h1
          style={{
            fontSize: "2rem",
            marginBottom: "0.5rem",
            color: "#333",
            fontWeight: "800"
          }}
        >
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
          {t.desc}
        </p>

        <div
          style={{
            width: "40px",
            height: "3px",
            background: "#0d6efd",
            marginBottom: "0.5rem"
          }}
        />

        <p
          style={{
            fontStyle: "italic",
            color: "#666",
            marginBottom: "1.5rem",
            fontSize: "1rem"
          }}
        >
          {t.tagline}
        </p>

        {/* --- GLOBAL LEGAL DISCLAIMER --- */}
        <p
          style={{
            fontSize: "0.85rem",
            color: "#777",
            maxWidth: "750px"
          }}
        >
          {t.legalDisclaimer}
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
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "0.8rem",
              color: "#777"
            }}
          >
            {t.voiceNote}
          </p>
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
