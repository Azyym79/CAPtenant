import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ======================================================
   MASTER RIGHTS FAQ DATABASE (EN-CA / FR-CA)
   NOTE: Informational content only — non-exhaustive
====================================================== */
const FAQ = [
  {
    id: 1,
    category: "Rent Increases",
    question: {
      en: "What is the legal rent increase limit in Ontario?",
      fr: "Quelle est la limite légale d’augmentation de loyer en Ontario?"
    },
    answer: {
      en: "Most rental units are subject to Ontario’s annual rent increase guideline. A landlord generally cannot increase rent above the guideline without approval for an Above-Guideline Increase (AGI).",
      fr: "La plupart des logements sont assujettis à la ligne directrice annuelle d’augmentation de loyer en Ontario. En général, un propriétaire ne peut dépasser cette limite sans l’approbation d’une augmentation au-delà de la ligne directrice (AGI)."
    },
    severity: "moderate",
    urgency: "normal",
    tags: ["LTB", "RTA", "Rent Increase"]
  },
  {
    id: 2,
    category: "Rent Increases",
    question: {
      en: "What is an AGI?",
      fr: "Qu’est-ce qu’une augmentation au-delà de la ligne directrice (AGI)?"
    },
    answer: {
      en: "An Above-Guideline Increase (AGI) may allow a landlord to raise rent above the guideline due to certain costs such as major repairs or property tax increases. Tenants generally have the right to object.",
      fr: "Une augmentation au-delà de la ligne directrice (AGI) peut permettre au propriétaire d’augmenter le loyer au-delà de la limite en raison de certains coûts, comme des réparations majeures ou des hausses d’impôts fonciers. Les locataires ont généralement le droit de s’y opposer."
    },
    severity: "high",
    urgency: "normal",
    tags: ["AGI", "LTB", "Rent Increase"]
  },
  {
    id: 3,
    category: "Maintenance & Repairs",
    question: {
      en: "My landlord won’t fix something. What are my rights?",
      fr: "Mon propriétaire refuse de faire des réparations. Quels sont mes droits?"
    },
    answer: {
      en: "Landlords are generally required to maintain rental units in a good state of repair and fit for habitation. If issues are not addressed, a tenant may be able to apply to the Landlord and Tenant Board (for example, using a T6 application).",
      fr: "Le propriétaire est généralement tenu de maintenir le logement en bon état et propre à l’habitation. Si les problèmes ne sont pas réglés, le locataire peut, dans certains cas, déposer une demande auprès de la Commission de la location immobilière (par exemple, une demande T6)."
    },
    severity: "high",
    urgency: "urgent",
    tags: ["Repairs", "Safety", "RTA"]
  },
  {
    id: 4,
    category: "Evictions",
    question: {
      en: "Can my landlord evict me without notice?",
      fr: "Un propriétaire peut-il m’expulser sans préavis?"
    },
    answer: {
      en: "In Ontario, only the Landlord and Tenant Board can issue an eviction order. Notices such as N4, N12, or N13 do not usually require a tenant to leave immediately.",
      fr: "En Ontario, seule la Commission de la location immobilière peut ordonner une expulsion. Les avis comme le N4, N12 ou N13 n’exigent généralement pas un départ immédiat."
    },
    severity: "high",
    urgency: "urgent",
    tags: ["Evictions", "LTB", "RTA"]
  },
  {
    id: 5,
    category: "Privacy & Entry",
    question: {
      en: "Can my landlord enter my unit without permission?",
      fr: "Le propriétaire peut-il entrer dans mon logement sans permission?"
    },
    answer: {
      en: "Except in emergencies, landlords generally must provide at least 24 hours’ written notice stating the reason and time of entry.",
      fr: "Sauf en cas d’urgence, le propriétaire doit généralement fournir un avis écrit d’au moins 24 heures indiquant la raison et l’heure de l’entrée."
    },
    severity: "moderate",
    urgency: "normal",
    tags: ["Privacy", "Entry", "Harassment"]
  }
];

const categories = ["All", ...new Set(FAQ.map(f => f.category))];
const allTags = ["All", ...new Set(FAQ.flatMap(f => f.tags))];

/* ======================================================
   SMART DETECTION (Multilingual Keywords — Input Only)
====================================================== */
const detectToneFromIntent = (text) => {
  const t = text.toLowerCase();
  if (t.includes("evict") || t.includes("nikalna") || t.includes("desalojo") || t.includes("harass")) return "firm";
  if (t.includes("repair") || t.includes("theek") || t.includes("reparar") || t.includes("broken")) return "polite";
  return "professional";
};

export default function RightsFAQ() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // 🇨🇦 UI language locked to EN / FR
  const lang = params.get("lang") === "fr" ? "fr" : "en";

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [urgencyFilter, setUrgencyFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");

  const [aiInput, setAiInput] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  /* ---------------- FILTER SYSTEM (NO LOSS) ---------------- */
  const filtered = useMemo(() => {
    return FAQ.filter(item => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSeverity = severityFilter === "All" || item.severity === severityFilter;
      const matchesUrgency = urgencyFilter === "All" || item.urgency === urgencyFilter;
      const matchesTag = tagFilter === "All" || item.tags.includes(tagFilter);

      const textSearch = (
        item.question.en + item.question.fr +
        item.answer.en + item.answer.fr
      ).toLowerCase();

      const matchesQuery = textSearch.includes(query.toLowerCase());

      return matchesCategory && matchesSeverity && matchesUrgency && matchesTag && matchesQuery;
    });
  }, [query, selectedCategory, severityFilter, urgencyFilter, tagFilter]);

  /* ---------------- AI ASSIST (INFORMATIONAL ONLY) ---------------- */
  const askAI = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setAiAnswer("");

    try {
      const res = await fetch("/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: aiInput,
          language: params.get("lang") || "en"
        })
      });

      const data = await res.json();
      setAiAnswer(data.answer);
    } catch {
      setAiAnswer(
        lang === "fr"
          ? "Impossible de joindre l’assistant CAPtenant pour le moment."
          : "Unable to reach CAPtenant AI at the moment."
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#333", borderBottom: "2px solid #4d97ff", paddingBottom: "10px" }}>
        {lang === "fr" ? "FAQ – Droits des locataires (Ontario)" : "Tenant Rights FAQ (Ontario)"}
      </h1>

      {/* GLOBAL DISCLAIMER (NEW) */}
      <div
        style={{
          marginTop: "1rem",
          marginBottom: "1.5rem",
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
            ? "Information générale — pas un avis juridique"
            : "General information — not legal advice"}
        </strong>
        <p style={{ marginTop: "6px" }}>
          {lang === "fr"
            ? "Cette FAQ fournit des informations générales sur le droit locatif en Ontario. Elle n’est pas exhaustive et les règles peuvent changer. Pour une situation précise, consultez les sources officielles ou un professionnel autorisé."
            : "This FAQ provides general information about Ontario tenant law. It is not exhaustive and laws may change. For your specific situation, consult official sources or a licensed professional."}
        </p>
        <p style={{ marginTop: "6px", color: "#666" }}>
          {lang === "fr"
            ? "Le contenu juridique faisant autorité dans CAPtenant est fourni en anglais et en français."
            : "Authoritative legal content in CAPtenant is provided in English and French."}
        </p>
      </div>

      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        {lang === "fr"
          ? "Recherchez, filtrez ou consultez des informations générales sur vos droits de locataire en Ontario."
          : "Search, filter, or review general information about your tenant rights in Ontario."}
      </p>

      {/* SEARCH */}
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={lang === "fr" ? "Rechercher…" : "Search questions…"}
        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }}
      />

      {/* FILTERS */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", margin: "1.5rem 0" }}>
        <select style={{ padding: "8px" }} value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select style={{ padding: "8px" }} value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}>
          <option value="All">{lang === "fr" ? "Gravité" : "Severity"}</option>
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </select>
        <select style={{ padding: "8px" }} value={urgencyFilter} onChange={e => setUrgencyFilter(e.target.value)}>
          <option value="All">{lang === "fr" ? "Urgence" : "Urgency"}</option>
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
        </select>
        <select style={{ padding: "8px" }} value={tagFilter} onChange={e => setTagFilter(e.target.value)}>
          {allTags.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* AI BOX */}
      <div style={{ background: "#eef4ff", padding: "20px", borderRadius: "12px", marginBottom: "2rem", border: "1px solid #c6d8ff" }}>
        <h3 style={{ marginTop: 0 }}>
          {lang === "fr" ? "Assistant IA (informatif seulement)" : "AI Assistant (informational only)"}
        </h3>
        <p style={{ fontSize: "0.9rem", color: "#555" }}>
          {lang === "fr"
            ? "Les réponses de l’IA sont fournies à titre informatif seulement et ne constituent pas un avis juridique."
            : "AI responses are provided for general information only and do not constitute legal advice."}
        </p>
        <textarea
          value={aiInput}
          onChange={e => setAiInput(e.target.value)}
          placeholder={
            lang === "fr"
              ? "Posez votre question (français, espagnol, arabe, ourdou)…"
              : "Ask your question (English, Spanish, Arabic, Urdu)…"
          }
          style={{ width: "100%", height: "80px", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <button
          onClick={askAI}
          disabled={aiLoading}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            background: "#4d97ff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {aiLoading ? "..." : (lang === "fr" ? "Envoyer" : "Ask AI")}
        </button>
        {aiAnswer && (
          <div style={{ marginTop: "15px", padding: "15px", background: "#fff", borderRadius: "8px", border: "1px solid #ddd" }}>
            <p style={{ margin: 0, lineHeight: "1.5" }}>{aiAnswer}</p>
          </div>
        )}
      </div>

      {/* FAQ RESULTS */}
      {filtered.map(item => (
        <details
          key={item.id}
          style={{
            marginBottom: "15px",
            background: "white",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            border: "1px solid #eee"
          }}
        >
          <summary style={{ fontWeight: "bold", cursor: "pointer", fontSize: "1.1rem" }}>
            {item.question[lang]}
          </summary>
          <div style={{ marginTop: "10px", paddingLeft: "10px", borderLeft: "4px solid #dce7ff" }}>
            <p style={{ lineHeight: "1.6" }}>{item.answer[lang]}</p>
            <button
              onClick={() => navigate(`/letters?from=faq&lang=${lang}`)}
              style={{
                padding: "8px 16px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                marginTop: "10px"
              }}
            >
              {lang === "fr" ? "Générer une lettre" : "Generate Letter"}
            </button>
          </div>
        </details>
      ))}
    </div>
  );
}
