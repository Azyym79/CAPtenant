import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AGIExplainer() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const lang = params.get("lang") === "fr" ? "fr" : "en";

  const t = {
    en: {
      title: "CAPtenant AGI Explainer",
      steps: ["Rent Details", "Case Type", "Analysis", "Assessment", "Letter"],

      // Informational framing (no “legal” wording)
      infoNoticeTitle: "⚠️ Important Notice (Informational Only)",
      infoNoticeBody:
        "This tool provides general information and estimates related to Above-Guideline Rent Increases (AGI). It does not make decisions or determinations. Only the Landlord and Tenant Board (LTB) can approve or deny an AGI. For advice tailored to your situation, consider consulting an authorized professional or official sources.",
      languageAuthority:
        "CAPtenant supports additional languages for input accessibility. English and French are the primary languages used for the app’s tenant-rights content.",

      currentRent: "Current Monthly Rent ($)",
      newRent: "New Rent After AGI ($)",

      agiIncrease: "Estimated % Increase",
      monthlyIncrease: "Estimated Monthly Increase",
      yearlyImpact: "Estimated Yearly Impact",

      selectCase: "Select AGI Case Type (General Category)",
      analysis: "Review Case Information",
      docsQuestion: "Did the landlord provide receipts or supporting documents?",

<div className="assessment-card">
  <h3>
    {lang === "fr"
      ? "Résumé des signaux réglementaires (Information seulement)"
      : "Regulatory Signal Summary (Informational Only)"}
  </h3>

  <div className="assessment-result">
    <strong>
      {lang === "fr"
        ? "Signaux détectés :"
        : "Detected signals:"}
    </strong>

    <span style={{ marginLeft: "6px" }}>
      {lang === "fr"
        ? "Plusieurs indicateurs réglementaires semblent correspondre aux critères généraux d’admissibilité à une AGI, selon les informations fournies."
        : "Multiple regulatory indicators appear to align with common AGI eligibility criteria based on the information provided."}
    </span>
  </div>

  <p className="assessment-disclaimer" style={{ marginTop: "0.75rem", fontSize: "0.9rem", color: "#555" }}>
    {lang === "fr"
      ? "Ce résumé est fourni à titre informatif uniquement. Il ne constitue pas un avis juridique, une prédiction ou une décision. Seul le Tribunal de la location immobilière (TLI) peut évaluer et approuver une demande d’AGI."
      : "This summary is informational only. It does not constitute legal advice, a prediction, or a determination. Only the Landlord and Tenant Board (LTB) can assess and approve an AGI application."}
  </p>
</div>

      generate: "Generate Objection Letter",
      generateDesc:
        "Your AGI summary will be sent to the Letter Generator to help draft a structured response. You remain responsible for verifying details and choosing next steps.",
      yes: "Yes",
      no: "No",
      next: "Next →",
      generateBtn: "Generate Letter →",

      // Rename section to avoid “legal”
      ontarioContext: "📌 Ontario Context (General)",
      aboveGuideline: "Estimated above guideline by",
      notPayable:
        "In Ontario, the AGI portion is generally not collectible unless approved by the LTB. For your situation, verify with official sources or an authorized professional."
    },
    fr: {
      title: "Explication AGI CAPtenant",
      steps: ["Loyer", "Type de dossier", "Analyse", "Évaluation", "Lettre"],

      infoNoticeTitle: "⚠️ Avis important (informatif seulement)",
      infoNoticeBody:
        "Cet outil fournit des informations générales et des estimations concernant les augmentations au-delà de la ligne directrice (AGI). Il ne rend pas de décision. Seule la Commission de la location immobilière (CLI/TGO) peut approuver ou refuser une AGI. Pour des conseils adaptés à votre situation, consultez des sources officielles ou un professionnel autorisé.",
      languageAuthority:
        "CAPtenant offre d’autres langues pour faciliter la saisie. L’anglais et le français sont les langues principales pour le contenu sur les droits des locataires.",

      currentRent: "Loyer mensuel actuel ($)",
      newRent: "Nouveau loyer après AGI ($)",

      agiIncrease: "Augmentation estimée (%)",
      monthlyIncrease: "Augmentation mensuelle estimée",
      yearlyImpact: "Impact annuel estimé",

      selectCase: "Sélectionnez le type de dossier AGI (catégorie générale)",
      analysis: "Analyse des informations",
      docsQuestion: "Le propriétaire a-t-il fourni des reçus ou documents justificatifs ?",

recommendation: "Résumé des signaux réglementaires (Information seulement)",
resultLabel: "Signaux détectés :",


      generate: "Générer une lettre d’opposition",
      generateDesc:
        "Votre résumé AGI sera transmis au générateur de lettres afin d’aider à rédiger une réponse structurée. Vous demeurez responsable de vérifier les détails et de choisir les prochaines étapes.",
      yes: "Oui",
      no: "Non",
      next: "Suivant →",
      generateBtn: "Générer la lettre →",

      ontarioContext: "📌 Contexte en Ontario (général)",
      aboveGuideline: "Dépassement estimé de la ligne directrice de",
      notPayable:
        "En Ontario, la portion AGI n’est généralement pas exigible sans l’approbation de la CLI/TGO. Pour votre situation, vérifiez via des sources officielles ou un professionnel autorisé."
    }
  }[lang];

  const ONTARIO_GUIDELINE_2025 = 2.5;

  const [step, setStep] = useState(1);
  const [currentRent, setCurrentRent] = useState("");
  const [newRent, setNewRent] = useState("");
  const [caseType, setCaseType] = useState("");
  const [hasDocs, setHasDocs] = useState(null);

  // --- CALCULATIONS (UNCHANGED) ---
  const agiPercent =
    currentRent && newRent
      ? (((newRent - currentRent) / currentRent) * 100).toFixed(2)
      : "";

  const monthlyInc =
    currentRent && newRent ? (newRent - currentRent).toFixed(2) : "";
  const yearlyInc = monthlyInc ? (monthlyInc * 12).toFixed(2) : "";

  const isAboveGuideline = Number(agiPercent) > ONTARIO_GUIDELINE_2025;
  const abovePercent = isAboveGuideline
    ? (Number(agiPercent) - ONTARIO_GUIDELINE_2025).toFixed(2)
    : 0;

  // --- CASE TYPES (UNCHANGED DATA + FLOW) ---
  const caseTypes = [
    { en: "Elevator Modernization", fr: "Modernisation des ascenseurs", strength: "High" },
    { en: "Roof Replacement", fr: "Remplacement de la toiture", strength: "High" },
    { en: "Boiler / HVAC Replacement", fr: "Remplacement chaudière/CVC", strength: "High" },
    { en: "Electrical Upgrade", fr: "Mise à niveau électrique", strength: "Medium" },
    { en: "Plumbing Replacement", fr: "Remplacement de la plomberie", strength: "Medium" },
    { en: "Fire Safety System", fr: "Système de sécurité incendie", strength: "High" },
    { en: "Structural Repairs", fr: "Réparations structurelles", strength: "High" },
    { en: "Cosmetic Upgrades", fr: "Améliorations esthétiques", strength: "Low" },
    { en: "Routine Maintenance", fr: "Entretien de routine", strength: "Low" },
    { en: "Tenant-Caused Damage", fr: "Dommages causés par le locataire", strength: "None" }
  ];

  // Softened wording (still returns a string used later)
  const getStrength = () => {
    const selected = caseTypes.find((c) => c.en === caseType || c.fr === caseType);
    if (!selected) return lang === "fr" ? "Inconnu" : "Unknown";

    if (selected.strength === "High")
      return hasDocs
        ? (lang === "fr"
            ? "Indicativement fort (avec justificatifs)"
            : "Indicatively strong (with documentation)")
        : (lang === "fr"
            ? "Potentiellement fort (documents requis)"
            : "Potentially strong (documentation needed)");

    if (selected.strength === "Medium")
      return hasDocs
        ? (lang === "fr" ? "Modéré" : "Moderate")
        : (lang === "fr"
            ? "Potentiellement faible (documents requis)"
            : "Potentially weak (documentation needed)");

    if (selected.strength === "Low")
      return lang === "fr" ? "Généralement peu probable" : "Generally unlikely";

    if (selected.strength === "None")
      return lang === "fr" ? "Généralement non admissible" : "Generally not eligible";

    return lang === "fr" ? "Inconnu" : "Unknown";
  };

  // --- AUTO-POPULATE TO LETTER GENERATOR (UNCHANGED FLOW) ---
  const generateLetter = () => {
    const strength = getStrength();

    const summary =
      lang === "fr"
        ? `Type de dossier AGI (catégorie): ${caseType}. Augmentation estimée: ${agiPercent}%. Augmentation mensuelle estimée: $${monthlyInc}. Documents fournis: ${
            hasDocs ? "Oui" : "Non"
          }. Évaluation indicative: ${strength}.`
        : `AGI case type (category): ${caseType}. Estimated increase: ${agiPercent}%. Estimated monthly increase: $${monthlyInc}. Documentation provided: ${
            hasDocs ? "Yes" : "No"
          }. Indicative assessment: ${strength}.`;

    const tone =
      strength.toLowerCase().includes("faible") ||
      strength.toLowerCase().includes("weak") ||
      strength.toLowerCase().includes("peu probable") ||
      strength.toLowerCase().includes("unlikely")
        ? "firm"
        : "professional";

    const queryParams = new URLSearchParams({
      from: "agi",
      lang: lang,
      agiSummary: summary,
      agiPercent: agiPercent,
      aboveGuideline: abovePercent,
      currentRent: currentRent,
      newRent: newRent,
      agiCase: caseType,
      agiTone: tone
    });

    navigate(`/letters?${queryParams.toString()}`);
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "900px",
        margin: "auto",
        fontFamily: "sans-serif"
      }}
    >
      <h1
        style={{
          color: "#333",
          borderBottom: "2px solid #4d97ff",
          paddingBottom: "10px"
        }}
      >
        {t.title}
      </h1>

      {/* Informational notice (kept, but no “legal” wording) */}
      <div
        style={{
          marginTop: "1rem",
          marginBottom: "2rem",
          background: "#f8f9fa",
          border: "1px solid #e9ecef",
          borderLeft: "6px solid #ffc107",
          borderRadius: "10px",
          padding: "14px 16px",
          color: "#444",
          lineHeight: "1.5"
        }}
      >
        <div style={{ fontWeight: "800", marginBottom: "6px" }}>{t.infoNoticeTitle}</div>
        <div style={{ fontSize: "0.95rem" }}>{t.infoNoticeBody}</div>
        <div style={{ marginTop: "8px", fontSize: "0.9rem", color: "#666" }}>
          {t.languageAuthority}
        </div>
      </div>

      {/* STEP PROGRESS BAR */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "2rem", flexWrap: "wrap" }}>
        {t.steps.map((label, i) => (
          <div
            key={i}
            style={{
              padding: "10px 15px",
              borderRadius: "20px",
              fontSize: "14px",
              background: step === i + 1 ? "#4d97ff" : "#dce7ff",
              color: step === i + 1 ? "white" : "#333",
              cursor: step > i + 1 ? "pointer" : "default"
            }}
            onClick={() => step > i + 1 && setStep(i + 1)}
          >
            {i + 1}. {label}
          </div>
        ))}
      </div>

      {/* STEP 1: RENT DETAILS */}
      {step === 1 && (
        <StepCard>
          <div style={{ marginBottom: "15px" }}>
            <label style={labelStyle}>{t.currentRent}</label>
            <input
              style={inputStyle}
              type="number"
              value={currentRent}
              onChange={(e) => setCurrentRent(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={labelStyle}>{t.newRent}</label>
            <input
              style={inputStyle}
              type="number"
              value={newRent}
              onChange={(e) => setNewRent(e.target.value)}
              placeholder="0.00"
            />
          </div>

          {agiPercent && (
            <div style={calcBox}>
              <strong>{t.agiIncrease}:</strong> {agiPercent}%
              <br />
              <strong>{t.monthlyIncrease}:</strong> ${monthlyInc}
              <br />
              <strong>{t.yearlyImpact}:</strong> ${yearlyInc}
              <div style={{ marginTop: "10px", fontSize: "0.9rem", color: "#6c757d" }}>
                {lang === "fr"
                  ? "Ces calculs sont des estimations basées sur les chiffres saisis."
                  : "These calculations are estimates based on the numbers you entered."}
              </div>
            </div>
          )}

          {isAboveGuideline && (
            <div style={contextBox}>
              <strong>{t.ontarioContext}</strong>
              <p style={{ margin: "5px 0" }}>
                • {t.aboveGuideline} {abovePercent}%
              </p>
              <p style={{ margin: "5px 0" }}>• {t.notPayable}</p>
            </div>
          )}

          <button style={btnStyle} onClick={() => setStep(2)} disabled={!agiPercent}>
            {t.next}
          </button>
        </StepCard>
      )}

      {/* STEP 2: CASE TYPE */}
      {step === 2 && (
        <StepCard>
          <h2>{t.selectCase}</h2>
          <select
            style={inputStyle}
            value={caseType}
            onChange={(e) => setCaseType(e.target.value)}
          >
            <option value="">-- {t.selectCase} --</option>
            {caseTypes.map((c) => (
              <option key={c.en} value={lang === "fr" ? c.fr : c.en}>
                {lang === "fr" ? c.fr : c.en}
              </option>
            ))}
          </select>

          <button style={btnStyle} onClick={() => setStep(3)} disabled={!caseType}>
            {t.next}
          </button>
        </StepCard>
      )}

      {/* STEP 3: DOCUMENTATION */}
      {step === 3 && (
        <StepCard>
          <h2>{t.analysis}</h2>
          <p style={{ fontSize: "1.1rem" }}>{t.docsQuestion}</p>

          <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
            <button
              style={hasDocs === true ? activeToggle : inactiveToggle}
              onClick={() => setHasDocs(true)}
            >
              {t.yes}
            </button>
            <button
              style={hasDocs === false ? activeToggle : inactiveToggle}
              onClick={() => setHasDocs(false)}
            >
              {t.no}
            </button>
          </div>

          <button style={btnStyle} onClick={() => setStep(4)} disabled={hasDocs === null}>
            {t.next}
          </button>
        </StepCard>
      )}

      {/* STEP 4: ASSESSMENT */}
      {step === 4 && (
        <StepCard>
          <h2>{t.recommendation}</h2>

          <div
            style={{
              padding: "20px",
              background: "#f0f7ff",
              borderRadius: "8px",
              border: "1px solid #b6d4fe",
              fontSize: "1.2rem"
            }}
          >
            <strong>{t.resultLabel}</strong> {getStrength()}
            <div style={{ marginTop: "10px", fontSize: "0.95rem", color: "#6c757d" }}>
              {lang === "fr"
                ? "Cette évaluation est indicative et dépend des faits et des documents. La décision finale appartient à la CLI/TGO."
                : "This assessment is indicative and depends on facts and documentation. The final decision rests with the LTB."}
            </div>
          </div>

          <button style={btnStyle} onClick={() => setStep(5)}>
            {t.next}
          </button>
        </StepCard>
      )}

      {/* STEP 5: FINAL GENERATION */}
      {step === 5 && (
        <StepCard>
          <h2>{t.generate}</h2>
          <p>{t.generateDesc}</p>
          <button style={{ ...btnStyle, background: "#28a745" }} onClick={generateLetter}>
            {t.generateBtn}
          </button>
        </StepCard>
      )}
    </div>
  );
}

// --- STYLES (UNCHANGED) ---
const StepCard = ({ children }) => (
  <div
    style={{
      background: "white",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      border: "1px solid #eee"
    }}
  >
    {children}
  </div>
);

const labelStyle = { display: "block", marginBottom: "8px", fontWeight: "bold", color: "#555" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px", boxSizing: "border-box" };
const btnStyle = { marginTop: "20px", padding: "12px 24px", background: "#4d97ff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" };
const calcBox = { marginTop: "20px", padding: "15px", background: "#f8f9fa", borderRadius: "8px", lineHeight: "1.6" };

// renamed var to avoid “legal” naming, but style kept
const contextBox = { marginTop: "15px", padding: "15px", background: "#fff3cd", border: "1px solid #ffeeba", borderRadius: "8px", color: "#856404", fontSize: "14px" };

const activeToggle = { flex: 1, padding: "12px", background: "#4d97ff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" };
const inactiveToggle = { flex: 1, padding: "12px", background: "#e9ecef", color: "#333", border: "none", borderRadius: "8px", cursor: "pointer" };
