"""Minimal 3-call validation to conserve quota: JD parse + 1 group(3 CVs) + bias."""
import os, glob, time
import jd_parser, cv_parser, scorer, bias as bias_mod

SAMPLE = os.path.join(os.path.dirname(__file__), "sample_data")
with open(os.path.join(SAMPLE, "job_description.txt")) as f:
    jd_text = f.read()

print("[1/3] Parsing JD…")
jd = jd_parser.parse_jd(jd_text)
print("   title:", jd.get("title"), "| must_have count:", len(jd.get("must_have", [])))

# Pick 3 deliberately contrasting CVs: 1 elite, 1 non-traditional, 1 weak.
pick = ["cv_01_aarav_mehta.txt", "cv_13_tariq_hassan.txt", "cv_17_brian_foster.docx"]
cands = []
for name in pick:
    p = os.path.join(SAMPLE, name)
    with open(p, "rb") as f:
        cands.append((name, cv_parser.extract_text(name, f.read())))

print("[2/3] Scoring 3 candidates (1 batch call)…")
start = time.perf_counter()
results, errors = scorer.evaluate_batch(jd, cands)
print(f"   done in {time.perf_counter()-start:.1f}s | errors={len(errors)}")
for i, r in enumerate(results):
    print(f"   {i+1}. {r['name']:<16} score={r['overall_score']:>3} "
          f"[{r['profile'].get('background_type','')}]  Qs={len(r.get('interview_questions',[]))}")
    print(f"      fit: {r.get('fit_summary','')[:110]}")

print("[3/3] Bias audit on top-2 shortlist…")
bz = bias_mod.flag_bias(results, 2)
print("   homogeneous:", bz.get("is_homogeneous"), "| score:", bz.get("homogeneity_score"))
print("   overlooked:", [o.get("name") for o in bz.get("overlooked_candidates", [])])
print("\nALL THREE STAGES OK ✅" if not errors else "\nHAD ERRORS ⚠️")
