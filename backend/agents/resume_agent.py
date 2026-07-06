import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

def analyze_resume(resume_text: str, target_role: str) -> dict:
    prompt = f"""
You are a Resume Analysis Agent.
Analyze the following resume for the target role of {target_role}.

Resume:
{resume_text}

Extract:
1. Skills (list of strings)
2. Projects (list of strings)
3. Education (string)
4. Strengths (list of strings)

Return JSON only in the following format:
{{
  "skills": [],
  "projects": [],
  "education": "",
  "strengths": []
}}
"""
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.1-8b-instant",
            response_format={"type": "json_object"},
        )
        return json.loads(chat_completion.choices[0].message.content)
    except Exception as e:
        print(f"Error in resume_agent: {e}")
        raise e
