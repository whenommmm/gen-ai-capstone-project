"""
interview.py — Interview Question Generator (Core Feature #6), on-demand.

Tailored interview questions are produced for every candidate inside scorer.py
(in the same call, for speed). This module exists for the interactive case: when
a recruiter wants to *regenerate* or go deeper on one specific candidate, the UI
calls `generate_questions` here. Same model, a focused prompt.
"""

import json

from llm import generate_json

_SYSTEM = (
    "You are a senior interviewer. You write sharp, specific interview questions that "
    "probe a candidate's actual claimed experience and their gaps for THIS role. You "
    "avoid generic questions that could be asked of anyone."
)


def generate_questions(jd, result, n=5):
    profile = result.get("profile", {})
    prompt = f"""Write {n} interview questions for this candidate, tailored to the role.

ROLE: {jd.get('title')} ({jd.get('experience_level')})
MUST-HAVES: {json.dumps(jd.get('must_have', []))}

CANDIDATE PROFILE:
{json.dumps(profile, indent=2)}

KNOWN GAPS: {json.dumps(result.get('gaps', []))}

Return ONLY JSON: {{"interview_questions": ["...", "..."]}}

Each question must reference something concrete from this candidate's background
or a specific gap. No generic "tell me about a challenge" questions."""

    out = generate_json(prompt, system=_SYSTEM, temperature=0.4)
    return out.get("interview_questions", [])
