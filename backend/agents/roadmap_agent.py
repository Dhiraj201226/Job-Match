import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

def generate_roadmap(missing_skills: list) -> dict:
    prompt = f"""
You are a Career Roadmap Agent.

Missing Skills:
{json.dumps(missing_skills)}

Generate a 3-month roadmap to learn these missing skills.
Include Projects and Resources.

Return JSON only in the following format:
{{
  "roadmap": [
    {{
      "month": "Month 1",
      "focus": "String description of focus",
      "projects": ["Proj1", "Proj2"],
      "resources": ["Res1", "Res2"]
    }},
    {{
      "month": "Month 2",
      "focus": "...",
      "projects": [],
      "resources": []
    }},
    {{
      "month": "Month 3",
      "focus": "...",
      "projects": [],
      "resources": []
    }}
  ]
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
        print(f"Error in roadmap_agent: {e}")
        return {
            "roadmap": [
                {
                    "month": "Month 1",
                    "focus": "Learn SQL basics",
                    "projects": ["Build a simple database"],
                    "resources": ["SQLCourse.com"]
                },
                {
                    "month": "Month 2",
                    "focus": "Learn Docker",
                    "projects": ["Containerize a Python app"],
                    "resources": ["Docker documentation"]
                },
                {
                    "month": "Month 3",
                    "focus": "Learn Power BI",
                    "projects": ["Create a sales dashboard"],
                    "resources": ["Microsoft Learn"]
                }
            ]
        }
