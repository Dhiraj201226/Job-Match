import { analyzeJobMatch } from "../lib/llm.js";

/**
 * Vercel Serverless Function: POST /api/analyze
 * Accepts resume/profile and job/gig post, invokes Gemma 4 LLM provider,
 * validates structured JSON, retries if malformed, and returns match data.
 */
export default async function handler(req, res) {
  // CORS configuration
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        // keep as is
      }
    }

    const resumeText = body?.resumeText || body?.resume || "";
    const jobDescription = body?.jobDescription || body?.job || body?.role || "";
    const tone = body?.tone || "Professional, confident, and direct";

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ error: "Resume or profile text is required." });
    }

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ error: "Job post or gig listing text is required." });
    }

    const result = await analyzeJobMatch({
      resumeText,
      jobDescription,
      tone,
      env: process.env
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error("Analysis API error:", err);
    return res.status(500).json({
      error: err.message || "Failed to analyze job match with Gemma 4 model."
    });
  }
}
