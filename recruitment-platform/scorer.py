"""
scorer.py — the heart of the pipeline (Core Features #2, #3, #4, #6).

For each candidate we produce: a structured profile (#2), a semantic score with
a per-category breakdown (#3), a candidate-specific explanation (#4), and
tailored interview questions (#6).

Why we evaluate candidates in GROUPS of `BATCH_SIZE` per API call:
the free Gemini tier allows only ~10 requests/minute, so 20 separate calls can
never finish in under a minute. Packing 5 candidates into one call means a batch
of 20 CVs is just 4 calls — which run concurrently and finish well under 60s,
while staying inside the rate limit. Each candidate still gets full, individual
treatment inside the prompt.
"""

import json
import asyncio

from llm import generate_json_async

BATCH_SIZE = 5  # candidates evaluated per API call (tuned for the 10 req/min free tier)

_SYSTEM = (
    "You are an expert technical recruiter who evaluates candidates on SEMANTIC fit, "
    "not keyword overlap. A candidate who 'built a distributed cache from scratch' shows "
    "systems skill even if the JD said 'Redis'. You reward transferable and adjacent "
    "experience, you are fair to non-traditional backgrounds, and every judgement is "
    "grounded in evidence from that candidate's CV. You evaluate each candidate "
    "independently — one candidate's strength never changes another's score."
)


def _eval_shape():
    return """{
    "profile": {
      "name": "candidate name, or 'Unknown'",
      "years_experience": 0,
      "current_title": "...",
      "skills": ["..."],
      "education": ["degree, institution"],
      "companies": ["employers"],
      "career_trajectory": "1-2 sentence summary of their career arc",
      "background_type": "one of: traditional, non-traditional, career-switcher, self-taught"
    },
    "overall_score": 0,
    "breakdown": {"hard_skills": 0, "soft_skills": 0, "experience": 0, "domain": 0},
    "fit_summary": "2-3 sentences on what makes THIS candidate a fit, with specifics",
    "gaps": ["specific gaps vs the requirements"],
    "probe_in_interview": ["specific topics to explore for this candidate"],
    "interview_questions": ["3-5 tailored questions referencing their real experience and gaps"]
  }"""


async def _evaluate_group_async(jd, group):
    """group: list of (source_file, raw_text). Returns list of eval dicts in order."""
    blocks = []
    for i, (fname, text) in enumerate(group):
        blocks.append(f"--- CANDIDATE {i+1} (file: {fname}) ---\n{text[:6000]}")
    candidates_text = "\n\n".join(blocks)

    prompt = f"""Evaluate the {len(group)} candidates below against the job's requirements.

For EACH candidate, in order:
  STEP 1 — parse the resume into a structured profile.
  STEP 2 — score SEMANTICALLY (by meaning, not keyword matching), all scores 0-100.
  STEP 3 — explain the decision, specific to THAT candidate (no boilerplate).
  STEP 4 — write interview questions tailored to that candidate's claims and gaps.

JOB REQUIREMENTS (already structured, JSON):
{json.dumps(jd, indent=2)}

CANDIDATES:
{candidates_text}

Return ONLY JSON with this shape — the "candidates" array MUST have exactly
{len(group)} items, one per candidate, in the SAME ORDER as above:
{{
  "candidates": [
    {_eval_shape()}
  ]
}}
Reward semantic and transferable fit. Be specific and evidence-based for each."""

    out = await generate_json_async(prompt, system=_SYSTEM, temperature=0.3)
    evals = out.get("candidates", []) if isinstance(out, dict) else out

    # Map each eval back to its source file by position; tolerate length mismatch.
    results = []
    for i, (fname, _) in enumerate(group):
        if i < len(evals):
            r = evals[i]
            r["source_file"] = fname
            r["name"] = r.get("profile", {}).get("name", "Unknown")
            results.append(r)
    return results


def _chunk(items, size):
    return [items[i:i + size] for i in range(0, len(items), size)]


async def evaluate_batch_async(jd, candidates):
    """
    candidates: list of (source_file, raw_text).
    Returns (results_sorted_best_first, errors).
    """
    groups = _chunk(candidates, BATCH_SIZE)
    raw = await asyncio.gather(*[_evaluate_group_async(jd, g) for g in groups],
                               return_exceptions=True)

    results, errors = [], []
    for group, outcome in zip(groups, raw):
        if isinstance(outcome, Exception):
            errors.append((f"{len(group)} CVs ({group[0][0]}…)", str(outcome)))
        else:
            results.extend(outcome)

    results.sort(key=lambda r: r.get("overall_score", 0), reverse=True)
    return results, errors


def evaluate_batch(jd, candidates):
    """Sync wrapper so Streamlit (which runs synchronously) can call the async batch."""
    return asyncio.run(evaluate_batch_async(jd, candidates))
