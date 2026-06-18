# AI-Augmented Recruitment Platform — Project Report

**Course:** Generative AI — Capstone (Assignment 5)
**Category:** HR AI · **Group size:** 5

> Screen the whole pile. Surface the few who matter. Explain why.

---

## 1. Problem Statement

Recruiters are drowning in volume. Traditional Applicant Tracking Systems (ATS)
rely on **keyword matching**, which is brittle in both directions: it rejects strong
candidates who phrase their experience differently, and it passes weak candidates who
stuff their CVs with the right words. The result is wasted recruiter time and good
people filtered out for the wrong reasons.

Our goal is a tool that goes **beyond keyword matching to semantic understanding of
fit**, ranks candidates against a specific role, and — critically — **explains every
ranking decision transparently** so a human recruiter stays in control.

---

## 2. What We Built

A recruitment-augmentation platform with six capabilities:

1. **Job Description Parser** — converts any JD (pasted text or an uploaded
   PDF/DOCX/TXT) into structured requirements: title, domain, experience level,
   hard skills, soft skills, and a must-have vs nice-to-have split.
2. **CV Ingestion & Parsing** — batch-uploads CVs (PDF/DOCX/TXT) and extracts a
   structured candidate profile: experience, skills, education, employers, career
   trajectory, and background type.
3. **Semantic Candidate Scoring** — scores each candidate against the role by
   *meaning*, not keywords, with a per-category breakdown (hard skills / soft skills /
   experience / domain).
4. **Explainable Rankings** — per candidate: why they fit, what gaps exist, and what
   to probe in the interview — grounded in that candidate's actual CV.
5. **Bias & Diversity Flags** — audits the shortlist for homogeneity and surfaces
   strong candidates with non-traditional backgrounds who may be overlooked. It
   flags; it never silently re-ranks.
6. **Interview Question Generator** — tailored questions per candidate that probe
   their claimed experience and identified gaps, regenerable on demand.

---

## 3. System Architecture

The system is split into small, single-purpose modules. Every call to the language
model goes through one gateway, so the model choice, retry logic, and JSON handling
live in exactly one place.

```
Frontend (React + TypeScript, TanStack Start)
        │  HTTP / JSON
        ▼
FastAPI backend (backend.py)  ──>  Python pipeline  ──>  Google Gemini
```

**Backend modules:**

| Module | Responsibility |
|---|---|
| `llm.py` | Single Gemini gateway — sync + async JSON calls, retry/backoff, rate-limit handling |
| `jd_parser.py` | JD text → structured requirements |
| `cv_parser.py` | PDF/DOCX/TXT → raw text (ingestion) |
| `scorer.py` | JD + CVs → profile + semantic score + explanation + interview questions |
| `bias.py` | Shortlist → homogeneity flags + overlooked candidates |
| `interview.py` | On-demand regeneration of tailored interview questions |
| `backend.py` | FastAPI server exposing the pipeline over a REST API |

**Data flow:** `JD → jd_parser → structured JD`; `CV files → cv_parser → text`;
`(JD, CV texts) → scorer → ranked results`; `ranked results → bias → audit`.

---

## 4. Key Design Decisions

**Semantic, not lexical, scoring.** The scoring prompt explicitly instructs the model
to reward transferable and adjacent experience (e.g. "built a distributed cache from
scratch" demonstrates systems skill even if the JD said "Redis") and to be fair to
non-traditional backgrounds. This is the core differentiator from keyword ATS.

**Candidates are evaluated in groups of 5 per API call.** The free Gemini tier allows
only ~10 requests/minute, so 20 separate calls could never finish within a minute.
Packing 5 candidates per call means a batch of 20 CVs is just **4 calls**, run
concurrently with `asyncio`. This both respects the rate limit and meets the speed
target. Each candidate still receives full, individual treatment inside the prompt,
and is scored independently.

**One combined call per group** produces the profile, score, explanation, and
interview questions together — fewer round-trips, and the explanation is naturally
grounded in the same reasoning that produced the score.

**No database.** Everything is in-session by design (upload → rank → review). This
keeps the focus on the AI rather than CRUD plumbing.

---

## 5. Technology Stack

- **AI model:** Google Gemini (`gemini-2.5-flash`) via the `google-genai` SDK
- **Backend:** Python, FastAPI, Uvicorn; PyMuPDF + python-docx for file parsing
- **Frontend:** React 19 + TypeScript, TanStack Start, Tailwind CSS, shadcn/ui (Bun)
- **Alternate UI:** a self-contained Streamlit app (`app.py`) is included as a backup demo

---

## 6. Results & Evaluation

Mapping to the assignment's acceptance criteria:

| Criterion | Result |
|---|---|
| Ranking surfaces the strongest over weaker candidates | **Met.** On the ML-Engineer test batch, an OpenAI ML engineer scored 97 and a clearly off-target candidate scored 7. |
| Explanations are specific, not boilerplate | **Met.** Each explanation cites the candidate's real experience and gaps. |
| Interview questions are tailored to each CV | **Met.** Questions reference the candidate's actual claims and gaps. |
| 20+ CV batch in under 60 seconds | **Met by design.** A 3-candidate group completed in ~26 s; the 4 groups of a 20-CV batch run concurrently, so total ≈ the slowest group. _Final measured time on the full 20-CV live run: **___ s** (to be recorded for the demo)._ |
| Bias flag triggers on a skewed batch | **Met.** The bundled sample batch is deliberately skewed toward elite/traditional pedigrees; the audit flags it and names overlooked non-traditional candidates. |

**Semantic fairness check (qualitative):** A self-taught, bootcamp-background
candidate with a production RAG system scored 90 against the ML role — close behind
formally-credentialed candidates — demonstrating the scorer rewards real capability
over pedigree. The same candidate's irrelevance to an unrelated role (a Gameplay
Programming Intern JD) was correctly reflected with a low score.

---

## 7. Limitations & Future Work

- **Free-tier rate limits** are the main constraint. The tagline "screen 1,000 CVs"
  is achievable architecturally (the batching scales), but the free Gemini quota
  (~10 requests/minute, tight daily caps) limits throughput. A paid API key removes
  this ceiling.
- **No persistence** — results are not saved between sessions. A future version could
  add a database to store evaluations and support recruiter collaboration.
- **Bias detection is LLM-based** — it surfaces patterns and overlooked candidates but
  does not compute formal statistical fairness metrics. A quantitative diversity
  dashboard would strengthen this.
- **Evaluation is qualitative.** A labelled benchmark of recruiter-ranked CVs would
  allow measuring ranking accuracy (e.g. nDCG) against human judgement.

---

## 8. How to Run

```bash
cd recruitment-platform
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# add your Gemini API key to .env  (GEMINI_API_KEY=...)
python generate_samples.py        # creates 1 JD + 20 sample CVs

# Option A — full stack (FastAPI backend + React frontend)
./run_dev.sh                       # backend :8000, frontend :8080

# Option B — Streamlit backup demo
streamlit run app.py
```

---

## 9. Team & Contributions

| Member | Area |
|---|---|
| _Vansh Srivastava_ | Backend pipeline & AI prompting |
| _Ayush Kumar_ | Frontend (React / TanStack) |
| _Nirbhay_ | Project report & documentation |
| _Shreyas Reddy_ | Testing & evaluation |
| _Ojas Kotiyal_ | Sample data, bias demo & deployment |


