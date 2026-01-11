import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function About() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // 🇨🇦 Language lock: EN / FR only
  const lang = params.get("lang") === "fr" ? "fr" : "en";

  const t = {
    en: {
      title: "About CAPtenant",
      intro:
        "CAPtenant is an informational platform designed to help Ontario tenants better understand rental rules, common processes, and available options — before disputes escalate.",

      sectionWhatIs: "What CAPtenant Is",
      whatIsPoints: [
        "Educational explanations of common tenant-related topics in Ontario",
        "Plain-language summaries of rental notices, forms, and processes",
        "Tools that help organize information and draft structured correspondence",
        "Accessibility features such as voice input and spoken output"
      ],

      sectionWhatIsNot: "What CAPtenant Is Not",
      whatIsNotPoints: [
        "CAPtenant does not provide legal advice",
        "CAPtenant does not interpret the law for individual cases",
        "CAPtenant does not determine outcomes or make decisions",
        "CAPtenant does not replace the Landlord and Tenant Board (LTB) or licensed professionals"
      ],

      responsibility:
        "Any decisions, actions, or next steps remain the responsibility of the user.",

      sectionLanguage: "Language & Accessibility",
      languageText: [
        "Authoritative informational content is provided in English and French",
        "Additional languages may be supported for input and accessibility purposes only",
        "Generated summaries and letters are produced in English or French"
      ],

      sectionAI: "Use of AI Tools",
      aiText:
        "Some CAPtenant features use AI to summarize text, reorganize information, and generate draft letters based on user-provided input. AI-generated content is informational and non-authoritative, intended to support understanding rather than decision-making.",

      sectionScope: "Scope & Jurisdiction",
      scopeText:
        "CAPtenant focuses on Ontario residential tenancies. Rules, processes, and terminology may differ in other jurisdictions. For official determinations or binding decisions, users should consult the Ontario Landlord and Tenant Board, official government resources, or a licensed professional.",

      sectionGoal: "Our Goal",
      goalText:
        "CAPtenant’s goal is to help tenants feel more informed, prepared, and confident — without giving advice or replacing official processes.",

      footerNote:
        "CAPtenant provides general information only. Nothing on this platform constitutes advice or a professional service.",

      backLink: "← Back to Home"
    },

    fr: {
      title: "À propos de CAPtenant",
      intro:
        "CAPtenant est une plateforme informative conçue pour aider les locataires de l’Ontario à mieux comprendre les règles locatives, les processus courants et les options disponibles — avant que les différends ne s’aggravent.",

      sectionWhatIs: "Ce que CAPtenant est",
      whatIsPoints: [
        "Des explications éducatives sur des sujets locatifs courants en Ontario",
        "Des résumés en langage clair des avis, formulaires et processus",
        "Des outils pour organiser l’information et rédiger des communications structurées",
        "Des fonctionnalités d’accessibilité, dont la saisie vocale et la lecture audio"
      ],

      sectionWhatIsNot: "Ce que CAPtenant n’est pas",
      whatIsNotPoints: [
        "CAPtenant ne fournit pas d’avis juridique",
        "CAPtenant n’interprète pas la loi pour des situations individuelles",
        "CAPtenant ne rend pas de décisions ni de conclusions",
        "CAPtenant ne remplace pas la Commission de la location immobilière ni un professionnel autorisé"
      ],

      responsibility:
        "Toute décision, action ou démarche demeure sous la responsabilité de l’utilisateur.",

      sectionLanguage: "Langue et accessibilité",
      languageText: [
        "Le contenu informatif faisant autorité est fourni en anglais et en français",
        "D’autres langues peuvent être offertes uniquement pour la saisie et l’accessibilité",
        "Les résumés et lettres générés sont fournis en anglais ou en français"
      ],

      sectionAI: "Utilisation des outils d’IA",
      aiText:
        "Certaines fonctionnalités de CAPtenant utilisent l’IA pour résumer des textes, organiser l’information et générer des brouillons de lettres à partir des données fournies par l’utilisateur. Le contenu généré est informatif, non contraignant et destiné à soutenir la compréhension.",

      sectionScope: "Portée et compétence",
      scopeText:
        "CAPtenant se concentre sur la location résidentielle en Ontario. Les règles, processus et termes peuvent varier ailleurs. Pour toute décision officielle ou contraignante, consultez la Commission de la location immobilière, des sources gouvernementales ou un professionnel autorisé.",

      sectionGoal: "Notre objectif",
      goalText:
        "L’objectif de CAPtenant est d’aider les locataires à se sentir mieux informés, préparés et confiants — sans fournir d’avis ni remplacer les processus officiels.",

      footerNote:
        "CAPtenant fournit des informations générales uniquement. Rien sur cette plateforme ne constitue un avis ou un service professionnel.",

      backLink: "← Retour à l’accueil"
    }
  }[lang];

  const homeHref = lang === "fr" ? "/?lang=fr" : "/";

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "3rem auto",
        padding: "2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        lineHeight: "1.7"
      }}
    >
      <h1 style={{ marginBottom: "1rem" }}>{t.title}</h1>
      <p style={{ color: "#555", fontSize: "1.1rem" }}>{t.intro}</p>

      <Section title={t.sectionWhatIs}>
        <ul>{t.whatIsPoints.map((p, i) => <li key={i}>{p}</li>)}</ul>
      </Section>

      <Section title={t.sectionWhatIsNot}>
        <ul>{t.whatIsNotPoints.map((p, i) => <li key={i}>{p}</li>)}</ul>
      </Section>

      <p style={{ fontStyle: "italic", color: "#666" }}>{t.responsibility}</p>

      <Section title={t.sectionLanguage}>
        <ul>{t.languageText.map((p, i) => <li key={i}>{p}</li>)}</ul>
      </Section>

      <Section title={t.sectionAI}>
        <p>{t.aiText}</p>
      </Section>

      <Section title={t.sectionScope}>
        <p>{t.scopeText}</p>
      </Section>

      <Section title={t.sectionGoal}>
        <p><strong>{t.goalText}</strong></p>
      </Section>

      <hr style={{ margin: "2.5rem 0" }} />

      <p style={{ fontSize: "0.85rem", color: "#777", marginBottom: "1rem" }}>
        {t.footerNote}
      </p>

      {/* Subtle navigation link */}
      <Link
        to={homeHref}
        style={{
          fontSize: "0.85rem",
          color: "#0d6efd",
          textDecoration: "none",
          fontWeight: "600"
        }}
      >
        {t.backLink}
      </Link>
    </div>
  );
}

/* ---------------- HELPERS ---------------- */
function Section({ title, children }) {
  return (
    <section style={{ marginTop: "2rem" }}>
      <h2 style={{ marginBottom: "0.75rem", color: "#0d6efd" }}>{title}</h2>
      {children}
    </section>
  );
}
