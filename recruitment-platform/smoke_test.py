"""Quick end-to-end check against the live Gemini API. Run: python smoke_test.py"""
import os, glob, time
import jd_parser, cv_parser, scorer, bias as bias_mod

SAMPLE = os.path.join(os.path.dirname(__file__), "sample_data")

with open(os.path.join(SAMPLE, "job_description.txt")) as f:
    jd_text = f.read()

print("Parsing JD…")
jd = jd_parser.parse_jd(jd_text)
print("  title:", jd.get("title"))
print("  must_have:", jd.get("must_have"))

files = sorted(glob.glob(os.path.join(SAMPLE, "cv_*")))
cands = []
for p in files:
    name = os.path.basename(p)
    with open(p, "rb") as f:
        cands.append((name, cv_parser.extract_text(name, f.read())))
print(f"\nIngested {len(cands)} CVs. Scoring concurrently…")

start = time.perf_counter()
results, errors = scorer.evaluate_batch(jd, cands)
elapsed = time.perf_counter() - start
print(f"Scored {len(results)} in {elapsed:.1f}s ({len(errors)} errors)")

print("\nTop 8:")
for i, r in enumerate(results[:8]):
    print(f"  {i+1:>2}. {r['name']:<20} {r['overall_score']:>3}  [{r['profile'].get('background_type','')}]")

print("\nBias audit on top-8 shortlist…")
bz = bias_mod.flag_bias(results, 8)
print("  homogeneous:", bz.get("is_homogeneous"), "| score:", bz.get("homogeneity_score"))
for o in bz.get("overlooked_candidates", []):
    print("  overlooked:", o.get("name"))
