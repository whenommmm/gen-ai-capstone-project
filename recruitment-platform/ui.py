"""
ui.py — the "Signal / Noise" design system for the platform.

Design thesis: the product extracts SIGNAL (the few candidates who matter) from
NOISE (a large CV pile). The interface is built like a precision signal analyzer
— dark instrument panels, a single warm amber accent, and match values rendered
as meters that fill on load. The shortlist is the signal; everyone below the cut
sits under a literal "noise floor" divider.

All visual markup lives here so app.py can stay focused on flow. Functions return
HTML strings; app.py injects them with st.markdown(unsafe_allow_html=True).
"""

import html

# ----------------------------------------------------------------- design tokens
CSS = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600&display=swap');

:root{
  --void:#07100F; --slate:#0B1413; --panel:#11201E; --panel2:#18302C;
  --line:#244039; --mist:#8FA8A2; --text:#E6F2EF;
  --signal:#2DD4BF; --signal-dim:#123029; --good:#6BBF8A; --warn:#E0654E;
}

/* base */
.stApp{ background:
  radial-gradient(1200px 600px at 80% -10%, #11161f 0%, var(--slate) 55%) fixed;
  color:var(--text); font-family:'Inter',sans-serif; }
[data-testid="stHeader"]{ background:transparent; }
#MainMenu, footer, [data-testid="stToolbar"], [data-testid="stDecoration"],
.stDeployButton, [data-testid="stStatusWidget"]{ display:none !important; visibility:hidden; }
.block-container{ max-width:980px; padding-top:1.2rem; }
code{ color:var(--signal) !important; background:rgba(242,169,59,.08) !important;
  font-family:'Space Mono',monospace !important; }

h1,h2,h3{ font-family:'Space Grotesk',sans-serif; letter-spacing:-0.01em; }
p,li,label,span{ color:var(--text); }

/* ---- header / hero ---- */
.sg-header{ border-top:2px solid var(--signal); background:linear-gradient(180deg,#11161f,transparent);
  padding:22px 24px 18px; margin:-4px 0 6px; position:relative; overflow:hidden; }
.sg-header::after{ content:""; position:absolute; inset:0; pointer-events:none;
  background:repeating-linear-gradient(0deg, rgba(242,169,59,.04) 0 1px, transparent 1px 5px); }
.sg-mark{ font-family:'Space Mono',monospace; font-size:12px; letter-spacing:.42em;
  color:var(--signal); text-transform:uppercase; display:flex; align-items:center; gap:10px; }
.sg-mark .dot{ width:9px; height:9px; border-radius:50%; background:var(--signal);
  box-shadow:0 0 12px var(--signal); animation:sg-pulse 2.6s ease-in-out infinite; }
.sg-title{ font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:40px;
  line-height:1.02; margin:10px 0 6px; letter-spacing:-0.025em; }
.sg-title em{ font-style:normal; color:var(--signal); }
.sg-tag{ color:var(--mist); font-size:15px; max-width:46ch; }

/* ---- stage eyebrows (a real sequence: source -> intake -> analysis) ---- */
.sg-stage{ display:flex; align-items:baseline; gap:12px; margin:30px 0 8px; }
.sg-stage .n{ font-family:'Space Mono',monospace; color:var(--signal); font-size:13px; }
.sg-stage .t{ font-family:'Space Grotesk',sans-serif; text-transform:uppercase;
  letter-spacing:.22em; font-size:13px; color:var(--mist); }
.sg-stage .rule{ flex:1; height:1px; background:var(--line); }

/* ---- readout stats ---- */
.sg-stats{ display:flex; gap:10px; flex-wrap:wrap; margin:8px 0 4px; }
.sg-stat{ flex:1; min-width:120px; background:var(--panel); border:1px solid var(--line);
  border-radius:10px; padding:14px 16px; }
.sg-stat .v{ font-family:'Space Mono',monospace; font-size:26px; color:var(--text); }
.sg-stat .v.amber{ color:var(--signal); }
.sg-stat .k{ font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.2em;
  color:var(--mist); text-transform:uppercase; margin-top:2px; }

/* ---- candidate signal card ---- */
.sg-card{ background:var(--panel); border:1px solid var(--line); border-radius:14px;
  padding:18px 20px; margin:12px 0; transition:border-color .2s, transform .2s; }
.sg-card:hover{ border-color:var(--signal); }
.sg-card-top{ display:flex; align-items:center; gap:16px; }
.sg-rank{ font-family:'Space Mono',monospace; font-size:13px; color:var(--signal);
  border:1px solid var(--signal); border-radius:8px; padding:4px 8px; }
.sg-id{ flex:1; }
.sg-name{ font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:19px;
  letter-spacing:.01em; }
.sg-sub{ color:var(--mist); font-size:12.5px; margin-top:1px; }
.sg-score-wrap{ text-align:right; }
.sg-score{ font-family:'Space Mono',monospace; font-weight:700; font-size:34px;
  color:var(--signal); line-height:1; }
.sg-score-label{ font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.25em;
  color:var(--mist); }

.sg-meters{ display:grid; grid-template-columns:1fr 1fr; gap:8px 22px; margin:16px 0 4px; }
.sg-meter{ display:flex; align-items:center; gap:10px; }
.sg-meter-k{ font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.12em;
  color:var(--mist); width:46px; text-transform:uppercase; }
.sg-track{ flex:1; height:7px; background:var(--signal-dim); border-radius:4px; overflow:hidden; }
.sg-fill{ height:100%; background:linear-gradient(90deg,#1f9e8c,var(--signal));
  border-radius:4px; transform-origin:left; animation:sg-fill .9s cubic-bezier(.2,.7,.2,1) both; }
.sg-meter-v{ font-family:'Space Mono',monospace; font-size:12px; color:var(--text); width:24px; text-align:right; }

.sg-fit{ color:var(--text); font-size:14px; line-height:1.5; margin:14px 0 4px;
  padding-left:12px; border-left:2px solid var(--signal); }
.sg-cols{ display:grid; grid-template-columns:1fr 1fr; gap:22px; margin-top:14px; }
.sg-h{ font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.2em;
  color:var(--mist); text-transform:uppercase; margin:14px 0 6px; }
.sg-card ul{ margin:0; padding-left:16px; }
.sg-card li{ font-size:13px; color:#cfd6e0; margin:3px 0; line-height:1.45; }
.sg-q li{ color:var(--text); }
.sg-tagchip{ display:inline-block; font-family:'Space Mono',monospace; font-size:10px;
  letter-spacing:.1em; color:var(--signal); border:1px solid var(--line);
  border-radius:20px; padding:2px 10px; margin-left:8px; }

/* ---- noise floor (below the cut) ---- */
.sg-noise-head{ display:flex; align-items:center; gap:12px; margin:26px 0 6px; }
.sg-noise-head .t{ font-family:'Space Mono',monospace; font-size:11px; letter-spacing:.22em;
  color:var(--mist); text-transform:uppercase; }
.sg-noise-head .rule{ flex:1; height:1px;
  background:repeating-linear-gradient(90deg,var(--line) 0 4px, transparent 4px 8px); }
.sg-noise{ display:flex; align-items:center; gap:14px; padding:9px 14px; border:1px solid var(--line);
  border-radius:9px; margin:6px 0; background:rgba(22,27,35,.5); opacity:.82; }
.sg-noise:hover{ opacity:1; }
.sg-noise-rank{ font-family:'Space Mono',monospace; font-size:12px; color:var(--mist); width:22px; }
.sg-noise-name{ flex:1; font-size:14px; }
.sg-noise-name small{ color:var(--mist); margin-left:8px; font-size:12px; }
.sg-noise-track{ width:120px; height:5px; background:var(--line); border-radius:3px; overflow:hidden; }
.sg-noise-score{ font-family:'Space Mono',monospace; font-size:13px; color:var(--mist); width:24px; text-align:right; }

/* ---- diversity scan ---- */
.sg-bias{ border-radius:14px; padding:18px 20px; margin:12px 0;
  border:1px solid var(--line); background:var(--panel); }
.sg-bias.flagged{ border-color:var(--warn); }
.sg-bias.clear{ border-color:var(--good); }
.sg-bias .verdict{ font-family:'Space Grotesk',sans-serif; font-size:18px; font-weight:600; }
.sg-bias .verdict.flagged{ color:var(--warn); }
.sg-bias .verdict.clear{ color:var(--good); }

/* ---- restyle native streamlit controls ---- */
.stButton>button{ font-family:'Space Mono',monospace !important; text-transform:uppercase;
  letter-spacing:.12em; font-size:12px; background:var(--panel2); color:var(--text);
  border:1px solid var(--line); border-radius:9px; padding:8px 16px; transition:.18s; }
.stButton>button:hover{ border-color:var(--signal); color:var(--signal); }
.stButton>button[kind="primary"]{ background:var(--signal); color:#1a1206; border-color:var(--signal); font-weight:700; }
.stButton>button[kind="primary"]:hover{ filter:brightness(1.08); color:#1a1206; }
[data-testid="stTextArea"] textarea, .stSelectbox div[data-baseweb="select"]>div{
  background:var(--panel) !important; color:var(--text) !important; border-color:var(--line) !important; }
[data-testid="stTextArea"] textarea:focus{ border-color:var(--signal) !important; box-shadow:none !important; }
[data-testid="stFileUploader"] section{ background:var(--panel); border:1px dashed var(--line); border-radius:11px; }
[data-testid="stFileUploader"] section:hover{ border-color:var(--signal); }
[data-testid="stSpinner"] i{ border-top-color:var(--signal) !important; }
.stSlider [data-baseweb="slider"] div[role="slider"]{ background:var(--signal); }
hr{ border-color:var(--line); }

@keyframes sg-fill{ from{transform:scaleX(0)} to{transform:scaleX(1)} }
@keyframes sg-pulse{ 0%,100%{opacity:1} 50%{opacity:.35} }
@media (prefers-reduced-motion: reduce){ .sg-fill,.sg-mark .dot{ animation:none } }
</style>
"""


def _esc(x):
    return html.escape(str(x if x is not None else ""))


def header():
    return """
<div class="sg-header">
  <div class="sg-mark"><span class="dot"></span>SIGNAL · TALENT ANALYZER</div>
  <div class="sg-title">Surface the signal.<br><em>Explain the call.</em></div>
  <div class="sg-tag">Screen the whole pile. Hear the few candidates who matter through
  the noise — scored on meaning, not keywords, with every judgement on the record.</div>
</div>
"""


def stage(n, title):
    return f'<div class="sg-stage"><span class="n">{n}</span><span class="t">{_esc(title)}</span><span class="rule"></span></div>'


def stats(items):
    """items: list of (value, label, amber_bool)."""
    cells = "".join(
        f'<div class="sg-stat"><div class="v {"amber" if amber else ""}">{_esc(v)}</div>'
        f'<div class="k">{_esc(k)}</div></div>'
        for v, k, amber in items
    )
    return f'<div class="sg-stats">{cells}</div>'


def _meter(label, value, delay):
    v = max(0, min(100, int(value or 0)))
    return (
        f'<div class="sg-meter"><div class="sg-meter-k">{_esc(label)}</div>'
        f'<div class="sg-track"><div class="sg-fill" style="width:{v}%;animation-delay:{delay:.2f}s"></div></div>'
        f'<div class="sg-meter-v">{v}</div></div>'
    )


def _list(items):
    return "".join(f"<li>{_esc(i)}</li>" for i in (items or [])) or "<li>—</li>"


def candidate_card(rank, r):
    p = r.get("profile", {})
    b = r.get("breakdown", {})
    sub_bits = [p.get("current_title", ""), ", ".join(p.get("companies", [])[:2]),
                f"{p.get('years_experience','?')} yrs"]
    sub = " · ".join(x for x in sub_bits if x)
    bg = p.get("background_type", "")
    meters = (
        _meter("HARD", b.get("hard_skills"), 0.00) + _meter("EXP", b.get("experience"), 0.12)
        + _meter("SOFT", b.get("soft_skills"), 0.06) + _meter("DOMAIN", b.get("domain"), 0.18)
    )
    return f"""
<div class="sg-card">
  <div class="sg-card-top">
    <div class="sg-rank">{rank:02d}</div>
    <div class="sg-id">
      <div class="sg-name">{_esc(r.get('name','Unknown'))}<span class="sg-tagchip">{_esc(bg)}</span></div>
      <div class="sg-sub">{_esc(sub)}</div>
    </div>
    <div class="sg-score-wrap"><div class="sg-score">{int(r.get('overall_score',0))}</div>
      <div class="sg-score-label">MATCH</div></div>
  </div>
  <div class="sg-meters">{meters}</div>
  <div class="sg-fit">{_esc(r.get('fit_summary',''))}</div>
  <div class="sg-cols">
    <div><div class="sg-h" style="margin-top:0">Gaps</div><ul>{_list(r.get('gaps'))}</ul></div>
    <div><div class="sg-h" style="margin-top:0">Probe in interview</div><ul>{_list(r.get('probe_in_interview'))}</ul></div>
  </div>
  <div class="sg-h">Interview signal</div>
  <ul class="sg-q">{_list(r.get('interview_questions'))}</ul>
</div>
"""


def noise_divider(count):
    return (f'<div class="sg-noise-head"><span class="t">Noise floor · {count} below the cut</span>'
            f'<span class="rule"></span></div>')


def noise_row(rank, r):
    p = r.get("profile", {})
    sub = p.get("current_title", "") or (", ".join(p.get("companies", [])[:1]))
    score = int(r.get("overall_score", 0))
    return f"""
<div class="sg-noise">
  <div class="sg-noise-rank">{rank:02d}</div>
  <div class="sg-noise-name">{_esc(r.get('name','Unknown'))}<small>{_esc(sub)}</small></div>
  <div class="sg-noise-track"><div class="sg-fill" style="width:{score}%"></div></div>
  <div class="sg-noise-score">{score:02d}</div>
</div>
"""


def bias_panel(bz):
    flagged = bool(bz.get("is_homogeneous"))
    cls = "flagged" if flagged else "clear"
    score = bz.get("homogeneity_score", "?")
    verdict = (f"Shortlist looks homogeneous — homogeneity {score}/100"
               if flagged else f"Shortlist looks balanced — homogeneity {score}/100")
    parts = [f'<div class="sg-bias {cls}"><div class="verdict {cls}">{_esc(verdict)}</div>']
    if bz.get("patterns"):
        parts.append('<div class="sg-h">Patterns detected</div><ul>' + _list(bz["patterns"]) + "</ul>")
    if bz.get("overlooked_candidates"):
        ol = "".join(f"<li><b>{_esc(o.get('name','?'))}</b> — {_esc(o.get('reason',''))}</li>"
                     for o in bz["overlooked_candidates"])
        parts.append(f'<div class="sg-h">Strong candidates you may be overlooking</div><ul>{ol or "<li>—</li>"}</ul>')
    if bz.get("recommendations"):
        parts.append('<div class="sg-h">Recommendations</div><ul>' + _list(bz["recommendations"]) + "</ul>")
    parts.append("</div>")
    return "".join(parts)
