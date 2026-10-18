import { getProviderConfig } from "../lib/llm.js";

/**
 * Vercel Serverless Function: GET /api/status
 * Returns current LLM provider configuration and status badge info.
 * Keep all secret API keys strictly on the server.
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  try {
    const config = getProviderConfig(process.env);
    return res.status(200).json({
      mode: config.mode,
      model: config.model,
      badgeText: config.badgeText,
      badgeType: config.badgeType,
      privacyNotice: config.privacyNotice,
      configured: config.mode === "cloud" ? config.hasApiKey : true
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to load provider status" });
  }
}
