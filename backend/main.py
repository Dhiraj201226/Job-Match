from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
import io
import random

from agents.resume_agent import analyze_resume
from agents.skill_gap_agent import analyze_skill_gap
from agents.roadmap_agent import generate_roadmap
from agents.interview_agent import generate_interview_questions
from llm_provider import call_gemma, get_provider_config

app = FastAPI(title="JobMatch AI - Gemma 4 Powered")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    config = get_provider_config()
    return {
        "message": "JobMatch AI API is running!",
        "model": config["model"],
        "mode": config["mode"],
        "badge": config["badge_text"]
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/status")
def get_status():
    config = get_provider_config()
    return {
        "mode": config["mode"],
        "model": config["model"],
        "badgeText": config["badge_text"],
        "badgeType": config["mode"]
    }

@app.post("/analyze")
async def analyze_endpoint(
    request: Request,
    role: str = Form(None),
    resume: UploadFile = File(None)
):
    try:
        text = ""
        target_role = role or ""

        # Check if multipart file was sent
        if resume:
            if not resume.filename.endswith('.pdf'):
                raise HTTPException(status_code=400, detail="Only PDF files are supported")
            content = await resume.read()
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
            for page in pdf_reader.pages:
                text += page.extract_text() or ""
        else:
            # Check for JSON payload
            try:
                body = await request.json()
                text = body.get("resumeText") or body.get("resume") or ""
                target_role = body.get("jobDescription") or body.get("role") or target_role
            except Exception:
                pass

        if not text:
            text = "Full-stack engineer with experience building web applications."
        if not target_role:
            target_role = "Senior Software Engineer"

        # Execute Gemma 4 evaluation
        gemma_result = call_gemma(text, target_role)

        # Legacy agent fallbacks for backward compatibility
        try:
            resume_analysis = {"skills": gemma_result.get("matched_skills", [])}
            skill_gap = {"missing_skills": gemma_result.get("missing_skills", [])}
            roadmap = generate_roadmap(gemma_result.get("missing_skills", []))
            interview_qs = generate_interview_questions(target_role, gemma_result.get("matched_skills", []))
        except Exception:
            resume_analysis = {"skills": gemma_result.get("matched_skills", [])}
            skill_gap = {"missing_skills": gemma_result.get("missing_skills", [])}
            roadmap = {"roadmap": []}
            interview_qs = {}

        return {
            "match_score": gemma_result.get("match_score", 85),
            "score_reason": gemma_result.get("score_reason", "Candidate has strong foundational alignment with key job requirements."),
            "matched_skills": gemma_result.get("matched_skills", []),
            "missing_skills": gemma_result.get("missing_skills", []),
            "fixes": gemma_result.get("fixes", []),
            "cover_letter": gemma_result.get("cover_letter", ""),
            "meta": gemma_result.get("meta", {}),
            # Legacy fields for backward compatibility
            "resume_analysis": resume_analysis,
            "skill_gap": skill_gap,
            "roadmap": roadmap.get("roadmap", []),
            "interview_questions": interview_qs
        }
        
    except Exception as e:
        print(f"Error during analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))
