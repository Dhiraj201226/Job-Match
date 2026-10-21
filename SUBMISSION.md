# JobMatch AI: How Google Gemma 4 Turns Freelance Bidding Into an Unfair Advantage

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 2: Side Hustle](https://dev.to/challenges/hacktoberfest-week2-2026-10-12)*

## What I Built

**JobMatch AI** is an intelligent freelance gig and job matching platform built around **Google Gemma 4 31B**. It analyzes candidate resumes against client job descriptions in under 2 seconds, calculates an objective 0–100 match score, pinpoints missing skill gaps, provides 3 actionable fixes, and crafts tailored, high-converting proposals.

### The Problem It Solves
Freelancers and side hustlers on platforms like Upwork, Fiverr, and Contra spend 30–45 minutes customizing bids for every individual client posting. Applying with generic proposals yields a sub-5% interview rate, while manually tailoring resumes, identifying missing requirements, and writing consultative proposals burns hours of unpaid time.

---

## Demo & Visual Product Walkthrough

- **Live Deployed App:** [https://job-match-ai.vercel.app](https://job-match-ai.vercel.app)
- **GitHub Repository:** [https://github.com/Dhiraj201226/Job-Match](https://github.com/Dhiraj201226/Job-Match)

---

### Step 1: The Command Center & 10-Second Quick Try

The landing screen offers instant exploration. Judges and users can upload their own resume (PDF or pasted text) or click one of the **10-Second Judge Quick Try** scenarios (*Full-Stack React & Node MVP* or *Senior AI Application Engineer*) to populate real-world candidate and RFP data with a single click.

![JobMatch AI Home Screen](https://raw.githubusercontent.com/Dhiraj201226/Job-Match/main/screenshots/01_home_screen.png)

> **Radical Privacy Badge:** Notice the top header displaying `Running: local (private)` or `Gemma 4 31B (cloud)`. In local mode, candidate data never leaves the laptop.

---

### Step 2: 0–100 Match Calibration & Skill Diagnostics

Once you click **"Analyze Match & Write Proposal"**, Google Gemma 4 decomposes both documents, returning structured diagnostics in ~1.4 seconds:

![Match Score and Skills Diagnostics](https://raw.githubusercontent.com/Dhiraj201226/Job-Match/main/screenshots/02_score_card.png)

- **Calibrated Match Fit:** An objective 0–100 score (e.g., **82% Match Fit**) with win probability classification.
- **Executive Justification:** 1–2 sentences explaining why the candidate received the score based on tech stack alignment and experience.
- **Matched Skills Tags (Green):** Verified skills satisfying client deliverables (e.g. React 19, TypeScript, Node.js, RESTful APIs).
- **Missing Skills & Gaps (Red):** Explicit client RFP requirements missing from the candidate profile (e.g. Redis, Docker).

---

### Step 3: 3 Concrete Things to Fix & Tailored Proposal Generator

Rather than leaving candidates wondering how to improve, JobMatch AI provides three prioritized action items followed by a client-tailored proposal:

![Actionable Fixes and Proposal](https://raw.githubusercontent.com/Dhiraj201226/Job-Match/main/screenshots/03_actionable_fixes.png)

- **1. Concrete Resume Tweaks:** Actionable bullets telling the candidate exactly what keywords or projects to add to pass screening filters.
- **2. Project Alignment:** Suggestions on how to frame past project metrics to match the client's problem.
- **3. Tailored Proposal Generator:** A ready-to-send Upwork/freelance proposal written in the candidate's chosen tone (*Persuasive Freelancer*, *Technical*, or *Consultative Partner*), complete with a 1-click **"Copy Proposal Text"** button.

---

### Step 4: Opportunity Ranking & Compare Leaderboard (`/saved`)

Freelancers shouldn't bid blindly. The **Opportunity Ranking System** allows candidates to save multiple client RFPs into a ranked pipeline:

![Saved Jobs and Compare Leaderboard](https://raw.githubusercontent.com/Dhiraj201226/Job-Match/main/screenshots/04_saved_leaderboard.png)

- Aggregates portfolio metrics: Total Saved, Top Match (e.g., 94%), Average Score, and Top Category.
- Ranks bids by win rate so freelancers invest their connects and proposal energy where their probability of closing the gig is highest.

---

### Step 5: Transparent Side Hustle Economics

Unit economics make or break a side hustle. JobMatch AI features a transparent freemium pricing structure:

![Pricing and Usage Tiers](https://raw.githubusercontent.com/Dhiraj201226/Job-Match/main/screenshots/05_pricing_tiers.png)

- **Unlimited Free Local Mode:** 100% on-device inference via local Ollama with zero token cost ($0.00).
- **Starter Cloud:** 3 free evaluations on our high-speed Gemma 4 31B cluster.
- **Pro & Agency Tiers:** Scalable monthly subscriptions for active proposal submitters.

---

## Code

{% github Dhiraj201226/Job-Match %}

### Key Architectural Components:
- **`frontend/lib/llm.js`**: Core open-model provider module handling prompt construction, schema validation, and retry mechanics.
- **`api/analyze.js` & `api/status.js`**: Vercel Serverless Edge API functions with zero cold starts and 24/7 uptime.
- **`frontend/src/utils/pdfParser.js`**: Client-side PDF text extraction via Web Workers (`pdfjs-dist`).
- **`frontend/test/llm.test.js`**: Automated unit test suite verifying structured JSON parsing, error recovery, and provider switching (**8/8 tests passed**).

---

## How I Built It

JobMatch AI is built around Google's open-weight model: **Google Gemma 4 31B**.

### Dual-Execution Architecture
JobMatch AI features a single provider layer supporting two switchable modes:

1. **Cloud Mode (`gemma4:31b-cloud`):**
   - Deployed on Vercel's global edge network.
   - Routes inference securely via serverless backend functions to Ollama Cloud.
   - Evaluates complex 1,500+ token resumes and client RFPs in **~1.4 seconds**.
   - API keys are guarded exclusively on the serverless backend.

2. **Local Mode (`gemma4` on `localhost:11434`):**
   - **100% On-Device & Zero Data Leaks.**
   - All candidate data stays locally on your laptop without touching the internet.
   - Compatible with local open models (`gemma4:12b`, `qwen2.5:1.5b`).

### Strict Schema Validation & Self-Correction
Small and mid-sized open models can occasionally produce conversational preamble or markdown code blocks. To guarantee 100% production reliability:
- A custom extraction utility (`extractJSON`) strips code fences and trailing commas.
- A validator verifies schema keys (`match_score`, `score_reason`, `matched_skills`, `missing_skills`, 3 `fixes`, and `cover_letter`).
- If validation fails, an automated **one-time self-correction retry** sends the exact validation error back to Gemma 4 to correct itself before rendering.

---

## Why Does Open Innovation Matter?

In high-volume job seeking and freelance bidding, the model architecture is not an implementation detail — **open models are what make this product work**:

### 1. Cost Per Match vs. The Proprietary API Tax
Commercial closed models charge recurring per-token fees for input context and output generation. A thorough evaluation requires sending a full candidate resume (~1,200 tokens) alongside a lengthy client RFP (~1,000 tokens), plus generating a structured proposal (~800 tokens). At scale, proprietary API fees destroy side-hustle unit economics.  
*With Gemma 4:* In Local mode, the cost per match is **$0.00**. In Cloud mode, open weights allow deployment on cost-effective infrastructure with predictable unit economics.

### 2. Radical Candidate Data Privacy
Resumes contain highly confidential personal identifiable information: legal names, contact details, employer history, salary markers, and proprietary project details.  
With closed APIs, that data is transmitted to third-party proprietary servers. With Gemma 4's open weights, candidates can run evaluations completely **on-device on their own hardware**—guaranteeing 100% confidentiality.

### 3. Freedom from Vendor Lock-In & Portability
Proprietary models are black boxes subject to sudden deprecation, aggressive rate limiting, and unannounced behavioral shifts. Gemma 4's open weights allow developers to:
- Quantize the model (GGUF 4-bit) for edge laptops.
- Deploy dense 31B parameters on dedicated serverless clusters for maximum reasoning.
- Fine-tune on winning freelance proposal corpora without third-party licensing restrictions.

---

## Prize Categories

- **Google Gemma Challenge / Open Model Innovation**
- **Week 2: Side Hustle Challenge**
- **Best On-Device / Local AI Experience**

---

**Author:** [@Dhiraj201226](https://dev.to/dhiraj201226)
