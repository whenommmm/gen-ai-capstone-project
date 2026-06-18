# 🧑‍💼 AI-Augmented Recruitment Platform

> Screen many CVs. Surface the ones who matter. Explain why.

**🔗 Live demo:** https://gen-ai-capstone-project-ten.vercel.app/

*(First action may take ~50s while the free-tier backend wakes from sleep.)*

A recruitment-augmentation platform built for the Generative AI capstone. It goes
beyond brittle ATS keyword matching to **semantic understanding of fit**, and it
**explains every ranking decision transparently** — then flags bias and drafts
tailored interview questions.

Built with **Python + Streamlit + Google Gemini**.

---

## What it does

1. **Job Description Parser** — turns any free-text JD into structured requirements:
   hard skills, soft skills, experience level, domain, and must-have vs nice-to-have.
2. **CV Ingestion & Parsing** — batch-upload CVs as **PDF / DOCX / TXT**; each is
   parsed into a structured candidate profile (experience, skills, education,
   companies, career trajectory).
3. **Semantic Candidate Scoring** — scores each candidate against the JD by *meaning*,
   not keywords, with a per-category breakdown (hard skills / soft skills / experience / domain).
4. **Explainable Rankings** — for every candidate: why they fit, what gaps exist,
   and what to probe in the interview — specific to that person, never boilerplate.
5. **Bias & Diversity Flags** — audits the shortlist for homogeneity (same schools,
   same pedigree) and surfaces strong candidates with non-traditional backgrounds
   who may be getting overlooked. It flags; it never silently re-ranks.
6. **Interview Question Generator** — tailored questions per candidate that probe
   their actual claimed experience and identified gaps (regenerate on demand).

---

## Quick start

```bash
cd recruitment-platform

python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

# 1. Put your free Gemini API key in .env  (get one at https://aistudio.google.com)
#    GEMINI_API_KEY=your_key_here
#    GEMINI_MODEL=gemini-2.5-flash

# 2. Generate the demo data (1 JD + 20 CVs, mixed PDF/DOCX/TXT)
python generate_samples.py

# 3. (optional) quota-friendly 3-call sanity check of the full pipeline
python mini_test.py

# 4. Launch the app
streamlit run app.py
```

In the UI: **Load sample JD → Parse JD → Load 20 samples → Rank Candidates → Run bias audit.**

---

## Architecture

The system is split into small, single-purpose modules. Every Gemini call goes
through one gateway (`llm.py`), so the model, retry logic, and JSON handling live
in exactly one place.

```
app.py                 Streamlit app: workflow & state management (01 Source → 02 Intake → 03 Analysis)
ui.py                  "Signal / Noise" design system — CSS tokens and UI rendering helpers
.streamlit/config.toml theme configuration (dark theme + amber accent)

llm.py                 Single Gemini gateway — sync + async JSON calls, retry/backoff, rate-limit handling

jd_parser.py           JD text → structured requirements                                  (Feature 1)
cv_parser.py           PDF/DOCX/TXT → raw text (ingestion)                                (Feature 2)

scorer.py              JD + CVs → profile + semantic score + explanation + Qs             (Features 2,3,4,6)

bias.py                Shortlist → homogeneity flags + overlooked candidates              (Feature 5)

interview.py           On-demand regeneration of tailored interview questions             (Feature 6)

generate_samples.py    writes 1 JD + 20 demo CVs (deliberately skewed for the bias demo)
```

**Data flow:** `JD text → jd_parser → structured JD`; `CV files → cv_parser → text`;
`(JD, CV texts) → scorer → ranked results`; `ranked results → bias → audit`.

### Two design decisions worth calling out

- **Candidates are evaluated in groups of 5 per API call.** The free Gemini tier
  allows ~10 requests/minute, so 20 separate calls could never finish under a minute.
  Batching 5 candidates per call means 20 CVs = 4 calls, run concurrently with
  `asyncio` — finishing well under 60 seconds while staying inside the rate limit.
  Each candidate still gets full, individual treatment inside the prompt.
- **One combined call per candidate group** produces the profile, score,
  explanation, and interview questions together. Fewer round-trips = faster batch,
  and the explanation is naturally grounded in the same reasoning that produced the score.

---

## How it meets the acceptance criteria

| Acceptance criterion | How it's met |
|---|---|
| Ranking surfaces the strongest candidates over weaker ones | Semantic scoring + sort; demo data includes clearly weak candidates that rank last |
| Explanations are specific to each candidate, not generic boilerplate | Each explanation cites that candidate's actual experience and gaps |
| Interview questions are demonstrably tailored to each candidate's CV | Questions reference the candidate's real claims and identified gaps |
| System processes a batch of 20+ CVs and returns results in under 60 seconds | Batched concurrent scoring (4 calls for 20 CVs); UI shows a live timer |
| Bias flag triggers correctly on a test batch designed to produce a skewed shortlist | Demo data is intentionally skewed toward elite/traditional pedigrees; the audit flags it and names overlooked non-traditional candidates |

---

## Notes & limitations

- **No database** — everything is in-session by design. Upload, rank, review, done.
  This keeps the focus on the AI, not CRUD plumbing.
- **Free-tier quota is the main constraint.** Limits are *per model, per day*. The
  default `gemini-2.5-flash` gives the best judgement; if you hit its daily cap, switch
  `GEMINI_MODEL` to another working free model (`gemini-2.5-flash-lite`,
  `gemini-3.1-flash-lite`) — each has its own separate daily bucket. One full 20-CV
  demo run costs ~6 API calls (1 JD + 4 scoring batches + 1 bias audit), so plan your
  test runs. A paid key removes the limit entirely.
- The `.env` file holds the API key and is git-ignored.

## Tech stack

Python 3.10+ · Streamlit · google-genai (Gemini) · PyMuPDF · python-docx
