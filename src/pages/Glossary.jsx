import React, { useState, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";

/* ======================================================
   MASTER GLOSSARY (EN-CA / FR-CA)
   Educational definitions — not legal advice
====================================================== */
const TERMS = [
  {
    term: { en: "Abatement of Rent", fr: "Abattement de loyer" },
    definition: {
      en: "A monetary award or reduction in rent given to a tenant when a landlord has failed to meet their maintenance or legal obligations.",
      fr: "Une compensation monétaire ou une réduction de loyer accordée au locataire lorsque le propriétaire ne respecte pas ses obligations d'entretien ou légales."
    }
  },
  {
    term: { en: "Adjudicator", fr: "Arbitre" },
    definition: {
      en: "The LTB official who listens to evidence during a hearing and makes the final legal decision (Order).",
      fr: "Le fonctionnaire de la CLI qui écoute les preuves lors d'une audience et rend la décision juridique finale (Ordonnance)."
    }
  },
  {
    term: { en: "Affidavit", fr: "Affidavit" },
    definition: {
      en: "A written statement confirmed by oath or affirmation, used as evidence in LTB hearings.",
      fr: "Une déclaration écrite confirmée sous serment ou par affirmation solennelle, utilisée comme preuve lors des audiences de la CLI."
    }
  },
  {
    term: { en: "AGI (Above Guideline Increase)", fr: "AGI (augmentation au-delà de la ligne directrice)" },
    definition: {
      en: "A rent increase above Ontario’s annual guideline. Landlords must apply to the Landlord and Tenant Board (LTB) and justify extraordinary costs.",
      fr: "Une augmentation de loyer dépassant la ligne directrice annuelle en Ontario. Le propriétaire doit en faire la demande à la Commission de la location immobilière (CLI)."
    }
  },
  {
    term: { en: "Arrears", fr: "Arriérés" },
    definition: {
      en: "Unpaid rent that is past due.",
      fr: "Loyer impayé qui est en retard."
    }
  },
  {
    term: { en: "Bad Faith", fr: "Mauvaise foi" },
    definition: {
      en: "When a landlord issues a notice (such as an N12 for personal use) without an honest intention to follow through, often to evict a tenant and re-rent at a higher price.",
      fr: "Lorsqu'un propriétaire émet un avis (comme un N12 pour usage personnel) sans intention honnête de l'appliquer, souvent pour expulser un locataire et relouer à un loyer plus élevé."
    }
  },
  {
    term: { en: "Compensation", fr: "Indemnisation" },
    definition: {
      en: "Payment required by law in certain eviction cases (e.g., one month's rent for N12 notices) or awarded by the LTB for damages.",
      fr: "Paiement exigé par la loi dans certains cas d'expulsion (ex. un mois de loyer pour un avis N12) ou accordé par la CLI à titre de dommages-intérêts."
    }
  },
  {
    term: { en: "Eviction Order", fr: "Ordonnance d'expulsion" },
    definition: {
      en: "A legal document issued by an LTB adjudicator that officially ends a tenancy and authorizes the Sheriff to enforce eviction.",
      fr: "Document juridique émis par un arbitre de la CLI qui met officiellement fin à la location et autorise le shérif à procéder à l'expulsion."
    }
  },
  {
    term: { en: "Form L5 (AGI Application)", fr: "Formulaire L5 (demande d’augmentation au-delà de la ligne directrice)" },
    definition: {
      en: "The official Landlord and Tenant Board application a landlord must file to request a rent increase above the annual guideline.",
      fr: "Demande officielle déposée par le propriétaire auprès de la Commission de la location immobilière (CLI) afin d'obtenir l'autorisation d'une augmentation de loyer supérieure à la ligne directrice annuelle."
    }
  },
  {
    term: { en: "Form N1 (Notice of Rent Increase)", fr: "Formulaire N1 (avis d’augmentation de loyer)" },
    definition: {
      en: "The standard form used for guideline rent increases. It must be served at least 90 days in advance.",
      fr: "Formulaire standard utilisé pour les augmentations de loyer conformes à la ligne directrice. Il doit être remis au moins 90 jours à l'avance."
    }
  },
  {
    term: { en: "Form N4 (Notice for Non-Payment)", fr: "Formulaire N4 (avis de non-paiement)" },
    definition: {
      en: "A notice issued when rent has not been paid. Tenants generally have 14 days to pay the arrears and void the notice.",
      fr: "Avis émis lorsque le loyer n’a pas été payé. Le locataire dispose généralement de 14 jours pour payer les arriérés et annuler l’avis."
    }
  },
  {
    term: { en: "Form N12 (Personal Use)", fr: "Formulaire N12 (usage personnel)" },
    definition: {
      en: "A notice stating that the landlord or an immediate family member intends to occupy the rental unit.",
      fr: "Avis indiquant que le propriétaire ou un membre de sa famille immédiate a l'intention d'occuper le logement."
    }
  },
  {
    term: { en: "Form T2 (Tenant Rights Application)", fr: "Formulaire T2 (demande concernant les droits du locataire)" },
    definition: {
      en: "An application tenants may file if a landlord has harassed or interfered with reasonable enjoyment.",
      fr: "Demande déposée par un locataire si le propriétaire a harcelé ou entravé la jouissance raisonnable."
    }
  },
  {
    term: { en: "Form T6 (Maintenance Application)", fr: "Formulaire T6 (demande relative à l’entretien)" },
    definition: {
      en: "An application filed by tenants when a landlord fails to carry out required repairs or maintenance.",
      fr: "Demande déposée par un locataire lorsque le propriétaire ne respecte pas ses obligations d’entretien."
    }
  },
  {
    term: { en: "LTB (Landlord and Tenant Board)", fr: "CLI (Commission de la location immobilière)" },
    definition: {
      en: "The independent administrative tribunal that resolves residential tenancy disputes in Ontario.",
      fr: "Tribunal administratif indépendant chargé de régler les différends entre propriétaires et locataires en Ontario."
    }
  },
  {
    term: { en: "RTA (Residential Tenancies Act)", fr: "Loi sur la location à usage d’habitation" },
    definition: {
      en: "Ontario legislation governing the rights and responsibilities of landlords and tenants.",
      fr: "Loi de l’Ontario encadrant les droits et obligations des propriétaires et des locataires."
    }
  }
];

/* ======================================================
   HELPERS
====================================================== */
const groupTerms = (terms, lang) => {
  const groups = {};
  terms.forEach(item => {
    const letter = item.term[lang].charAt(0).toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(item);
  });
  return groups;
};

/* ======================================================
   COMPONENT
====================================================== */
export default function Glossary() {
  const location = useLocation();
  const lang = new URLSearchParams(location.search).get("lang") === "fr" ? "fr" : "en";

  const [search, setSearch] = useState("");
  const sectionRefs = useRef({});

  const filteredTerms = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return TERMS;

    return TERMS.filter(t =>
      t.term.en.toLowerCase().includes(s) ||
      t.term.fr.toLowerCase().includes(s) ||
      t.definition.en.toLowerCase().includes(s) ||
      t.definition.fr.toLowerCase().includes(s)
    );
  }, [search]);

  const grouped = useMemo(() => groupTerms(filteredTerms, lang), [filteredTerms, lang]);

  const highlight = text => {
    if (!search) return text;
    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return (
      <>
        {parts.map((p, i) =>
          p.toLowerCase() === search.toLowerCase()
            ? <mark key={i}>{p}</mark>
            : <span key={i}>{p}</span>
        )}
      </>
    );
  };

  const scrollTo = letter => {
    sectionRefs.current[letter]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>
        📘 {lang === "fr" ? "Glossaire CAPtenant" : "CAPtenant Glossary"}
      </h1>

      {/* DISCLAIMER */}
      <div
        style={{
          margin: "1rem auto 1.5rem",
          background: "#f8f9fa",
          border: "1px solid #e9ecef",
          borderLeft: "6px solid #ffc107",
          borderRadius: "10px",
          padding: "14px 16px",
          color: "#444",
          lineHeight: "1.5",
          fontSize: "0.95rem"
        }}
      >
        <strong>
          {lang === "fr"
            ? "Définitions informatives — pas un avis juridique"
            : "Informational definitions — not legal advice"}
        </strong>
        <p style={{ marginTop: "6px" }}>
          {lang === "fr"
            ? "Ce glossaire fournit des définitions générales de termes liés au droit locatif en Ontario. Il ne remplace pas les textes de loi officiels ni un avis juridique."
            : "This glossary provides general definitions of Ontario tenant-law terms. It does not replace official legislation or legal advice."}
        </p>
      </div>

      <input
        type="text"
        placeholder={lang === "fr" ? "Rechercher un terme…" : "Search terms…"}
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          margin: "1.5rem 0",
          borderRadius: "8px",
          border: "1px solid #0d6efd",
          fontSize: "16px",
          boxSizing: "border-box"
        }}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "2rem" }}>
        {Object.keys(grouped).sort().map(letter => (
          <button key={letter} onClick={() => scrollTo(letter)} style={azButton}>
            {letter}
          </button>
        ))}
      </div>

      {Object.keys(grouped).sort().map(letter => (
        <div key={letter} ref={el => (sectionRefs.current[letter] = el)} style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ borderBottom: "3px solid #0d6efd", color: "#0d6efd", paddingBottom: "5px" }}>
            {letter}
          </h2>

          {grouped[letter].map((item, i) => (
            <details key={i} style={card}>
              <summary style={{ fontWeight: "bold", fontSize: "18px", cursor: "pointer", color: "#333" }}>
                {highlight(item.term[lang])}
              </summary>
              <div style={{ marginTop: "12px", paddingLeft: "10px", borderLeft: "4px solid #dce7ff", lineHeight: "1.6", color: "#444" }}>
                {highlight(item.definition[lang])}
              </div>
            </details>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ======================================================
   STYLES
====================================================== */
const azButton = {
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid #0d6efd",
  background: "#eef4ff",
  color: "#0d6efd",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.2s"
};

const card = {
  background: "#fff",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "12px",
  boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  border: "1px solid #f0f0f0"
};
