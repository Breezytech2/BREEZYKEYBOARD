/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { AIManager } from "./aiProviders.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// -------------------------------------------------------------------------
// Keyboard AI Assistant Endpoint
// -------------------------------------------------------------------------
app.post("/api/gemini/keyboard-ai", async (req, res) => {
  let selectedProvider = AIManager.getProvider();
  
  try {
    const { action, text, options = {} } = req.body;
    if (!action) {
      return res.status(400).json({ error: "Missing action parameter" });
    }

    const isThinking = options.thinking || false;

    let systemInstruction = "You are Breezy AI, a helpful, ultra-fast writing assistant embedded directly inside an Android virtual keyboard. Always be highly concise, practical, and direct. Do not add chatty filler, pleasantries, or markdown headers unless specifically asked.";
    let contents = "";
    let responseMimeType: string | undefined;
    let responseSchema: any | undefined;

    switch (action) {
      case "grammar":
      case "spelling":
        contents = `Correct all spelling, grammar, punctuation, and structural issues in the following text to make it sound entirely natural, polished, and fluent. Return ONLY the corrected text without any explanation, intro, quotes, or wrappers. If the text is already correct, return it exactly as it is.\n\nInput text: ${text}`;
        break;

      case "rewrite": {
        const tone = options.tone || "professional";
        contents = `Rewrite the following text to have a clear "${tone}" tone. Maintain the original core meaning but transform the style completely. Return ONLY the rewritten text without quotes, comments, or intro.\n\nInput text: ${text}`;
        break;
      }

      case "professional":
      case "friendly":
      case "formal":
      case "casual":
      case "excited":
      case "witty":
        contents = `Rewrite the following text with an explicitly "${action}" tone. Ensure the language matches this mood perfectly while keeping the intent clear. Return ONLY the rewritten text.\n\nInput text: ${text}`;
        break;

      case "summarize":
        contents = `Provide a concise, ultra-clear summary of the following text, highlighting only the key points. Keep it brief and suitable for reading on a phone screen.\n\nInput text: ${text}`;
        break;

      case "expand":
        contents = `Expand the following brief draft or notes to make it more descriptive, professional, and grammatically complete, adding elegant details where appropriate. Keep it flowing naturally. Return ONLY the expanded text.\n\nInput text: ${text}`;
        break;

      case "shorten":
        contents = `Shorten the following text drastically to be concise, punchy, and direct, removing filler while keeping the core message intact. Return ONLY the shortened text.\n\nInput text: ${text}`;
        break;

      case "translate": {
        const toLang = options.toLang || "English";
        contents = `Translate the following text into ${toLang} accurately. Preserve the original tone and context. Return ONLY the translated text without notes or quotes.\n\nInput text: ${text}`;
        break;
      }

      case "continue":
        contents = `Continue writing the following text naturally, maintaining the same voice, style, and flow. Provide 2-3 logical sentences that could follow this input perfectly. Return ONLY the continuation.\n\nInput text: ${text}`;
        break;

      case "story":
        contents = `Draft a short, creative, and engaging story based on this prompt or starting sentence: "${text}". Make it vivid and well-paced.`;
        break;

      case "bio":
        contents = `Generate a professional and punchy personal bio based on these details: "${text}". Provide 3 variations: Professional, Creative, and Minimalist.`;
        break;

      case "message":
        contents = `Draft a natural, clear, and context-appropriate message based on this intent: "${text}". Ensure it sounds human and fits the chosen platform (SMS, WhatsApp, Slack).`;
        break;

      case "hashtags":
        contents = `Generate 15 trending and relevant hashtags for a post about: "${text}". Return ONLY the hashtags separated by spaces.`;
        break;

      case "explain":
        contents = `Briefly explain the meaning of the word or phrase "${text}" in a single short sentence, and provide a quick natural example. Keep it very compact for a keyboard layout view.`;
        break;

      case "reply":
      case "smart_reply":
        contents = `Generate a short, friendly, and natural reply to the following received message. Keep it conversational and brief. Received message: "${text}"`;
        break;

      case "email":
        contents = `Draft a polite, professional, and well-structured business email based on this brief outline: "${text}". Include a clear subject line and standard salutations.`;
        break;

      case "caption":
        contents = `Generate 5 creative, engaging, and catchy social media captions for a post about: "${text}". Use emojis naturally.`;
        break;

      case "social":
      case "social_media":
        contents = `Write a polished and engaging social media post (e.g. for LinkedIn, Twitter, or Instagram) based on this topic or draft: "${text}". Focus on high engagement.`;
        break;

      case "emoji":
        contents = `Suggest 10 relevant emojis that perfectly match the sentiment and topic of the following text. Return ONLY the emojis separated by spaces.\n\nText: ${text}`;
        break;

      case "chat":
        contents = `Answer the following message warmly, directly, and conversationally: "${text}"`;
        break;

      case "voice-cleanup":
        contents = `Analyze this raw, spoken voice transcription: "${text}".
1. Correct any clear acoustic misinterpretations or phonetic typos.
2. Remove standard conversational filler words (such as "um", "uh", "ah", "like", "you know", "err").
3. Apply standard punctuation and capitalization.
4. Also generate a ultra-concise 1-sentence summary of the spoken text.

Return your response in strict JSON format matching this schema:
{
  "cleanedText": "string",
  "summary": "string"
}`;
        responseMimeType = "application/json";
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            cleanedText: { type: Type.STRING, description: "The corrected and punctuated text with filler words removed." },
            summary: { type: Type.STRING, description: "A quick 1-sentence summary of what was spoken." },
          },
          required: ["cleanedText", "summary"],
        };
        break;

      case "protect-scan":
        contents = `Analyze this draft message for privacy, safety, and security: "${text}".
Check for:
1. Accidental password sharing, raw logins, PINs, or credentials.
2. Personal Identifying Information (PII) like Social Security numbers, complete credit card numbers, secret keys.
3. Scam probability (detect phishing triggers, crypto giveaway traps, fake lottery wins, bank alerts).
4. Suspicious links (unsecured IP links, weird domain structures, known spam routes).

Return your response in strict JSON format matching this schema:
{
  "isSafe": boolean,
  "warnings": ["string"],
  "piiDetected": ["string"],
  "scamProbability": "low" | "medium" | "high",
  "suspiciousLinks": ["string"]
}`;
        responseMimeType = "application/json";
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            isSafe: { type: Type.BOOLEAN, description: "Whether the message is safe to send without risking personal leaks or scam participation." },
            warnings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Brief warnings for any issue flagged.",
            },
            piiDetected: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of PII types found, e.g. ['Credit Card Number', 'Password', 'Email Address'].",
            },
            scamProbability: {
              type: Type.STRING,
              description: "Must be 'low', 'medium', or 'high'.",
            },
            suspiciousLinks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of suspicious URL strings found.",
            },
          },
          required: ["isSafe", "warnings", "piiDetected", "scamProbability", "suspiciousLinks"],
        };
        break;

      case "generate-word": {
        const langCode = options.lang || "en";
        const langName = options.langName || "English";
        contents = `Generate a fascinating, useful Vocabulary Word of the Day for a user studying or practicing ${langName}.
Provide the word, its pronunciation guide, its exact definition/meaning, and a natural, conversational example sentence in ${langName}.

Return your response in strict JSON format matching this schema:
{
  "word": "string",
  "meaning": "string",
  "example": "string",
  "pronunciation": "string",
  "language": "string"
}`;
        responseMimeType = "application/json";
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            meaning: { type: Type.STRING, description: "Definition of the word." },
            example: { type: Type.STRING, description: "A highly illustrative example sentence using the word." },
            pronunciation: { type: Type.STRING, description: "Phonetic pronunciation guide, e.g. /ˌserənˈdipədē/." },
            language: { type: Type.STRING, description: "The language code, e.g. 'en', 'sw', 'es', 'fr', 'ki'." },
          },
          required: ["word", "meaning", "example", "pronunciation", "language"],
        };
        break;
      }

      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }

    let result: any;
    const config = {
      systemInstruction,
      thinking: isThinking,
    };

    if (responseMimeType === "application/json") {
      result = await selectedProvider.generateStructuredJSON(contents, responseSchema, config);
    } else {
      result = await selectedProvider.generateText(contents, config);
    }

    const currentProviderName = AIManager.getActiveProviderName();
    return res.json({
      result,
      provider: currentProviderName,
      fallbackActive: currentProviderName.includes("fallback")
    });

  } catch (err: any) {
    console.error("AI Provider Error:", err);
    
    // Check for rate-limiting or quota limit exhaustion
    const errStr = (err.message || "").toLowerCase();
    const isLimitError = errStr.includes("quota") || errStr.includes("rate limit") || errStr.includes("limit") || errStr.includes("exhausted") || err.status === 429;
    
    if (isLimitError && selectedProvider.name !== "mock") {
      // Gracefully shift active provider to standard Mock AI Provider and trigger recovery
      AIManager.triggerTemporaryOffline(15);
      
      // Fallback request using the backup provider immediately so that this request does not fail!
      try {
        const backupProvider = AIManager.getProvider();
        let fallbackResult: any;
        
        // Re-run matching query on backup provider
        if (req.body.action === "voice-cleanup" || req.body.action === "protect-scan" || req.body.action === "generate-word") {
          // Dummy or schema matched fallback
          fallbackResult = await backupProvider.generateStructuredJSON(req.body.text || "", null, req.body.options);
        } else {
          fallbackResult = await backupProvider.generateText(req.body.text || "", { thinking: req.body.options?.thinking });
        }
        
        return res.json({
          result: fallbackResult,
          provider: "mock (fallback)",
          fallbackActive: true,
          nextResumeInSeconds: 15,
          message: "Primary AI is temporarily rate-limited. Serving via local backup service."
        });
      } catch (fallbackErr) {
        // Fallback also failed
      }
    }

    res.status(500).json({
      error: err.message || "An error occurred with the AI writing engine.",
      keyMissing: err.message?.includes("GEMINI_API_KEY") || err.message?.includes("missing") || false,
      provider: selectedProvider.name
    });
  }
});


// Serve health endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Vite Middleware Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BreezyKeyboard Server listening on http://localhost:${PORT}`);
  });
}

startServer();
