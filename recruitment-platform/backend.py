"""
backend.py — FastAPI server that exposes the AI pipeline to the React frontend.

It's a thin HTTP layer over the existing, tested modules (jd_parser, cv_parser,
scorer, bias, interview). No logic lives here — just request/response plumbing and
CORS so the Lovable dev server can call it.

Run:  uvicorn backend:app --reload --port 8000
  or:  python backend.py
"""

import os
import glob
import math
import time

from fastapi import FastAPI, Form, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json as _json

import jd_parser
import cv_parser
import scorer
import bias as bias_mod
import interview
from llm import MODEL

SAMPLE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sample_data")

app = FastAPI(title="Signal · Talent Analyzer API")

# Dev CORS: allow any origin so the Vite/Bun dev server (whatever port) can call us.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------------------------------------------- request models
class ParseJDRequest(BaseModel):
    jd_text: str


class BiasRequest(BaseModel):
    results: list[dict]
    shortlist_size: int = 10


class RegenRequest(BaseModel):
    jd: dict
    candidate: dict
    n: int = 5


# ----------------------------------------------------------------- helpers
def _sample_brief_files():
    paths = []
    jd = os.path.join(SAMPLE_DIR, "job_description.txt")
    if os.path.exists(jd):
        paths.append(jd)
    paths += sorted(glob.glob(os.path.join(SAMPLE_DIR, "jd_*.txt")))
    return paths


def _load_sample_candidates():
    out = []
    for path in sorted(glob.glob(os.path.join(SAMPLE_DIR, "cv_*"))):
        name = os.path.basename(path)
        with open(path, "rb") as f:
            out.append((name, cv_parser.extract_text(name, f.read())))
    return out


# ----------------------------------------------------------------- endpoints
@app.get("/api/health")
def health():
    # key_set lets us verify the GEMINI_API_KEY env var actually reached this process
    # (without ever exposing the key itself).
    return {"ok": True, "model": MODEL, "key_set": bool(os.getenv("GEMINI_API_KEY"))}


@app.get("/")
def root():
    return {"service": "Signal · Talent Analyzer API", "docs": "/docs", "health": "/api/health"}


@app.get("/api/sample-briefs")
def sample_briefs():
    briefs = []
    for path in _sample_brief_files():
        with open(path, encoding="utf-8") as f:
            text = f.read()
        label = next((ln.strip() for ln in text.splitlines() if ln.strip()),
                     os.path.basename(path))
        briefs.append({
            "id": os.path.splitext(os.path.basename(path))[0],
            "label": label,
            "text": text,
        })
    return {"briefs": briefs}


# parse-jd / bias / regenerate are SYNC defs -> FastAPI runs them in a threadpool,
# so the blocking Gemini calls don't stall the event loop.
@app.post("/api/parse-jd")
def parse_jd(req: ParseJDRequest):
    if not req.jd_text.strip():
        raise HTTPException(status_code=400, detail="Job description is empty.")
    try:
        return jd_parser.parse_jd(req.jd_text)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"Couldn't parse the role: {e}")


@app.post("/api/extract-text")
async def extract_text(file: UploadFile = File(...)):
    """Pull plain text out of an uploaded JD file (PDF/DOCX/TXT). No API call."""
    data = await file.read()
    try:
        text = cv_parser.extract_text(file.filename, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    if not text.strip():
        raise HTTPException(status_code=400, detail="That file had no readable text.")
    return {"text": text}


@app.post("/api/rank")
async def rank(
    jd: str = Form(...),
    shortlist_size: int = Form(10),
    use_samples: str = Form("false"),
    files: list[UploadFile] = File(default=[]),
):
    try:
        jd_obj = _json.loads(jd)
    except _json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="The 'jd' field must be valid JSON.")

    # Build the candidate pile: either the bundled samples or the uploaded files.
    candidates = []
    if use_samples.lower() == "true":
        candidates = _load_sample_candidates()
        if not candidates:
            raise HTTPException(status_code=400,
                                detail="No sample CVs found. Run generate_samples.py first.")
    else:
        for uf in files:
            data = await uf.read()
            try:
                candidates.append((uf.filename, cv_parser.extract_text(uf.filename, data)))
            except ValueError as e:
                raise HTTPException(status_code=400, detail=str(e))
        if not candidates:
            raise HTTPException(status_code=400, detail="No CVs provided.")

    start = time.perf_counter()
    try:
        results, errors = await scorer.evaluate_batch_async(jd_obj, candidates)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"Scoring failed: {e}")
    elapsed = time.perf_counter() - start

    return {
        "count": len(results),
        "elapsed_seconds": round(elapsed, 1),
        "api_calls": math.ceil(len(candidates) / scorer.BATCH_SIZE),
        "errors": [{"file": label, "error": msg} for label, msg in errors],
        "results": results,
    }


@app.post("/api/bias")
def audit_bias(req: BiasRequest):
    if not req.results:
        raise HTTPException(status_code=400, detail="No results to audit.")
    try:
        return bias_mod.flag_bias(req.results, req.shortlist_size)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"Bias audit failed: {e}")


@app.post("/api/regenerate-questions")
def regenerate_questions(req: RegenRequest):
    try:
        questions = interview.generate_questions(req.jd, req.candidate, req.n)
        return {"interview_questions": questions}
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"Couldn't regenerate questions: {e}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend:app", host="0.0.0.0", port=8000, reload=False)
