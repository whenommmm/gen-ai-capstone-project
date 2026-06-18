"""
app.py — AI-Augmented Recruitment Platform ("Signal / Noise" UI).

Flow (a real sequence, hence the numbered stages):
  01 SOURCE   — pick / paste a job description, parse it into requirements
  02 INTAKE   — upload or load a batch of CVs (ingested locally)
  03 ANALYSIS — score every candidate, surface the signal, audit for bias

Visual markup lives in ui.py. This file owns flow + state only.
"""

import os
import time
import glob
import math

import streamlit as st

import jd_parser
import cv_parser
import scorer
import bias as bias_mod
import interview
import ui
from llm import MODEL

st.set_page_config(page_title="Signal · Talent Analyzer", page_icon="◉", layout="centered")
st.markdown(ui.CSS, unsafe_allow_html=True)

SAMPLE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sample_data")


def sample_jds():
    """Map a human label -> JD file path, using each file's first line as the label."""
    paths = []
    jd = os.path.join(SAMPLE_DIR, "job_description.txt")
    if os.path.exists(jd):
        paths.append(jd)
    paths += sorted(glob.glob(os.path.join(SAMPLE_DIR, "jd_*.txt")))
    out = {}
    for p in paths:
        with open(p, encoding="utf-8") as f:
            label = next((ln.strip() for ln in f if ln.strip()), os.path.basename(p))
        out[label] = p
    return out


# ----------------------------------------------------------------- session state
for k, v in {"jd_text": "", "jd_parsed": None, "cv_files": [],
             "results": None, "errors": [], "elapsed": None, "bias": None}.items():
    st.session_state.setdefault(k, v)

# ----------------------------------------------------------------- sidebar
with st.sidebar:
    st.markdown('<div class="sg-mark" style="margin-bottom:10px">◉ CONTROL</div>', unsafe_allow_html=True)
    st.caption(f"Model · `{MODEL}`")
    if os.getenv("GEMINI_API_KEY"):
        st.caption("🟡 API key loaded")
    else:
        st.error("No GEMINI_API_KEY in .env")
    shortlist_size = st.slider("Shortlist size — the signal cut", 3, 15, 8)
    st.caption("Everyone below the cut drops to the noise floor.")

# ----------------------------------------------------------------- hero
st.markdown(ui.header(), unsafe_allow_html=True)

# ----------------------------------------------------------------- 01 SOURCE
st.markdown(ui.stage("01", "Source · the role"), unsafe_allow_html=True)
jds = sample_jds()
c1, c2 = st.columns([3, 2])
with c2:
    pick = st.selectbox("Sample brief", list(jds.keys()) or ["—"], label_visibility="collapsed")
    if st.button("Load this brief", use_container_width=True) and jds:
        with open(jds[pick], encoding="utf-8") as f:
            st.session_state.jd_text = f.read()
with c1:
    st.session_state.jd_text = st.text_area(
        "Job description", value=st.session_state.jd_text, height=190,
        label_visibility="collapsed", placeholder="Paste a job description, or load a sample brief →")

if st.button("Parse the role", type="primary", disabled=not st.session_state.jd_text.strip()):
    with st.spinner("Extracting structured requirements…"):
        st.session_state.jd_parsed = jd_parser.parse_jd(st.session_state.jd_text)

if st.session_state.jd_parsed:
    jd = st.session_state.jd_parsed
    st.markdown(
        ui.stats([(jd.get("title", "?"), "role", True),
                  (jd.get("experience_level", "—"), "level", False),
                  (len(jd.get("must_have", [])), "must-haves", False),
                  (len(jd.get("hard_skills", [])), "hard skills", False)]),
        unsafe_allow_html=True)
    a, b = st.columns(2)
    with a:
        st.markdown('<div class="sg-h">Must-have</div>', unsafe_allow_html=True)
        for x in jd.get("must_have", []):
            st.markdown(f"- {x}")
    with b:
        st.markdown('<div class="sg-h">Nice-to-have</div>', unsafe_allow_html=True)
        for x in jd.get("nice_to_have", []):
            st.markdown(f"- {x}")

# ----------------------------------------------------------------- 02 INTAKE
st.markdown(ui.stage("02", "Intake · the pile"), unsafe_allow_html=True)
c1, c2 = st.columns([3, 2])
with c1:
    uploaded = st.file_uploader("Upload CVs (PDF / DOCX / TXT)", type=["pdf", "docx", "txt"],
                                accept_multiple_files=True, label_visibility="collapsed")
with c2:
    if st.button("Load 20 sample CVs", use_container_width=True):
        loaded = []
        for path in sorted(glob.glob(os.path.join(SAMPLE_DIR, "cv_*"))):
            name = os.path.basename(path)
            with open(path, "rb") as f:
                try:
                    loaded.append((name, cv_parser.extract_text(name, f.read())))
                except Exception as e:  # noqa: BLE001
                    st.warning(f"Skipped {name}: {e}")
        st.session_state.cv_files = loaded
        if not loaded:
            st.warning("No samples found. Run `python generate_samples.py` first.")

if uploaded:
    parsed = []
    for uf in uploaded:
        try:
            parsed.append((uf.name, cv_parser.extract_text(uf.name, uf.getvalue())))
        except Exception as e:  # noqa: BLE001
            st.warning(f"Skipped {uf.name}: {e}")
    st.session_state.cv_files = parsed

if st.session_state.cv_files:
    st.markdown(ui.stats([(len(st.session_state.cv_files), "CVs in the pile", True),
                          ("local", "parsed without api", False)]), unsafe_allow_html=True)

# ----------------------------------------------------------------- 03 ANALYSIS
st.markdown(ui.stage("03", "Analysis · the signal"), unsafe_allow_html=True)
ready = bool(st.session_state.jd_parsed) and bool(st.session_state.cv_files)
if not ready:
    st.caption("Parse a role and load some CVs to run the analysis.")

if st.button("Run analysis", type="primary", disabled=not ready):
    n = len(st.session_state.cv_files)
    with st.spinner(f"Scoring {n} candidates against the role…"):
        start = time.perf_counter()
        results, errors = scorer.evaluate_batch(st.session_state.jd_parsed, st.session_state.cv_files)
        st.session_state.elapsed = time.perf_counter() - start
        st.session_state.results = results
        st.session_state.errors = errors
        st.session_state.bias = None

if st.session_state.results is not None:
    results = st.session_state.results
    n = len(results)
    elapsed = st.session_state.elapsed or 0
    cut = min(shortlist_size, n)
    calls = 1 + math.ceil(n / scorer.BATCH_SIZE)

    st.markdown(ui.stats([
        (n, "screened", False),
        (cut, "surfaced", True),
        (f"{elapsed:.0f}s", "under 60s ✓" if elapsed < 60 else "elapsed", False),
        (calls, "api calls", False),
    ]), unsafe_allow_html=True)
    if st.session_state.errors:
        st.warning(f"{len(st.session_state.errors)} group(s) failed: "
                   + "; ".join(name for name, _ in st.session_state.errors))

    # --- signal: the shortlist as full cards
    for i, r in enumerate(results[:cut]):
        st.markdown(ui.candidate_card(i + 1, r), unsafe_allow_html=True)

    # --- regenerate questions for a chosen shortlisted candidate (keeps cards clean)
    names = [f"#{i+1} {r.get('name','?')}" for i, r in enumerate(results[:cut])]
    rc1, rc2 = st.columns([3, 2])
    with rc1:
        target = st.selectbox("Regenerate interview questions for", names, label_visibility="collapsed")
    with rc2:
        if st.button("↻ Regenerate questions", use_container_width=True):
            idx = names.index(target)
            with st.spinner("Rewriting interview signal…"):
                results[idx]["interview_questions"] = interview.generate_questions(
                    st.session_state.jd_parsed, results[idx])
            st.rerun()

    # --- noise floor: everyone below the cut
    if n > cut:
        st.markdown(ui.noise_divider(n - cut), unsafe_allow_html=True)
        for i, r in enumerate(results[cut:], start=cut):
            st.markdown(ui.noise_row(i + 1, r), unsafe_allow_html=True)

    # --- diversity scan
    st.markdown(ui.stage("·", "Diversity scan"), unsafe_allow_html=True)
    if st.button("Audit the shortlist for bias"):
        with st.spinner("Auditing the shortlist for homogeneity…"):
            st.session_state.bias = bias_mod.flag_bias(results, cut)
    if st.session_state.bias:
        st.markdown(ui.bias_panel(st.session_state.bias), unsafe_allow_html=True)
