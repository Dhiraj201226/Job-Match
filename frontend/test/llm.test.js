import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  extractJSON,
  validateAnalysisResult,
  getProviderConfig,
  analyzeJobMatch,
  DEFAULT_CLOUD_MODEL,
  DEFAULT_LOCAL_MODEL,
  DEFAULT_LOCAL_URL,
  DEFAULT_CLOUD_URL
} from "../lib/llm.js";

describe("JobMatch AI - LLM Provider & Schema Tests", () => {
  // ==========================================
  // TEST 1: JSON Parsing and Schema Validation
  // ==========================================
  describe("Test 1: JSON Parsing & Schema Validation", () => {
    it("should successfully extract and parse clean JSON", () => {
      const raw = JSON.stringify({
        match_score: 92,
        score_reason: "Strong alignment with modern frontend stack.",
        matched_skills: ["React 19", "TypeScript", "Tailwind CSS"],
        missing_skills: ["GraphQL"],
        fixes: [
          "Highlight REST-to-GraphQL migration experience.",
          "Add sample Apollo client repository link.",
          "Note familiarity with GraphQL query optimization."
        ],
        cover_letter: "Dear Hiring Manager, I am thrilled to apply for the Senior Frontend role."
      });

      const parsed = extractJSON(raw);
      const validated = validateAnalysisResult(parsed);

      assert.equal(validated.match_score, 92);
      assert.equal(validated.score_reason, "Strong alignment with modern frontend stack.");
      assert.deepEqual(validated.matched_skills, ["React 19", "TypeScript", "Tailwind CSS"]);
      assert.deepEqual(validated.missing_skills, ["GraphQL"]);
      assert.equal(validated.fixes.length, 3);
      assert.match(validated.cover_letter, /Dear Hiring Manager/);
    });

    it("should extract JSON wrapped inside markdown code fences with trailing commas", () => {
      const markdown = `
Here is the match analysis for the candidate:
\`\`\`json
{
  "match_score": 78,
  "score_reason": "Good foundational experience, lacks enterprise cloud scaling.",
  "matched_skills": ["Node.js", "Express", "PostgreSQL"],
  "missing_skills": ["Kubernetes", "Redis", "Kafka",],
  "fixes": [
    "Detail your Docker containerization workflow on GitHub.",
    "Add a section explaining message queue patterns you have studied.",
    "Showcase database indexing strategies on your past projects.",
  ],
  "cover_letter": "Hi Team, I am reaching out to submit my proposal for the backend architecture project."
}
\`\`\`
Let me know if you need more details!
      `;

      const parsed = extractJSON(markdown);
      const validated = validateAnalysisResult(parsed);

      assert.equal(validated.match_score, 78);
      assert.equal(validated.missing_skills.length, 3);
      assert.equal(validated.fixes.length, 3);
    });

    it("should reject schemas with invalid score, missing reasons, or fewer than 3 fixes", () => {
      // Score out of range
      assert.throws(() => {
        validateAnalysisResult({
          match_score: 150,
          score_reason: "Too high",
          matched_skills: ["A"],
          missing_skills: ["B"],
          fixes: ["1", "2", "3"],
          cover_letter: "Valid cover letter text here..."
        });
      }, /Invalid match_score/);

      // Fewer than 3 fixes
      assert.throws(() => {
        validateAnalysisResult({
          match_score: 80,
          score_reason: "Valid reason",
          matched_skills: ["A"],
          missing_skills: ["B"],
          fixes: ["Only fix 1", "Only fix 2"],
          cover_letter: "Valid cover letter text here..."
        });
      }, /Invalid fixes/);

      // Missing cover letter
      assert.throws(() => {
        validateAnalysisResult({
          match_score: 80,
          score_reason: "Valid reason",
          matched_skills: ["A"],
          missing_skills: ["B"],
          fixes: ["Fix 1", "Fix 2", "Fix 3"],
          cover_letter: ""
        });
      }, /Invalid cover_letter/);
    });
  });

  // ==========================================
  // TEST 2: Retry Mechanism on Invalid JSON
  // ==========================================
  describe("Test 2: LLM Retry Mechanism on Invalid Output", () => {
    it("should retry once if attempt 1 returns invalid JSON and succeed on attempt 2", async () => {
      let callCount = 0;
      const recordedBodies = [];

      const mockFetch = async (url, options) => {
        callCount++;
        recordedBodies.push(JSON.parse(options.body));

        if (callCount === 1) {
          // Attempt 1: Return invalid schema (e.g. missing fixes and invalid JSON)
          return {
            ok: true,
            status: 200,
            json: async () => ({
              message: {
                content: "I am thinking... { match_score: 80, score_reason: 'broken json' "
              }
            })
          };
        }

        // Attempt 2 (Retry): Return perfectly valid schema
        return {
          ok: true,
          status: 200,
          json: async () => ({
            message: {
              content: JSON.stringify({
                match_score: 85,
                score_reason: "Candidate has strong freelance track record.",
                matched_skills: ["FastAPI", "React", "Gemma 4"],
                missing_skills: ["WebSockets"],
                fixes: [
                  "Add WebSocket demo link in proposal.",
                  "Reference past real-time chat architecture.",
                  "Clarify availability for immediate sprint kickoff."
                ],
                cover_letter: "Hello! I saw your post looking for a full-stack developer with Gemma 4 experience..."
              })
            }
          })
        };
      };

      const result = await analyzeJobMatch({
        resumeText: "Experienced full-stack engineer with FastAPI and React background.",
        jobDescription: "Looking for an engineer to build a real-time web application.",
        tone: "Persuasive and concise",
        env: { LLM_MODE: "local" },
        customFetch: mockFetch
      });

      assert.equal(callCount, 2, "Expected exactly 2 calls (initial + retry)");
      assert.equal(result.meta.retried, true, "Result should indicate retried: true");
      assert.equal(result.match_score, 85);
      assert.equal(result.fixes.length, 3);
      assert.match(recordedBodies[1].messages[3].content, /failed validation/);
    });

    it("should throw a clear error if both attempt 1 and retry fail", async () => {
      const failingFetch = async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          message: { content: "Still broken output..." }
        })
      });

      await assert.rejects(
        async () => {
          await analyzeJobMatch({
            resumeText: "Some resume",
            jobDescription: "Some job",
            env: { LLM_MODE: "local" },
            customFetch: failingFetch
          });
        },
        /Model returned invalid format after retry/
      );
    });
  });

  // ==========================================
  // TEST 3: Provider Switch Logic (Cloud vs Local)
  // ==========================================
  describe("Test 3: Provider Switch Logic (Cloud vs. Local Mode)", () => {
    it("should configure CLOUD mode when LLM_MODE is cloud or OLLAMA_API_KEY is present", () => {
      const cloudEnv = {
        OLLAMA_API_KEY: "test_secret_ollama_key_123",
        OLLAMA_MODEL: "gemma4:31b-cloud"
      };

      const config = getProviderConfig(cloudEnv);

      assert.equal(config.mode, "cloud");
      assert.equal(config.model, "gemma4:31b-cloud");
      assert.equal(config.endpoint, DEFAULT_CLOUD_URL);
      assert.equal(config.hasApiKey, true);
      assert.equal(config.badgeText, "Running: Gemma 4 31B (cloud)");
      assert.match(config.privacyNotice, /Ollama Cloud/);
    });

    it("should configure LOCAL mode when LLM_MODE is local, using localhost and private badge", () => {
      const localEnv = {
        LLM_MODE: "local",
        OLLAMA_LOCAL_MODEL: "gemma4:latest",
        OLLAMA_LOCAL_URL: "http://localhost:11434"
      };

      const config = getProviderConfig(localEnv);

      assert.equal(config.mode, "local");
      assert.equal(config.model, "gemma4:latest");
      assert.equal(config.endpoint, "http://localhost:11434/api/chat");
      assert.equal(config.hasApiKey, false);
      assert.equal(config.badgeText, "Running: local (private)");
      assert.match(config.privacyNotice, /never leaves your laptop/);
    });

    it("should include Authorization header in cloud mode and omit it in local mode during fetch", async () => {
      let cloudHeaders = null;
      let localHeaders = null;

      // Cloud test call
      await analyzeJobMatch({
        resumeText: "Resume text",
        jobDescription: "Job text",
        env: {
          LLM_MODE: "cloud",
          OLLAMA_API_KEY: "cloud_key_abc",
          OLLAMA_MODEL: DEFAULT_CLOUD_MODEL
        },
        customFetch: async (url, options) => {
          cloudHeaders = options.headers;
          return {
            ok: true,
            json: async () => ({
              message: {
                content: JSON.stringify({
                  match_score: 90,
                  score_reason: "Fit is great",
                  matched_skills: ["A"],
                  missing_skills: [],
                  fixes: ["Fix 1", "Fix 2", "Fix 3"],
                  cover_letter: "Long enough cover letter to pass validation checks."
                })
              }
            })
          };
        }
      });

      // Local test call
      await analyzeJobMatch({
        resumeText: "Resume text",
        jobDescription: "Job text",
        env: {
          LLM_MODE: "local"
        },
        customFetch: async (url, options) => {
          localHeaders = options.headers;
          return {
            ok: true,
            json: async () => ({
              message: {
                content: JSON.stringify({
                  match_score: 90,
                  score_reason: "Fit is great",
                  matched_skills: ["A"],
                  missing_skills: [],
                  fixes: ["Fix 1", "Fix 2", "Fix 3"],
                  cover_letter: "Long enough cover letter to pass validation checks."
                })
              }
            })
          };
        }
      });

      assert.equal(cloudHeaders["Authorization"], "Bearer cloud_key_abc");
      assert.equal(localHeaders["Authorization"], undefined);
    });
  });
});
