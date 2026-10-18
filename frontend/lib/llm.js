/**
 * JobMatch AI - LLM Provider Module
 * DEV Hacktoberfest Open-Source AI Challenge - Week 2 "Side Hustle"
 * Powered by Google Gemma 4 (Cloud 31B or Local)
 */

export const DEFAULT_CLOUD_MODEL = "gemma4:31b-cloud";
export const DEFAULT_LOCAL_MODEL = "gemma4:31b-cloud";
export const DEFAULT_LOCAL_URL = "http://127.0.0.1:11434";
export const DEFAULT_CLOUD_URL = "https://ollama.com/api/chat";

/**
 * Resolve provider configuration based on environment variables
 * @param {Record<string, string|undefined>} env
 */
export function getProviderConfig(env = (typeof process !== "undefined" ? process.env : {})) {
  const apiKey = env.OLLAMA_API_KEY || "";
  const explicitMode = (env.LLM_MODE || env.OLLAMA_MODE || "").toLowerCase();

  // Mode decision: explicit mode takes precedence; otherwise cloud if apiKey present, else local
  let mode = "local";
  if (explicitMode === "cloud" || explicitMode === "local") {
    mode = explicitMode;
  } else if (apiKey) {
    mode = "cloud";
  }

  const isCloud = mode === "cloud";
  const model = isCloud
    ? (env.OLLAMA_MODEL || DEFAULT_CLOUD_MODEL)
    : (env.OLLAMA_LOCAL_MODEL || DEFAULT_LOCAL_MODEL);

  const endpoint = isCloud
    ? (env.OLLAMA_CLOUD_URL || DEFAULT_CLOUD_URL)
    : `${(env.OLLAMA_LOCAL_URL || DEFAULT_LOCAL_URL).replace(/\/$/, "")}/api/chat`;

  return {
    mode,
    model,
    endpoint,
    hasApiKey: Boolean(apiKey),
    apiKey,
    badgeText: isCloud ? "Running: Gemma 4 31B (cloud)" : "Running: local (private)",
    badgeType: isCloud ? "cloud" : "local",
    privacyNotice: isCloud
      ? "Cloud mode: Resume and gig data processed via Ollama Cloud API (Gemma 4 31B)."
      : "Local mode: 100% private. Resume and gig data never leaves your laptop."
  };
}

/**
 * Query local Ollama instance for installed models
 * @param {string} localUrl
 * @param {typeof fetch} [fetchFn]
 * @returns {Promise<string[]>}
 */
export async function getInstalledLocalModels(localUrl = DEFAULT_LOCAL_URL, fetchFn = fetch) {
  try {
    const tagsUrl = `${localUrl.replace(/\/$/, "")}/api/tags`;
    const res = await fetchFn(tagsUrl, { signal: AbortSignal.timeout(1500) });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.models || []).map(m => m.name || m.model).filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Validate and sanitize structured analysis output
 * @param {any} data
 */
export function validateAnalysisResult(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Analysis output is not a JSON object");
  }

  // 1. match_score (0 - 100)
  let score = Number(data.match_score);
  if (Number.isNaN(score) || score < 0 || score > 100) {
    throw new Error(`Invalid match_score: expected number between 0 and 100, received ${data.match_score}`);
  }
  score = Math.round(score);

  // 2. score_reason
  if (!data.score_reason || typeof data.score_reason !== "string" || data.score_reason.trim().length === 0) {
    throw new Error("Invalid score_reason: expected non-empty string explaining the match score");
  }

  // 3. matched_skills
  if (!Array.isArray(data.matched_skills)) {
    throw new Error("Invalid matched_skills: expected array of matched skill names");
  }
  const matched_skills = data.matched_skills
    .map(s => String(s).trim())
    .filter(Boolean);

  // 4. missing_skills
  if (!Array.isArray(data.missing_skills)) {
    throw new Error("Invalid missing_skills: expected array of missing skill names");
  }
  const missing_skills = data.missing_skills
    .map(s => String(s).trim())
    .filter(Boolean);

  // 5. fixes (at least 3 concrete things to fix)
  if (!Array.isArray(data.fixes) || data.fixes.length < 3) {
    throw new Error(`Invalid fixes: expected array with at least 3 concrete actionable fixes, received ${Array.isArray(data.fixes) ? data.fixes.length : typeof data.fixes}`);
  }
  const fixes = data.fixes
    .map(f => String(f).trim())
    .filter(Boolean);
  if (fixes.length < 3) {
    throw new Error("Invalid fixes: at least 3 non-empty fix descriptions are required");
  }

  // 6. cover_letter
  if (!data.cover_letter || typeof data.cover_letter !== "string" || data.cover_letter.trim().length < 20) {
    throw new Error("Invalid cover_letter: expected tailored proposal or cover letter text (min 20 characters)");
  }

  return {
    match_score: score,
    score_reason: data.score_reason.trim(),
    matched_skills,
    missing_skills,
    fixes: fixes.slice(0, 5),
    cover_letter: data.cover_letter.trim()
  };
}

/**
 * Robust JSON extraction handling markdown blocks, prefixes, and trailing commas
 * @param {string} rawText
 */
export function extractJSON(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Empty response received from LLM");
  }

  let text = rawText.trim();

  // Strip markdown code fences if present (```json ... ``` or ``` ...)
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  } else {
    // Slice outermost JSON object if surrounded by preamble/postscript
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      text = text.substring(firstBrace, lastBrace + 1);
    }
  }

  // Remove trailing commas before closing braces/brackets
  text = text.replace(/,\s*([}\]])/g, "$1");

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error(`JSON parse failure: ${err.message}. Raw text: ${text.slice(0, 160)}`);
  }
}

/**
 * Build system and user prompt for Gemma 4
 */
export function buildPrompts({ resumeText, jobDescription, tone = "Professional, confident, and direct" }) {
  const systemPrompt = `You are JobMatch AI, an expert technical recruiter and freelance proposal strategist powered by Google Gemma 4.
Your job is to analyze candidate resumes or profiles against job descriptions or freelance gig postings.
You must return your evaluation strictly as a single JSON object. Do not include markdown preamble, commentary, or text outside the JSON.`;

  const userPrompt = `Evaluate the following candidate profile against the job/gig description.

[CANDIDATE RESUME / PROFILE]:
${resumeText}

[JOB POST / GIG LISTING]:
${jobDescription}

[DESIRED PROPOSAL TONE]:
${tone}

Analyze the match and return a single valid JSON object with EXACTLY this structure:
{
  "match_score": 85,
  "score_reason": "1-2 concise sentences explaining why the candidate received this match score based on experience and requirements.",
  "matched_skills": ["Skill A", "Skill B", "Skill C"],
  "missing_skills": ["Missing Tool X", "Missing Requirement Y"],
  "fixes": [
    "Concrete, actionable fix 1 to optimize the resume or bridge the gap.",
    "Concrete, actionable fix 2 to improve candidate positioning.",
    "Concrete, actionable fix 3 to highlight relevant strengths for this specific role."
  ],
  "cover_letter": "A compelling, tailored proposal or cover letter written specifically for this job/gig in the requested tone, highlighting key matched skills and proactively addressing any gaps."
}

Rules:
1. match_score must be an integer between 0 and 100.
2. fixes must contain at least 3 concrete, distinct, actionable recommendations.
3. Return ONLY valid JSON.`;

  return { systemPrompt, userPrompt };
}

/**
 * Execute LLM call via Ollama API (Cloud or Local) with automatic local model discovery
 * @param {object} params
 * @param {string} params.resumeText
 * @param {string} params.jobDescription
 * @param {string} [params.tone]
 * @param {Record<string, string|undefined>} [params.env]
 * @param {typeof fetch} [params.customFetch]
 */
export async function analyzeJobMatch({
  resumeText,
  jobDescription,
  tone = "Professional, confident, and direct",
  env = (typeof process !== "undefined" ? process.env : {}),
  customFetch = fetch
}) {
  if (!resumeText || !resumeText.trim()) {
    throw new Error("Candidate resume or profile text is required.");
  }
  if (!jobDescription || !jobDescription.trim()) {
    throw new Error("Job post or gig listing text is required.");
  }

  let config = getProviderConfig(env);
  const { systemPrompt, userPrompt } = buildPrompts({ resumeText, jobDescription, tone });

  const headers = {
    "Content-Type": "application/json"
  };

  if (config.mode === "cloud") {
    if (!config.apiKey) {
      throw new Error("OLLAMA_API_KEY environment variable is missing for Cloud mode.");
    }
    headers["Authorization"] = `Bearer ${config.apiKey}`;
  }

  let activeModel = config.model;

  const makePayload = (messages, modelName = activeModel) => ({
    model: modelName,
    messages,
    stream: false,
    format: "json",
    options: {
      temperature: 0.2,
      num_ctx: config.mode === "local" ? 2048 : 4096,
      num_predict: 800
    }
  });

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ];

  let response;
  try {
    response = await customFetch(config.endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(makePayload(messages, activeModel))
    });
  } catch (netErr) {
    console.error("[JobMatch AI] Local Ollama fetch failed:", netErr);
    if (config.mode === "local") {
      throw new Error(`Unable to connect to local Ollama at ${config.endpoint} (${netErr.message || netErr}). Ensure Ollama is running ('ollama run ${config.model}') or set OLLAMA_API_KEY to use Gemma 4 31B Cloud.`);
    }
    throw new Error(`Ollama Cloud API request failed: ${netErr.message}`);
  }

  // Handle 404 Model Not Found in local mode: auto-detect installed Gemma model
  if (!response.ok && response.status === 404 && config.mode === "local") {
    const installed = await getInstalledLocalModels(env.OLLAMA_LOCAL_URL || DEFAULT_LOCAL_URL, customFetch);
    const gemmaModel = installed.find(m => m.includes("gemma4") || m.includes("gemma")) || installed[0];
    
    if (gemmaModel && gemmaModel !== activeModel) {
      console.log(`[JobMatch AI] Switching model from ${activeModel} to detected local model: ${gemmaModel}`);
      activeModel = gemmaModel;
      response = await customFetch(config.endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(makePayload(messages, activeModel))
      });
    } else {
      const availableMsg = installed.length > 0 ? ` Installed models: ${installed.join(", ")}.` : "";
      throw new Error(`Model '${activeModel}' not found in local Ollama.${availableMsg} Run 'ollama run gemma4:12b' in your terminal.`);
    }
  }

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Ollama API error (${response.status}): ${errText || response.statusText}`);
  }

  const data = await response.json();
  const rawContent = data?.message?.content || data?.response || "";

  // Attempt 1: Parse and validate
  try {
    const parsed = extractJSON(rawContent);
    const validated = validateAnalysisResult(parsed);
    return {
      ...validated,
      meta: {
        mode: config.mode,
        model: activeModel,
        badgeText: config.mode === "cloud" ? "Running: Gemma 4 31B (cloud)" : `Running: local (${activeModel})`,
        retried: false
      }
    };
  } catch (validationErr) {
    // RETRY ONCE: Request corrected JSON format with error feedback
    const retryMessages = [
      ...messages,
      { role: "assistant", content: rawContent },
      {
        role: "user",
        content: `Your previous response failed validation: "${validationErr.message}". Please output ONLY a valid JSON object matching the required schema with keys match_score, score_reason, matched_skills, missing_skills, fixes (at least 3 items), and cover_letter.`
      }
    ];

    try {
      const retryResponse = await customFetch(config.endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(makePayload(retryMessages, activeModel))
      });

      if (!retryResponse.ok) {
        throw new Error(`Retry response error (${retryResponse.status})`);
      }

      const retryData = await retryResponse.json();
      const retryContent = retryData?.message?.content || retryData?.response || "";
      const retryParsed = extractJSON(retryContent);
      const retryValidated = validateAnalysisResult(retryParsed);

      return {
        ...retryValidated,
        meta: {
          mode: config.mode,
          model: activeModel,
          badgeText: config.mode === "cloud" ? "Running: Gemma 4 31B (cloud)" : `Running: local (${activeModel})`,
          retried: true
        }
      };
    } catch (retryErr) {
      throw new Error(`Model returned invalid format after retry: ${validationErr.message} (Retry error: ${retryErr.message})`);
    }
  }
}
