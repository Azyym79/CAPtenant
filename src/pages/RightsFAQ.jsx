import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ======================================================
   MASTER RIGHTS FAQ DATABASE (EN-CA / FR-CA)
   NOTE: General informational content — non-exhaustive
====================================================== */
const FAQ = [
  {
    id: 1,
    category: "Rent Increases",
    question: {
      en: "What is the rent increase guideline in Ontario?",
      fr: "Quelle est la ligne directrice d’augmentation de loyer en Ontario?"
    },
    answer: {
      en: "Most rental units in Ontario are subject to an annual rent increase guideline. In some situations, a landlord may request an increase above this guideline through an established process.",
      fr: "La plupart des logements en Ontario sont soumis à une ligne directrice annuelle d’augmentation de loyer. Dans certaines situations, un propriétaire peut demander une augmentation au-delà de cette ligne directrice par un processus établi."
    },
    severity: "moderate",
    urgency: "normal",
    tags: ["Rent Increase", "Ontario"]
  },
  {
    id: 2,
    category: "Rent Increases",
    question: {
      en: "What is an Above-Guideline Increase (AGI)?",
      fr: "Qu’est-ce qu’une augmentation au-delà de la ligne directrice (AGI)?"
    },
    answer: {
      en: "An Above-Guideline Increase (AGI) is a process that may allow a landlord to increase rent above the guideline due to specific cost-related reasons, such as major repairs or tax increases. Tenants are typically notified and may participate in the process.",
      fr: "Une augmentation au-delà de la ligne directrice (AGI) est un processus pouvant permettre une hausse de loyer supérieure à la ligne directrice en raison de certains coûts, comme des réparations majeures ou des hausses d’impôts. Les locataires sont généralement avisés et peuvent participer au processus."
    },
    severity: "high",
    urgency: "normal",
    tags: ["AGI", "Rent Increase"]
  },
  {
    id: 3,
    category: "Maintenance & Repairs",
    question: {
      en: "What happens if repairs are not addressed?",
      fr: "Que se passe-t-il si les réparations ne sont pas effectuées?"
    },
    answer: {
      en: "Landlords are generally expected to maintain rental units in a good state of repair. If issues persist, tenants may explore available options through official Ontario housing channels.",
      fr: "Les propriétaires sont généralement tenus de maintenir le logement en bon état. Si les problèmes persistent, les locataires peuvent explorer les options disponibles auprès des instances ontariennes compétentes."
    },
    severity: "high",
    urgency: "urgent",
    tags: ["Repairs", "Maintenance", "Safety"]
  },
  {
    id: 4,
    category: "Evictions",
    question: {
      en: "Can a tenant be required to leave immediately?",
      fr: "Un locataire peut-il être tenu de quitter immédiatement?"
    },
    answer: {
      en: "In Ontario, notices related to tenancy do not usually require immediate departure. Formal steps and official authorization are typically involved before a tenancy ends.",
      fr: "En Ontario, les avis liés à la location n’exigent généralement pas un départ immédiat. Des étapes formelles et une autorisation officielle sont habituellement nécessaires avant la fin d’une location."
    },
    severity: "high",
    urgency: "urgent",
    tags: ["Evictions", "Notices"]
  },
  {
    id: 5,
    category: "Privacy & Entry",
    question: {
      en: "When can a landlord enter a rental unit?",
      fr: "Quand un propriétaire peut-il entrer dans un logement?"
    },
    answer: {
      en: "Outside of emergencies, advance notice is typically provided before entry, including the reason and time window. Specific requirements may vary depending on the situation.",
      fr: "En dehors des situations d’urgence, un avis préalable est généralement fourni avant l’entrée, indiquant la raison et la période prévue. Les exigences peuvent varier selon le contexte."
    },
    severity: "moderate",
    urgency: "normal",
    tags: ["Privacy", "Entry"]
  }
];

const categories = ["All", ...new Set(FAQ.map(f => f.category))];
const allTags = ["All", ...new Set(FAQ.flatMap(f => f.tags))];

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

  /* ---------------- FILTER SYSTEM ---------------- */
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
          : "Unable to reach CAPtenant at the moment."
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#333", borderBottom: "2px solid #4d97ff", paddingBottom: "10px" }}>
        {lang === "fr"
          ? "FAQ — Informations pour locataires (Ontario)"
          : "Tenant Information FAQ (Ontario)"}
      </h1>

      {/* INFORMATION NOTICE */}
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
            ? "Information générale uniquement"
            : "General information only"}
        </strong>
        <p style={{ marginTop: "6px" }}>
          {lang === "fr"
            ? "Cette section présente des informations générales sur la location résidentielle en Ontario. Le contenu est fourni à titre informatif et peut ne pas couvrir toutes les situations."
            : "This section provides general information about residential tenancies in Ontario. The content is informational and may not cover every situation."}
        </p>
      </div>

      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        {lang === "fr"
          ? "Recherchez ou parcourez des informations générales liées à la location en Ontario."
          : "Search or browse general information related to renting in Ontario."}
      </p>

      {/* SEARCH */}
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={lang === "fr" ? "Rechercher…" : "Search…"}
        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
      />

      {/* FILTERS */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", margin: "1.5rem 0" }}>
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}>
          <option value="All">{lang === "fr" ? "Gravité" : "Severity"}</option>
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </select>
        <select value={urgencyFilter} onChange={e => setUrgencyFilter(e.target.value)}>
          <option value="All">{lang === "fr" ? "Urgence" : "Urgency"}</option>
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
        </select>
        <select value={tagFilter} onChange={e => setTagFilter(e.target.value)}>
          {allTags.map(t => <option key={t}>{t}</option>)}
        </select>
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
