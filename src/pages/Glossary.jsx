import React, { useState, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";

/* ======================================================
   MASTER GLOSSARY (EN-CA / FR-CA)
   Informational terminology reference — educational use
====================================================== */
const TERMS = [
  {
    term: { en: "Abatement of Rent", fr: "Abattement de loyer" },
    definition: {
      en: "A reduction or credit applied to rent when required standards of maintenance or obligations under Ontario rental rules are not met.",
      fr: "Une réduction ou un crédit appliqué au loyer lorsque les normes d’entretien ou les obligations prévues par les règles locatives de l’Ontario ne sont pas respectées."
    }
  },
  {
    term: { en: "Adjudicator", fr: "Arbitre" },
    definition: {
      en: "An official at the Landlord and Tenant Board (LTB) who reviews evidence during a hearing and issues a formal decision.",
      fr: "Un représentant de la Commission de la location immobilière (CLI) qui examine les preuves lors d’une audience et rend une décision formelle."
    }
  },
  {
    term: { en: "Affidavit", fr: "Affidavit" },
    definition: {
      en: "A written statement confirmed by oath or affirmation, commonly used as supporting evidence in tribunal proceedings.",
      fr: "Une déclaration écrite confirmée sous serment ou affirmation solennelle, couramment utilisée comme preuve dans les procédures devant un tribunal administratif."
    }
  },
  {
    term: { en: "AGI (Above Guideline Increase)", fr: "AGI (augmentation au-delà de la ligne directrice)" },
    definition: {
      en: "A rent increase above Ontario’s annual guideline that requires approval from the Landlord and Tenant Board based on qualifying costs.",
      fr: "Une augmentation de loyer dépassant la ligne directrice annuelle en Ontario qui nécessite l’approbation de la Commission de la location immobilière selon certains coûts admissibles."
    }
  },
  {
    term: { en: "Arrears", fr: "Arriérés" },
    definition: {
      en: "Unpaid rent that remains outstanding after the due date.",
      fr: "Loyer impayé qui demeure en souffrance après la date d’échéance."
    }
  },
  {
    term: { en: "Bad Faith", fr: "Mauvaise foi" },
    definition: {
      en: "A situation where a notice is issued without a genuine intention to follow through, often involving misuse of permitted notice types.",
      fr: "Situation où un avis est émis sans intention réelle de le respecter, impliquant souvent une utilisation abusive de certains types d’avis."
    }
  },
  {
    term: { en: "Compensation", fr: "Indemnisation" },
    definition: {
      en: "A required payment in certain notice scenarios or an amount awarded by the tribunal following a hearing.",
      fr: "Paiement exigé dans certains cas d’avis ou montant accordé par le tribunal administratif à la suite d’une audience."
    }
  },
  {
    term: { en: "Eviction Order", fr: "Ordonnance d'expulsion" },
    definition: {
      en: "A formal order issued by the Landlord and Tenant Board that ends a tenancy and may be enforced by the Sheriff.",
      fr: "Ordonnance formelle émise par la Commission de la location immobilière mettant fin à la location et pouvant être exécutée par le shérif."
    }
  },
  {
    term: { en: "Form L5 (AGI Application)", fr: "Formulaire L5 (demande d’AGI)" },
    definition: {
      en: "The official application used to request approval for a rent increase above the annual guideline.",
      fr: "Demande officielle utilisée pour solliciter l’autorisation d’une augmentation de loyer au-delà de la ligne directrice annuelle."
    }
  },
  {
    term: { en: "Form N1 (Notice of Rent Increase)", fr: "Formulaire N1 (avis d’augmentation de loyer)" },
    definition: {
      en: "A standard notice used for guideline-compliant rent increases, typically served at least 90 days in advance.",
      fr: "Avis standard utilisé pour les augmentations conformes à la ligne directrice, généralement remis au moins 90 jours à l’avance."
    }
  },
  {
    term: { en: "Form N4 (Notice for Non-Payment)", fr: "Formulaire N4 (avis de non-paiement)" },
    definition: {
      en: "A notice issued when rent has not been paid, usually allowing time for the balance to be paid before further steps.",
      fr: "Avis émis lorsque le loyer n’a pas été payé, laissant généralement un délai pour régulariser la situation."
    }
  },
  {
    term: { en: "Form N12 (Personal Use)", fr: "Formulaire N12 (usage personnel)" },
    definition: {
      en: "A notice indicating that the rental unit is intended to be occupied by the owner or an immediate family member.",
      fr: "Avis indiquant que le logement est destiné à être occupé par le propriétaire ou un membre de sa famille immédiate."
    }
  },
  {
    term: { en: "Form T2", fr: "Formulaire T2" },
    definition: {
      en: "An application used when a tenant believes their reasonable enjoyment has been interfered with.",
      fr: "Demande utilisée lorsqu’un locataire estime que sa jouissance raisonnable a été compromise."
    }
  },
  {
    term: { en: "Form T6", fr: "Formulaire T6" },
    definition: {
      en: "An application related to maintenance concerns when required repairs are not addressed.",
      fr: "Demande relative aux enjeux d’entretien lorsque les réparations requises ne sont pas effectuées."
    }
  },
  {
    term: { en: "LTB (Landlord and Tenant Board)", fr: "CLI (Commission de la location immobilière)" },
    definition: {
      en: "The administrative tribunal responsible for resolving residential tenancy matters in Ontario.",
      fr: "Tribunal administratif chargé de trancher les questions liées à la location résidentielle en Ontario."
    }
  },
  {
    term: { en: "RTA (Residential Tenancies Act)", fr: "Loi sur la location à usage d’habitation" },
    definition: {
      en: "Ontario legislation that sets out the framework governing residential tenancies.",
      fr: "Loi de l’Ontario établissant le cadre régissant les locations résidentielles."
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
            ? "Référence informative — à des fins éducatives"
            : "Informational reference — for educational purposes"}
        </strong>
        <p style={{ marginTop: "6px" }}>
          {lang === "fr"
            ? "Ce glossaire présente des définitions générales de termes utilisés en location résidentielle en Ontario. Il est fourni à titre informatif."
            : "This glossary presents general definitions of terms used in Ontario residential tenancies. It is provided for informational purposes."}
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
