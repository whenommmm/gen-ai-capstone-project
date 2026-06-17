"""
jd_parser.py — Job Description Parser (Core Feature #1).

Turns a free-text JD into structured requirements so the rest of the pipeline
has something concrete to score against: hard skills, soft skills, experience
level, domain, and the all-important must-have vs nice-to-have split.
"""

from llm import generate_json

_SYSTEM = (
    "You are an expert technical recruiter. You read job descriptions and extract "
    "precise, structured requirements. You distinguish mandatory requirements from "
    "bonuses, and you never invent requirements that aren't in the text."
)


def parse_jd(jd_text):
    prompt = f"""Extract structured requirements from the job description below.

Return ONLY JSON with EXACTLY this shape:
{{
  "title": "the role title",
  "domain": "industry / domain area, e.g. fintech, healthcare, infra",
  "experience_level": "e.g. Junior, Mid, Senior, or '5+ years'",
  "hard_skills": ["concrete technical skills / tools / languages"],
  "soft_skills": ["communication, leadership, etc."],
  "must_have": ["requirements that are mandatory / dealbreakers"],
  "nice_to_have": ["requirements that are bonuses, not dealbreakers"],
  "responsibilities": ["key things this person will do"]
}}

JOB DESCRIPTION:
\"\"\"
{jd_text}
\"\"\"
"""
    return generate_json(prompt, system=_SYSTEM, temperature=0.1)
