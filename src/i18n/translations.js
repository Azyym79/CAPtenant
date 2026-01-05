// ==============================================
//  translations.js
//  Multilingual utilities for CAPtenant
// ==============================================

// Languages we support:
export const SUPPORTED_LANGUAGES = ["en", "fr", "es", "ar", "ur"];

// Lightweight keyword-based detection (frontend only)
export function detectLanguage(inputText) {
  const text = inputText.toLowerCase();

  // Arabic script detection
  if (/[ء-ي]/.test(text)) return "ar";

  // Urdu script detection
  if (/[ء-ی]/.test(text)) return "ur";

  // French indicators
  if (text.includes("bonjour") || text.includes("propriétaire"))
    return "fr";

  // Spanish indicators
  if (text.includes("hola") || text.includes("inquilino"))
    return "es";

  // Default English
  return "en";
}

// Proper formatting for RTL languages
export const RTL_LANGS = ["ar", "ur"];

export function wrapRTL(text) {
  return `<div style="direction: rtl; text-align: right;">${text}</div>`;
}
