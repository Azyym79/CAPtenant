import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LanguageSelector() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const currentLang = params.get("lang") || "en-US";

  const handleChange = (e) => {
    const newLang = e.target.value;
    
    // Update the URL parameter without losing the current page path
    params.set("lang", newLang);
    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ fontSize: "12px", color: "#666", fontWeight: "bold" }}>LANG:</span>
      <select 
        value={currentLang} 
        onChange={handleChange}
        style={{ 
          padding: "4px 8px", 
          borderRadius: "4px", 
          border: "1px solid #ccc",
          cursor: "pointer",
          background: "#f9f9f9"
        }}
      >
        <option value="en-US">EN (English)</option>
        <option value="fr-FR">FR (Français)</option>
        <option value="es-ES">ES (Español)</option>
        <option value="ar-SA">AR (العربية)</option>
        {/* 🔑 Switching from UR (Native Script) to Roman Urdu to fix network errors */}
        <option value="roman-ur">UR (Roman Urdu)</option>
      </select>
    </div>
  );
}