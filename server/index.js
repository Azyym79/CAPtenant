import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

// 1. Initialize environment and apps
dotenv.config();
const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 2. Middleware (Preserved)
app.use(cors());
app.use(express.json());

// 3. Phase 1A: Intent Taxonomy
const TENANT_INTENTS = {
  RENT_INCREASE: "rent_increase",
  AGI: "agi",
  EVICTION: "eviction",
  REPAIRS: "repairs",
  HARASSMENT: "harassment",
  ENTRY: "illegal_entry",
  GENERAL: "general_question",
};

// 4. Voice Assistant /ask-ai Endpoint (With Legal Citation Enhancements)
app.post("/ask-ai", async (req, res) => {
  const { text, tone } = req.body;
  console.log(`📩 Voice Query: "${text.substring(0, 50)}..."`);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `You are CAPtenant, an expert on Ontario Tenant Rights (RTA).
          Provide legal information in a ${tone || 'professional'} tone.
          
          OUTPUT FORMAT (Strict JSON):
          {
            "answer": "Clear advice in user's language...",
            "intent": "one of the TENANT_INTENTS",
            "suggestLetter": true/false,
            "letterType": "suggested_letter_name",
            "language": "en/fr/es/ar/ur"
          }

          INTENTS: ${JSON.stringify(TENANT_INTENTS)}
          
          RULE: You MUST set "suggestLetter": true if the user mentions ANY of these:
          - Rent increases (guideline or N1/N2 forms)
          - Repairs or maintenance (mold, broken appliances)
          - Eviction or "moving out" notices (N12, N4)
          - Landlord entering without permission
          - Harassment or noise complaints

          If it's a simple greeting like 'Hello', set it to false.

          GUIDELINES:
          1. When providing advice, explicitly mention the relevant section of the RTA if applicable:
             - Repairs: Mention Section 20 (Landlord's responsibility to repair).
             - Privacy/Entry: Mention Section 27 (24 hours written notice required).
             - Rent Increases: Mention Section 116 (90 days written notice required).
             - Illegal Deposits: Mention Section 134 (Prohibited additional charges).
          2. Provide a link to the official RTA at: https://www.ontario.ca/laws/statute/06r17 in your answer if the user asks for more details or if the situation is complex.
          3. Respond in the same language the user spoke.
          4. Remind users to consult the LTB for official rulings and that this is not legal advice.` 
        },
        { role: "user", content: text },
      ],
      response_format: { type: "json_object" }
    });

    const aiData = JSON.parse(completion.choices[0].message.content);
    
    res.json({
      answer: aiData.answer,
      intent: aiData.intent || "general_question",
      suggestLetter: aiData.suggestLetter === true,
      letterType: aiData.letterType || null,
      language: aiData.language || "en"
    });
  } catch (error) {
    console.error("Voice AI Error:", error);
    res.status(500).json({ error: "Voice AI unavailable." });
  }
});

// 5. Letter Generator /rewrite Endpoint
app.post("/rewrite", async (req, res) => {
  const { text, style } = req.body;
  console.log(`✉️ Rewriting Letter: Style [${style}]`);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a legal writing assistant. Rewrite the tenant's input into a ${style} formal letter. 
          Use Ontario legal terminology (citing RTA sections where appropriate). Include a [Subject Line].`
        },
        { role: "user", content: text }
      ]
    });

    res.json({ rewritten: completion.choices[0].message.content });
  } catch (error) {
    console.error("Rewrite Error:", error);
    res.status(500).json({ error: "Rewrite service unavailable." });
  }
});

// 6. Multilingual /rewrite-multilingual Endpoint
app.post("/rewrite-multilingual", async (req, res) => {
  const { text } = req.body;
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Translate this tenant letter into French, Spanish, Arabic, and Urdu. Return as a JSON object with 'english' and 'translated' keys."
        },
        { role: "user", content: text }
      ],
      response_format: { type: "json_object" }
    });

    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (error) {
    console.error("Translation Error:", error);
    res.status(500).json({ error: "Translation service failed." });
  }
});

// 7. Server Start
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("------------------------------------------");
  console.log("✅ CAPtenant AI backend running on port " + PORT);
  console.log("------------------------------------------");
});