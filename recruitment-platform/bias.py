"""
bias.py — Bias & Diversity Flags (Core Feature #5).

After ranking, this looks at the shortlist (the top-N the recruiter would
actually interview) and asks: is this shortlist suspiciously homogeneous? Are
there strong candidates with non-traditional backgrounds sitting just below the
cut who deserve a second look? It returns flags and concrete suggestions —
it never silently re-ranks. The recruiter stays in control.
"""

import json

from llm import generate_json

_SYSTEM = (
    "You are a hiring-fairness auditor. You detect when a shortlist is homogeneous "
    "(same schools, same employer pedigree, same career path) and you surface strong "
    "candidates with non-traditional backgrounds who may be getting overlooked. You are "
    "factual and constructive, never preachy."
)


def flag_bias(results, shortlist_size):
    """
    results: full ranked list from scorer (best-first).
    shortlist_size: how many the recruiter intends to interview.
    """
    shortlist = results[:shortlist_size]
    below_cut = results[shortlist_size:shortlist_size + 8]  # near-miss candidates

    def slim(r):
        p = r.get("profile", {})
        return {
            "name": r.get("name"),
            "score": r.get("overall_score"),
            "education": p.get("education"),
            "companies": p.get("companies"),
            "background_type": p.get("background_type"),
        }

    prompt = f"""Audit this candidate shortlist for homogeneity and overlooked diversity.

SHORTLIST (the {shortlist_size} candidates the recruiter plans to interview):
{json.dumps([slim(r) for r in shortlist], indent=2)}

STRONG CANDIDATES JUST BELOW THE CUT:
{json.dumps([slim(r) for r in below_cut], indent=2)}

Return ONLY JSON with EXACTLY this shape:
{{
  "is_homogeneous": true,
  "homogeneity_score": 0,
  "patterns": ["concrete patterns you see, e.g. 'all 4 attended elite CS programs'"],
  "overlooked_candidates": [
    {{"name": "...", "reason": "why this near-miss candidate deserves a look"}}
  ],
  "recommendations": ["concrete, actionable suggestions for the recruiter"]
}}

homogeneity_score is 0-100 (higher = more homogeneous). If the shortlist is
genuinely diverse, say so honestly and set is_homogeneous to false."""

    return flag_bias_from_prompt(prompt)


def flag_bias_from_prompt(prompt):
    return generate_json(prompt, system=_SYSTEM, temperature=0.2)
