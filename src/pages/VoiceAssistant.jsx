import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* =========================================================
   CAPtenant Voice Assistant — LEGAL-SAFE UI
   IMPORTANT:
   - Voice input may be multilingual
   - ALL OUTPUT IS INFORMATIONAL ONLY
   - NO legal advice, interpretation, or instruction
   - EN / FR are the only authoritative legal languages
========================================================= */

/* =========================================
   API BASE (CANONICAL — NO CHANGE)
========================================= */
const RAW_API_BASE =
  import.meta?.env?.VITE_API_URL || "https://captenant-production.up.railway.app";

const API_BASE = String(RAW_API_BASE).replace(/\/+$/, "");

export default function VoiceAssistant() {
  const navigate = useNavigate();

  /* =========================================
      🌐 LANGUAGE STRATEGY (LOCKED)
      - UI language: EN / FR only
      - Voice input: multilingual (input-only)
  ========================================= */
  const [language, setLanguage] = useState("en-US");
  const isUIFrench = language.toLowerCase().startsWith("fr");

  const t = {
    en: {
      title: "🎙️ CAPtenant Voice Assistant",
      subtitle:
        "Ask general questions about Ontario rental rules. Spoken responses are informational only and not legal advice.",
      listening: "Listening...",
      youSaid: "You said:",
      thinking: "Thinking...",
      btnLetter: "✉️ Generate Letter",
      disclaimer:
        "CAPtenant provides general information only. Spoken responses do not constitute legal advice and should not replace professional guidance.",
      errorNetwork: "Network error. Please try again.",
      errorNoSpeech: "No speech detected. Please speak clearly.",
      browserError: "Speech recognition is not supported in this browser."
    },
    fr: {
      title: "🎙️ Assistant vocal CAPtenant",
      subtitle:
        "Posez des questions générales sur les règles locatives en Ontario. Les réponses sont informatives seulement.",
      listening: "Écoute en cours...",
      youSaid: "Vous avez dit :",
      thinking: "Analyse en cours...",
      btnLetter: "✉️ Générer la lettre",
      disclaimer:
        "CAPtenant fournit des informations générales uniquement. Les réponses vocales ne constituent pas des conseils juridiques.",
      errorNetwork: "Erreur réseau. Veuillez réessayer.",
      errorNoSpeech: "Aucune voix détectée.",
      browserError: "La reconnaissance vocale n’est pas supportée."
    }
  }[isUIFrench ? "fr" : "en"];

  /* =========================================
      STATE
  ========================================= */
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [aiData, setAiData] = useState({
    answer: "",
    intent: "general_question",
    suggestLetter: false,
    language: "en"
  });

  const LANGUAGES = [
    { code: "en-US", label: "🇨🇦 English", dir: "ltr" },
    { code: "fr-CA", label: "🇨🇦 Français (Canada)", dir: "ltr" },
    { code: "es-ES", label: "🇪🇸 Español", dir: "ltr" },
    { code: "ar-SA", label: "🇸🇦 العربية", dir: "rtl" },
    { code: "roman-ur", label: "🇵🇰 Roman Urdu", dir: "ltr" }
  ];

  const currentLangMeta =
    LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const recognitionRef = useRef(null);

  /* =========================================
      🎤 SPEECH RECOGNITION (INPUT ONLY)
  ========================================= */
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert(t.browserError);
    if (isListening || loading) return;

    const recognition = new SpeechRecognition();
    recognition.lang = language === "roman-ur" ? "en-US" : language;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript(t.listening);
      setAiData({
        answer: "",
        intent: "general_question",
        suggestLetter: false,
        language: "en"
      });
    };

    recognition.onresult = (event) => {
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const finalText = event.results[i][0].transcript.trim();
          setTranscript(finalText);
          setIsListening(false);
          handleVoiceQuery(finalText);
        } else {
          interim += event.results[i][0].transcript;
          setTranscript(interim);
        }
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === "network") setError(t.errorNetwork);
      else if (event.error === "no-speech") setError(t.errorNoSpeech);
      else setError(`Error: ${event.error}`);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  /* =========================================
      🧠 AI QUERY (INTENT DETECTION ONLY)
  ========================================= */
  const handleVoiceQuery = async (text) => {
    setLoading(true);
    setError(null);

    try {
      let res = await fetch(`${API_BASE}/captenant/ask-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language, strict: true })
      });

      if (!res.ok) {
        res = await fetch(`${API_BASE}/ask-ai`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, language, strict: true })
        });
      }

      if (!res.ok) throw new Error();

      const data = await res.json();

      setAiData({
        answer: data.answer || "",
        intent: data.intent || "general_question",
        suggestLetter: true,
        language: data.language || "en"
      });

      speakResponse(data.answer || "", data.language);
    } catch {
      setError(isUIFrench ? "Service indisponible." : "CAPtenant AI is unavailable.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
      🔊 SPEECH SYNTHESIS (MIRROR ONLY)
  ========================================= */
  const speakResponse = (text, detectedLang) => {
    if (!window.speechSynthesis || !text) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const langMap = {
      en: "en-US",
      fr: "fr-CA",
      es: "es-ES",
      ar: "ar-SA",
      "roman-ur": "en-US"
    };

    utterance.lang = langMap[detectedLang] || "en-US";
    window.speechSynthesis.speak(utterance);
  };

  /* =========================================
      ✉️ LETTER GENERATOR HANDOFF
  ========================================= */
  const goToLetterGenerator = () => {
    const query = new URLSearchParams({
      from: "voice",
      lang: isUIFrench ? "fr" : "en",
      intent: aiData.intent,
      summary: transcript
    }).toString();

    navigate(`/letters?${query}`);
  };

  /* =========================================
      UI
  ========================================= */
  return (
    <div style={{ maxWidth: "750px", margin: "3rem auto", padding: "1.5rem" }}>
      <h1>{t.title}</h1>
      <p style={{ color: "#666" }}>{t.subtitle}</p>

      <p
        style={{
          fontSize: "0.85rem",
          color: "#777",
          borderLeft: "4px solid #ffc107",
          paddingLeft: "1rem",
          marginBottom: "2rem"
        }}
      >
        ⚠️ {t.disclaimer}
      </p>

      {/* Language selector */}
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>

      {/* Mic */}
      <button onClick={startListening} style={{ marginTop: "2rem" }}>
        🎤
      </button>

      {aiData.answer && (
        <>
          <p>{aiData.answer}</p>
          <button onClick={goToLetterGenerator}>{t.btnLetter}</button>
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
