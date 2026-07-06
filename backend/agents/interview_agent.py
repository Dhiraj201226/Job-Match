import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

def generate_interview_questions(target_role: str, skills: list) -> dict:
    prompt = f"""
You are an Interview Preparation Agent.

Target Role: {target_role}
Current Skills: {json.dumps(skills)}

Generate:
10 HR Questions
10 Technical Questions
5 Behavioral Questions

Return JSON only in the following format:
{{
  "hr_questions": ["Q1", "Q2", "... (10 total)"],
  "technical_questions": ["Q1", "Q2", "... (10 total)"],
  "behavioral_questions": ["Q1", "Q2", "... (5 total)"]
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
            model="llama3-8b-8192",
            response_format={"type": "json_object"},
        )
        return json.loads(chat_completion.choices[0].message.content)
    except Exception as e:
        print(f"Error in interview_agent: {e}")
        return {
            "hr_questions": [f"HR Q{i}" for i in range(1, 11)],
            "technical_questions": [f"Tech Q{i}" for i in range(1, 11)],
            "behavioral_questions": [f"Behavioral Q{i}" for i in range(1, 6)]
        }
