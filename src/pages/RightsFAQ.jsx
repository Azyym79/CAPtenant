import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ======================================================
   MASTER RIGHTS FAQ DATABASE (EN-CA / FR-CA)
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
      en: "Most rental units are subject to Ontario’s annual rent increase guideline. A landlord cannot increase rent above the guideline without approval for an Above-Guideline Increase (AGI).",
      fr: "La plupart des logements sont assujettis à la ligne directrice annuelle d’augmentation de loyer en Ontario. Un propriétaire ne peut dépasser cette limite sans l’approbation d’une augmentation au-delà de la ligne directrice (AGI)."
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
      en: "An Above-Guideline Increase (AGI) allows a landlord to raise rent above the guideline due to major repairs or increased property taxes. Tenants have the right to object.",
      fr: "Une augmentation au-delà de la ligne directrice (AGI) permet au propriétaire d’augmenter le loyer au-delà de la limite en raison de réparations majeures ou de hausses d’impôts fonciers. Les locataires ont le droit de s’y opposer."
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
      en: "Landlords must keep rental units in good repair and fit for habitation. If repairs are ignored, a tenant may file a T6 application with the Landlord and Tenant Board.",
      fr: "Le propriétaire doit maintenir le logement en bon état et propre à l’habitation. Si les réparations sont ignorées, le locataire peut déposer une demande T6 auprès de la Commission de la location immobilière."
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
      en: "No. Only the Landlord and Tenant Board can order an eviction. Notices such as N4, N12, or N13 do not require you to leave immediately.",
      fr: "Non. Seule la Commission de la location immobilière peut ordonner une expulsion. Les avis comme le N4, N12 ou N13 n’exigent pas un départ immédiat."
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
      en: "Except in emergencies, landlords must provide at least 24 hours’ written notice stating the reason and time of entry.",
      fr: "Sauf en cas d’urgence, le propriétaire doit fournir un avis écrit d’au moins 24 heures indiquant la raison et l’heure de l’entrée."
    },
    severity: "moderate",
    urgency: "normal",
    tags: ["Privacy", "Entry", "Harassment"]
  }
];

const categories = ["All", ...new Set(FAQ.map(f => f.category))];
const allTags = ["All", ...new Set(FAQ.flatMap(f => f.tags))];

/* ======================================================
   SMART DETECTION (Updated for Multilingual Keywords)
====================================================== */
const detectToneFromIntent = (text) => {
  const t = text.toLowerCase();
  // Detect English, French, Spanish, and Roman Urdu keywords
  if (t.includes("evict") || t.includes("nikalna") || t.includes("desalojo") || t.includes("harass")) return "firm";
  if (t.includes("repair") || t.includes("theek") || t.includes("reparar") || t.includes("broken")) return "polite";
  return "professional";
};

export default function RightsFAQ() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  
  // 🇨🇦 Global Language Lock (UI is strictly EN or FR)
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

  /* ---------------- AI ASSIST (Multilingual Support) ---------------- */
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
          language: params.get("lang") || "en" // Passes original language (Urdu/Spanish/Arabic) to AI
        })
      });

      const data = await res.json();
      setAiAnswer(data.answer);
    } catch {
      setAiAnswer(
        lang === "fr" ? "Impossible de joindre l’assistant CAPtenant." : "Unable to reach CAPtenant AI."
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#333", borderBottom: "2px solid #4d97ff", paddingBottom: "10px" }}>
        {lang === "fr" ? "FAQ – Droits des locataires" : "Tenant Rights FAQ"}
      </h1>

      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        {lang === "fr"
          ? "Recherchez, filtrez ou posez une question à CAPtenant concernant vos droits en Ontario."
          : "Search, filter, or ask CAPtenant about your tenant rights in Ontario."}
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
        <h3 style={{ marginTop: 0 }}>{lang === "fr" ? "Assistant IA Multilingue" : "Multilingual AI Assistant"}</h3>
        <textarea
          value={aiInput}
          onChange={e => setAiInput(e.target.value)}
          placeholder={lang === "fr" ? "Posez votre question (Français, Espagnol, Arabe, Ourdou)..." : "Ask your question (English, Spanish, Arabic, Urdu)..."}
          style={{ width: "100%", height: "80px", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <button 
          onClick={askAI} 
          disabled={aiLoading} 
          style={{ marginTop: "10px", padding: "10px 20px", background: "#4d97ff", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
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
        <details key={item.id} style={{ marginBottom: "15px", background: "white", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #eee" }}>
          <summary style={{ fontWeight: "bold", cursor: "pointer", fontSize: "1.1rem" }}>
            {item.question[lang]}
          </summary>
          <div style={{ marginTop: "10px", paddingLeft: "10px", borderLeft: "4px solid #dce7ff" }}>
            <p style={{ lineHeight: "1.6" }}>{item.answer[lang]}</p>
            <button 
              onClick={() => navigate(`/letters?from=faq&lang=${lang}`)}
              style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", marginTop: "10px" }}
            >
              {lang === "fr" ? "Générer une lettre" : "Generate Letter"}
            </button>
          </div>
        </details>
      ))}
    </div>
  );
}