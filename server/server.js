
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";
import { fileURLToPath } from "url";
import path from "path";

/* -------------------------------------------------------------
   ENV SETUP
------------------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

/* -------------------------------------------------------------
   DEBUG CHECKS
------------------------------------------------------------- */
console.log("------------------------------------------------");
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ ERROR: OPENAI_API_KEY is missing.");
  process.exit(1);
} else {
  console.log("✅ API Key Loaded: " + process.env.OPENAI_API_KEY.substring(0, 5) + "...");
}
console.log("------------------------------------------------");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).send("CAPtenant backend is running");
});

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* -------------------------------------------------------------
   ROUTE 1: LETTER GENERATOR (STRICT EN-CA / FR-CA)
------------------------------------------------------------- */
app.post("/rewrite", async (req, res) => {
  const { text, style, language } = req.body;
  if (!text) return res.status(400).json({ error: "Missing text field." });

  // 🔒 HARD LOCK: Canadian Official Languages Only
  const letterLang = (language === "fr" || language === "fr-CA") ? "fr-CA" : "en-CA";

  try {
    const prompt = `
You are CAPtenant, an expert Ontario tenant advocate.

TASK:
Write a formal tenant letter suitable for an Ontario landlord or the LTB.

CRITICAL LANGUAGE RULES (STRICT):
1. If target language is "fr-CA":
   - Write entirely in Canadian French.
   - Greeting: "Madame, Monsieur," | Sign-off: "Cordialement,"
2. For ALL other input languages (Spanish, Arabic, Urdu, English):
   - Write the letter ENTIRELY in Canadian English.
   - Greeting: "Dear Landlord," | Sign-off: "Sincerely,"

CONTEXT:
- Tone: "${style}"
- User Notes: "${text}"
- Location: Ontario, Canada (Reference RTA sections if applicable).
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5
    });

    res.json({ rewritten: completion.choices[0].message.content.trim() });
  } catch (err) {
    console.error("Rewrite Error:", err.message);
    res.status(500).json({ error: "Rewrite failed." });
  }
});

/* -------------------------------------------------------------
   ROUTE 4: VOICE ASSISTANT (EXPANDED MULTILINGUAL CONVERSATION)
------------------------------------------------------------- */
const askAIHandler = async (req, res) => {
  const { text, language } = req.body;
  if (!text) return res.status(400).json({ error: "Missing text." });

  try {
    const prompt = `
You are CAPtenant, a multilingual Ontario tenant assistant.

CONVERSATION RULES:
- Respond in the user's language: English, Canadian French, Spanish, Arabic, or Roman Urdu.
- If language is "roman-ur", use English letters to spell Urdu words.
- Provide helpful, empathetic advice.

Return JSON ONLY:
{
  "language": "en" | "fr" | "es" | "ar" | "roman-ur",
  "answer": "...",
  "suggestLetter": true
}

User input: "${text}"
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }]
    });

    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (err) {
    console.error("Ask AI Error:", err.message);
    res.status(500).json({ error: "AI failed." });
  }
};

app.post("/ask-ai", askAIHandler);
app.post("/captenant/ask-ai", askAIHandler);

/* -------------------------------------------------------------
   ROUTE 2 & 3: ANALYZER & TRANSLATION (UNCHANGED)
------------------------------------------------------------- */
app.post("/rewrite-multilingual", async (req, res) => {
  const { text } = req.body;
  try {
    const prompt = `Detect language. If phonetic Urdu, label "roman-ur". Return JSON {language, english, translated}. Input: ${text}`;
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }]
    });
    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (err) { res.status(500).json({ error: "Failed" }); }
});

const analyzerHandler = async (req, res) => {
  const { text } = req.body;
  try {
    const prompt = `Analyze tenant situation. Return JSON {summary, plainLanguage, nextSteps}. Input: "${text}"`;
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    });
    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (err) { res.status(500).json({ error: "Failed" }); }
};
app.post("/captenant-rewrite", analyzerHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`CAPtenant backend running on port ${PORT}`);
});