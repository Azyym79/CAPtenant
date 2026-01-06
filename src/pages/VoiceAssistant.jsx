import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* =========================================================
   CAPtenant Voice Assistant
   GOAL (LOCKED):
   - Accept multilingual voice input (EN / FR / ES / AR / Roman Urdu)
   - NEVER translate or explain in output
   - Detect legal intent (esp. eviction without notice)
   - Pass RAW transcript + intent to LetterGenerator
   - UI language remains strictly EN / FR
========================================================= */

/* =========================================
   ✅ API BASE (FIXED, NO LOSS)
   - Must hit Railway BACKEND, not frontend
   - Uses .env VITE_API_URL if present
   - Falls back to known backend URL
========================================= */
const RAW_API_BASE =
  import.meta?.env?.VITE_API_URL || "https://captenant-production.up.railway.app";

// normalize to avoid trailing slash issues
const API_BASE = String(RAW_API_BASE).replace(/\/+$/, "");

export default function VoiceAssistant() {
  const navigate = useNavigate();

  /* =========================================
      🌐 LANGUAGE STRATEGY (CANONICAL)
  ========================================= */
  // Speech recognition language (not UI language)
  const [language, setLanguage] = useState("en-US");

  // UI language is strictly EN / FR only
  const isUIFrench = language.toLowerCase().startsWith("fr");

  const t = {
    en: {
      title: "🎙️ CAPtenant Voice Assistant",
      subtitle: "Ask <strong>CAPtenant</strong> about your rental rights.",
      listening: "Listening...",
      youSaid: "You said:",
      thinking: "Thinking...",
      btnLetter: "✉️ Generate Letter",
      errorNetwork: "Network error. Try Roman Urdu mode.",
      errorNoSpeech: "No speech detected. Please speak clearly.",
      browserError: "Speech recognition is not supported in this browser."
    },
    fr: {
      title: "🎙️ Assistant vocal CAPtenant",
      subtitle:
        "Posez vos questions sur vos droits locatifs à <strong>CAPtenant</strong>.",
      listening: "Écoute en cours...",
      youSaid: "Vous avez dit :",
      thinking: "Analyse en cours...",
      btnLetter: "✉️ Générer la lettre",
      errorNetwork: "Erreur réseau. Essayez l’ourdou roman.",
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
      🎤 SPEECH RECOGNITION
  ========================================= */
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert(t.browserError);
    if (isListening || loading) return;

    const recognition = new SpeechRecognition();

    // 🔑 Roman Urdu MUST use en-US engine to avoid browser network crash
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
      🧠 AI QUERY (STRICT INTENT MODE)
      - AI answer is informational only
      - REAL WORK happens in LetterGenerator
  ========================================= */
  const handleVoiceQuery = async (text) => {
    setLoading(true);
    setError(null);

    try {
      // Attempt #1
      let res = await fetch(`${API_BASE}/captenant/ask-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          language,
          strict: true // 🔒 tells backend to infer intent, not explain language
        })
      });

      // Fallback Attempt #2
      if (!res.ok) {
        res = await fetch(`${API_BASE}/ask-ai`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, language, strict: true })
        });
      }

      // If still not OK, stop cleanly (prevents res.json() crash)
      if (!res.ok) {
        throw new Error(`Backend returned ${res.status}`);
      }

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
      🔊 SPEECH SYNTHESIS
      (NEVER read translations or explanations)
  ========================================= */
  const speakResponse = (text, detectedLang) => {
    if (!window.speechSynthesis || !text) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const langMap = {
      en: "en-US",
      "en-CA": "en-CA",
      fr: "fr-CA",
      "fr-CA": "fr-CA",
      es: "es-ES",
      ar: "ar-SA",
      "roman-ur": "en-US"
    };

    utterance.lang = langMap[detectedLang] || "en-US";
    window.speechSynthesis.speak(utterance);
  };

  /* =========================================
      ✉️ PERSISTENCE → LETTER GENERATOR
      🔑 PASS RAW TRANSCRIPT + INTENT
  ========================================= */
  const goToLetterGenerator = () => {
    const query = new URLSearchParams({
      from: "voice",
      lang: isUIFrench ? "fr" : "en", // UI language only
      intent: aiData.intent,
      summary: transcript // 🔒 RAW text, NO translation
    }).toString();

    navigate(`/letters?${query}`);
  };

  /* =========================================
      UI
  ========================================= */
  return (
    <div
      style={{
        maxWidth: "750px",
        margin: "3rem auto",
        textAlign: "center",
        padding: "1.5rem",
        fontFamily: "sans-serif"
      }}
    >
      <h1 style={{ color: "#333", fontSize: "2.5rem" }}>{t.title}</h1>
      <p
        style={{ fontSize: "1.1rem", color: "#666", marginBottom: "2rem" }}
        dangerouslySetInnerHTML={{ __html: t.subtitle }}
      />

      {/* Language selector (speech only) */}
      <div style={{ marginBottom: "2rem" }}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            padding: "12px 20px",
            borderRadius: "10px",
            fontSize: "1rem",
            border: "2px solid #0d6efd",
            cursor: "pointer"
          }}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {/* Mic button */}
      <div
        onClick={isListening ? () => recognitionRef.current?.stop() : startListening}
        style={{
          width: "120px",
          height: "120px",
          background: isListening ? "#ff4d4d" : "#0d6efd",
          borderRadius: "50%",
          margin: "0 auto 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "0.3s",
          boxShadow: isListening
            ? "0 0 25px rgba(255, 77, 77, 0.6)"
            : "0 4px 12px rgba(13, 110, 253, 0.3)"
        }}
      >
        <span style={{ fontSize: "50px", color: "white" }}>
          {isListening ? "⏹" : "🎤"}
        </span>
      </div>

      {/* Transcript */}
      {transcript && (
        <div
          dir={currentLangMeta.dir}
          style={{
            background: "#f8f9fa",
            padding: "1.5rem",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            border: "1px solid #dee2e6"
          }}
        >
          <p style={{ fontSize: "1.1rem", margin: 0 }}>
            <strong style={{ color: "#0d6efd" }}>{t.youSaid}</strong> {transcript}
          </p>
        </div>
      )}

      {loading && (
        <p style={{ color: "#0d6efd", fontWeight: "bold" }}>
          ⏳ {t.thinking}
        </p>
      )}

      {/* AI response (informational only) */}
      {aiData.answer && (
        <div
          dir={currentLangMeta.dir}
          style={{
            textAlign: currentLangMeta.dir === "rtl" ? "right" : "left",
            background: "#eef6ff",
            padding: "2rem",
            borderRadius: "16px",
            border: "1px solid #b6d4fe"
          }}
        >
          <p style={{ fontSize: "1.2rem", lineHeight: "1.6", color: "#2c3e50" }}>
            {aiData.answer}
          </p>

          <button
            onClick={goToLetterGenerator}
            style={{
              marginTop: "1.5rem",
              padding: "12px 30px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer"
            }}
          >
            {t.btnLetter}
          </button>
        </div>
      )}

      {error && (
        <p
          style={{
            color: "#dc3545",
            marginTop: "1.5rem",
            padding: "1rem",
            background: "#f8d7da",
            borderRadius: "8px"
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
