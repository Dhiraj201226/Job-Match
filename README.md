# CareerPilot AI - Job-Match

An AI-powered application designed to analyze a user's resume against a target role and provide a personalized roadmap for upskilling, along with interview preparation questions.

## Problem (SDG 8: Decent Work and Economic Growth)
- Skill-job mismatch
- Graduate unemployment
- Lack of personalized guidance

## Solution
CareerPilot AI helps students identify skill gaps and become job-ready through personalized AI-generated roadmaps.

## Architecture

This project uses a pseudo-agentic workflow using FastAPI for the backend and Vite+React for the frontend.

1. **Resume Analysis Agent**: Extracts skills, projects, and strengths.
2. **Skill Gap Agent**: Identifies missing skills for the target role.
3. **Roadmap Agent**: Generates a 3-month upskilling roadmap.
4. **Interview Agent**: Generates HR, Technical, and Behavioral questions.

## Setup

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. Add your `GROQ_API_KEY` to `.env`
4. Run with `uvicorn main:app --reload`

### Frontend
1. `cd frontend`
2. `npm install`
3. Run with `npm run dev`
