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
      steps: ["Rent Details", "Case Type", "Analysis", "Recommendation", "Letter"],
      currentRent: "Current Monthly Rent ($)",
      newRent: "New Rent After AGI ($)",
      agiIncrease: "AGI % Increase",
      monthlyIncrease: "Monthly Increase",
      yearlyImpact: "Yearly Impact",
      selectCase: "Select AGI Case Type",
      analysis: "Review Case Analysis",
      docsQuestion: "Did the landlord provide receipts or documents?",
      recommendation: "CAPtenant Recommendation",
      generate: "Generate Objection Letter",
      generateDesc: "Your AGI summary will be sent to the Letter Generator for a professional response.",
      yes: "Yes",
      no: "No",
      next: "Next →",
      generateBtn: "Generate Letter →",
      legalNotice: "⚖️ Ontario Legal Notice",
      aboveGuideline: "Above guideline by",
      notPayable: "AGI portion is not payable until approved by the LTB."
    },
    fr: {
      title: "Explication AGI CAPtenant",
      steps: ["Loyer", "Type de dossier", "Analyse", "Recommandation", "Lettre"],
      currentRent: "Loyer mensuel actuel ($)",
      newRent: "Nouveau loyer après AGI ($)",
      agiIncrease: "Augmentation AGI (%)",
      monthlyIncrease: "Augmentation mensuelle",
      yearlyImpact: "Impact annuel",
      selectCase: "Sélectionnez le type de dossier AGI",
      analysis: "Analyse du dossier",
      docsQuestion: "Le propriétaire a-t-il fourni des reçus ou documents ?",
      recommendation: "Recommandation CAPtenant",
      generate: "Générer une lettre d’opposition",
      generateDesc: "Votre résumé AGI sera transmis au générateur de lettres pour une réponse professionnelle.",
      yes: "Oui",
      no: "Non",
      next: "Suivant →",
      generateBtn: "Générer la lettre →",
      legalNotice: "⚖️ Avis juridique de l'Ontario",
      aboveGuideline: "Dépasse la ligne directrice de",
      notPayable: "La portion AGI n'est pas payable avant l'approbation de la TGO."
    }
  }[lang];

  const ONTARIO_GUIDELINE_2025 = 2.5;

  const [step, setStep] = useState(1);
  const [currentRent, setCurrentRent] = useState("");
  const [newRent, setNewRent] = useState("");
  const [caseType, setCaseType] = useState("");
  const [hasDocs, setHasDocs] = useState(null);

  // --- CALCULATIONS ---
  const agiPercent = currentRent && newRent
      ? (((newRent - currentRent) / currentRent) * 100).toFixed(2)
      : "";

  const monthlyInc = currentRent && newRent ? (newRent - currentRent).toFixed(2) : "";
  const yearlyInc = monthlyInc ? (monthlyInc * 12).toFixed(2) : "";
  const isAboveGuideline = Number(agiPercent) > ONTARIO_GUIDELINE_2025;
  const abovePercent = isAboveGuideline ? (Number(agiPercent) - ONTARIO_GUIDELINE_2025).toFixed(2) : 0;

  // --- CASE TYPES (Bilingual Labels) ---
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

  const getStrength = () => {
    const selected = caseTypes.find((c) => c.en === caseType || c.fr === caseType);
    if (!selected) return "Unknown";
    if (selected.strength === "High") return hasDocs ? "Very Strong" : "Moderate (Needs Invoices)";
    if (selected.strength === "Medium") return hasDocs ? "Moderate" : "Weak";
    if (selected.strength === "Low") return "Unlikely to be approved";
    if (selected.strength === "None") return "Not Eligible";
    return "Unknown";
  };

  // --- RESTORED AUTO-POPULATE FEATURE ---
  const generateLetter = () => {
    const strength = getStrength();
    
    // Constructing a detailed summary for the AI
    const summary = lang === "fr" 
      ? `Type de dossier AGI: ${caseType}. Augmentation: ${agiPercent}%. Augmentation mensuelle: $${monthlyInc}. Documents fournis: ${hasDocs ? "Oui" : "Non"}. Force du dossier: ${strength}.`
      : `AGI Case Type: ${caseType}. Percentage: ${agiPercent}%. Monthly Increase: $${monthlyInc}. Documentation: ${hasDocs ? "Yes" : "No"}. Case Strength: ${strength}.`;

    const queryParams = new URLSearchParams({
      from: "agi",
      lang: lang,
      agiSummary: summary,
      agiPercent: agiPercent,
      aboveGuideline: abovePercent,
      currentRent: currentRent,
      newRent: newRent,
      agiCase: caseType,
      agiTone: (strength.includes("Weak") || strength.includes("Unlikely")) ? "firm" : "professional"
    });

    navigate(`/letters?${queryParams.toString()}`);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "auto", fontFamily: 'sans-serif' }}>
      <h1 style={{ color: "#333", borderBottom: "2px solid #4d97ff", paddingBottom: "10px" }}>{t.title}</h1>

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
            <input style={inputStyle} type="number" value={currentRent} onChange={(e) => setCurrentRent(e.target.value)} placeholder="0.00" />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={labelStyle}>{t.newRent}</label>
            <input style={inputStyle} type="number" value={newRent} onChange={(e) => setNewRent(e.target.value)} placeholder="0.00" />
          </div>

          {agiPercent && (
            <div style={calcBox}>
              <strong>{t.agiIncrease}:</strong> {agiPercent}%<br />
              <strong>{t.monthlyIncrease}:</strong> ${monthlyInc}<br />
              <strong>{t.yearlyImpact}:</strong> ${yearlyInc}
            </div>
          )}

          {isAboveGuideline && (
            <div style={legalBox}>
              <strong>{t.legalNotice}</strong>
              <p style={{ margin: "5px 0" }}>• {t.aboveGuideline} {abovePercent}%</p>
              <p style={{ margin: "5px 0" }}>• {t.notPayable}</p>
            </div>
          )}

          <button style={btnStyle} onClick={() => setStep(2)} disabled={!agiPercent}>{t.next}</button>
        </StepCard>
      )}

      {/* STEP 2: CASE TYPE */}
      {step === 2 && (
        <StepCard>
          <h2>{t.selectCase}</h2>
          <select style={inputStyle} value={caseType} onChange={(e) => setCaseType(e.target.value)}>
            <option value="">-- {t.selectCase} --</option>
            {caseTypes.map((c) => (
              <option key={c.en} value={lang === "fr" ? c.fr : c.en}>
                {lang === "fr" ? c.fr : c.en}
              </option>
            ))}
          </select>
          <button style={btnStyle} onClick={() => setStep(3)} disabled={!caseType}>{t.next}</button>
        </StepCard>
      )}

      {/* STEP 3: DOCUMENTATION */}
      {step === 3 && (
        <StepCard>
          <h2>{t.analysis}</h2>
          <p style={{ fontSize: "1.1rem" }}>{t.docsQuestion}</p>
          <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
            <button style={hasDocs === true ? activeToggle : inactiveToggle} onClick={() => setHasDocs(true)}>{t.yes}</button>
            <button style={hasDocs === false ? activeToggle : inactiveToggle} onClick={() => setHasDocs(false)}>{t.no}</button>
          </div>
          <button style={btnStyle} onClick={() => setStep(4)} disabled={hasDocs === null}>{t.next}</button>
        </StepCard>
      )}

      {/* STEP 4: RECOMMENDATION */}
      {step === 4 && (
        <StepCard>
          <h2>{t.recommendation}</h2>
          <div style={{ padding: "20px", background: "#f0f7ff", borderRadius: "8px", border: "1px solid #b6d4fe", fontSize: "1.2rem" }}>
            <strong>Result:</strong> {getStrength()}
          </div>
          <button style={btnStyle} onClick={() => setStep(5)}>{t.next}</button>
        </StepCard>
      )}

      {/* STEP 5: FINAL GENERATION */}
      {step === 5 && (
        <StepCard>
          <h2>{t.generate}</h2>
          <p>{t.generateDesc}</p>
          <button style={{ ...btnStyle, background: "#28a745" }} onClick={generateLetter}>{t.generateBtn}</button>
        </StepCard>
      )}
    </div>
  );
}

// --- STYLES ---
const StepCard = ({ children }) => (
  <div style={{ background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", border: "1px solid #eee" }}>
    {children}
  </div>
);

const labelStyle = { display: "block", marginBottom: "8px", fontWeight: "bold", color: "#555" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px", boxSizing: "border-box" };
const btnStyle = { marginTop: "20px", padding: "12px 24px", background: "#4d97ff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" };
const calcBox = { marginTop: "20px", padding: "15px", background: "#f8f9fa", borderRadius: "8px", lineHeight: "1.6" };
const legalBox = { marginTop: "15px", padding: "15px", background: "#fff3cd", border: "1px solid #ffeeba", borderRadius: "8px", color: "#856404", fontSize: "14px" };
const activeToggle = { flex: 1, padding: "12px", background: "#4d97ff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" };
const inactiveToggle = { flex: 1, padding: "12px", background: "#e9ecef", color: "#333", border: "none", borderRadius: "8px", cursor: "pointer" };