from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
import io
import random

from agents.resume_agent import analyze_resume
from agents.skill_gap_agent import analyze_skill_gap
from agents.roadmap_agent import generate_roadmap
from agents.interview_agent import generate_interview_questions

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/analyze")
async def analyze_endpoint(role: str = Form(...), resume: UploadFile = File(...)):
    if not resume.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        content = await resume.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
            
        if not text:
            text = "Could not extract text from PDF."

        # Agent 1: Resume Analysis
        resume_analysis = analyze_resume(text, role)
        skills = resume_analysis.get("skills", [])
        
        # Agent 2: Skill Gap
        skill_gap = analyze_skill_gap(skills, role)
        missing_skills = skill_gap.get("missing_skills", [])
        
        # Agent 3: Roadmap
        roadmap = generate_roadmap(missing_skills)
        
        # Agent 4: Interview Questions
        interview_qs = generate_interview_questions(role, skills)
        
        # Calculate a mock match score based on skills found vs missing
        total_skills = len(skills) + len(missing_skills)
        match_score = int((len(skills) / total_skills) * 100) if total_skills > 0 else random.randint(40, 85)

        return {
            "match_score": match_score,
            "resume_analysis": resume_analysis,
            "skill_gap": skill_gap,
            "roadmap": roadmap.get("roadmap", []),
            "interview_questions": interview_qs
        }
        
    except Exception as e:
        print(f"Error during analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))
