import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

def analyze_skill_gap(skills: list, target_role: str) -> dict:
    prompt = f"""
You are a Skill Gap Agent.

Resume Skills:
{json.dumps(skills)}

Target Role:
{target_role}

Find:
1. Missing Skills
2. Missing Tools
3. Missing Certifications

Return JSON only in the following format:
{{
 "missing_skills": [
  "Skill1", "Skill2"
 ]
}}
Combine tools and certifications into the missing_skills list if appropriate, or keep it strictly strings.
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
        print(f"Error in skill_gap_agent: {e}")
        return {
            "missing_skills": ["SQL", "Docker", "Power BI"]
        }
