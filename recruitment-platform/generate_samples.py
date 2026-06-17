"""
generate_samples.py — writes 1 job description + 20 candidate CVs into sample_data/.

Run once:  python generate_samples.py

The batch is deliberately skewed: most strong candidates share an elite,
traditional pedigree (top CS schools + big-tech), while a few equally-capable
candidates come from non-traditional paths (bootcamp, community college,
self-taught, career switcher). That lets the demo prove two things at once:
the ranking surfaces genuinely strong people, AND the bias module flags a
homogeneous shortlist and points to overlooked non-traditional candidates.

Files are written in a mix of TXT / DOCX / PDF to exercise the ingestion paths.
"""

import os

import fitz  # PyMuPDF, for writing PDF
import docx  # python-docx, for writing DOCX

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "sample_data")

JOB_DESCRIPTION = """\
Senior Machine Learning Engineer

About the role:
We are building production LLM-powered products and need a Senior ML Engineer to
own model training, evaluation, and deployment. You will work across the stack:
data pipelines, model fine-tuning, and serving infrastructure at scale.

Must have:
- 5+ years of software engineering, with 3+ years focused on machine learning
- Strong Python; deep experience with PyTorch or TensorFlow
- Experience taking ML models to production (serving, monitoring, latency)
- Solid grasp of NLP / transformers and modern LLM techniques (RAG, fine-tuning)
- Comfort with cloud infrastructure (AWS, GCP, or Azure)

Nice to have:
- Experience with distributed training and GPU optimization
- Contributions to open-source ML projects
- Experience with vector databases and embeddings
- MLOps tooling (MLflow, Kubeflow, Weights & Biases)

Soft skills:
- Clear written communication; able to explain tradeoffs to non-ML stakeholders
- Mentorship and collaboration in a fast-moving team

Domain: AI / LLM products.
"""

# (name, education, companies, years, summary_lines, school_tier)
# school_tier "elite-traditional" candidates form the homogeneous cluster.
CANDIDATES = [
    ("Aarav Mehta", "M.S. Computer Science, Stanford University", "Google, OpenAI", 7,
     ["Senior ML Engineer at OpenAI working on LLM fine-tuning and RLHF pipelines.",
      "Built distributed training infra on GCP for 70B-param models.",
      "Skills: Python, PyTorch, transformers, RAG, vLLM, Kubernetes, GCP.",
      "Mentored 5 junior engineers; led model-eval working group."], "elite-traditional"),
    ("Priya Nair", "B.S. + M.S. Computer Science, MIT", "Meta AI, Stripe", 8,
     ["ML lead at Meta AI; owned recommendation models serving 1B users.",
      "Deep PyTorch + distributed training (FSDP), GPU optimization on A100 clusters.",
      "Shipped fraud-detection models to production at Stripe with sub-50ms latency.",
      "Skills: Python, PyTorch, TensorFlow, AWS, MLflow, embeddings."], "elite-traditional"),
    ("Daniel Cohen", "Ph.D. Machine Learning, Carnegie Mellon University", "DeepMind, Amazon", 9,
     ["Research engineer at DeepMind; published on transformer efficiency.",
      "Built RAG systems and vector-search pipelines over 100M docs.",
      "Strong in PyTorch, JAX, GPU kernels, distributed training.",
      "Open-source contributor to Hugging Face transformers."], "elite-traditional"),
    ("Sofia Rossi", "M.S. Computer Science, UC Berkeley", "Google, Databricks", 6,
     ["ML engineer at Databricks on MLOps tooling (MLflow core team).",
      "Productionized fine-tuned LLMs with monitoring and latency SLAs.",
      "Skills: Python, PyTorch, MLflow, Kubeflow, AWS, Weights & Biases.",
      "Clear communicator; ran internal ML onboarding."], "elite-traditional"),
    ("James Whitfield", "B.S. Computer Science, Harvard University", "Microsoft, Anthropic", 7,
     ["Engineer at Anthropic on serving infrastructure for large models.",
      "Optimized GPU inference, cut latency 40%.",
      "Skills: Python, PyTorch, CUDA, vLLM, GCP, RAG, embeddings.",
      "Co-authored internal LLM evaluation framework."], "elite-traditional"),
    ("Hannah Kim", "M.S. AI, Stanford University", "Nvidia, Scale AI", 6,
     ["ML engineer at Scale AI building data pipelines and eval for LLMs.",
      "Distributed training on multi-GPU; fine-tuning with LoRA/QLoRA.",
      "Skills: Python, PyTorch, transformers, AWS, vector DBs.",
      "Mentors interns; strong written docs."], "elite-traditional"),
    ("Oliver Schmidt", "M.S. Computer Science, Princeton University", "Google, Cohere", 8,
     ["Senior engineer at Cohere on retrieval-augmented generation.",
      "Owned embeddings + vector DB infra (Pinecone, FAISS).",
      "Skills: Python, PyTorch, TensorFlow, GCP, MLflow, RAG.",
      "Led cross-team model launches."], "elite-traditional"),
    ("Emily Carter", "B.S. + M.S. CS, Caltech", "Apple, OpenAI", 7,
     ["ML engineer at OpenAI on fine-tuning infrastructure.",
      "Built monitoring + eval harnesses for production LLMs.",
      "Skills: Python, PyTorch, Kubernetes, AWS, transformers.",
      "Calm communicator across ML and product."], "elite-traditional"),
    ("Lucas Martin", "M.S. Computer Science, Cornell University", "Meta, Hugging Face", 6,
     ["Engineer at Hugging Face maintaining model-serving libraries.",
      "Open-source: 2k+ GitHub stars on an inference toolkit.",
      "Skills: Python, PyTorch, transformers, RAG, GCP, vLLM.",
      "Writes widely-read technical blog posts."], "elite-traditional"),
    ("Grace Liu", "Ph.D. NLP, University of Washington", "Allen AI, Google", 8,
     ["Research engineer at Allen AI on NLP and transformers.",
      "Productionized QA models; strong eval methodology.",
      "Skills: Python, PyTorch, TensorFlow, AWS, embeddings, MLflow.",
      "Mentor and frequent conference speaker."], "elite-traditional"),
    ("Noah Anderson", "B.S. Computer Science, Georgia Tech", "Salesforce, LinkedIn", 6,
     ["ML engineer at LinkedIn on ranking and recommendations.",
      "Took models to production with A/B testing and monitoring.",
      "Skills: Python, TensorFlow, PyTorch, AWS, Kubeflow.",
      "Solid collaborator, decent written comms."], "elite-traditional"),
    ("Maya Joshi", "M.S. Data Science, Columbia University", "Bloomberg, Two Sigma", 6,
     ["ML engineer in fintech building NLP models on financial text.",
      "Production serving with latency monitoring.",
      "Skills: Python, PyTorch, transformers, AWS, vector DBs.",
      "Explains tradeoffs to non-technical stakeholders."], "elite-traditional"),
    ("Ethan Brooks", "M.S. Computer Science, University of Michigan", "Uber, Pinterest", 7,
     ["Senior ML engineer at Pinterest on large-scale recommendation models.",
      "Owned distributed training (FSDP) and GPU optimization on A100s.",
      "Productionized LLM features with RAG and embeddings; latency monitoring.",
      "Skills: Python, PyTorch, TensorFlow, GCP, MLflow, RAG, vLLM.",
      "Mentors engineers; strong written and verbal communication."], "elite-traditional"),
    # ---- Non-traditional but genuinely strong candidates ----
    ("Tariq Hassan", "Lambda School (coding bootcamp); self-taught ML", "Freelance, Shopify", 5,
     ["Self-taught ML engineer; bootcamp grad who broke into ML through OSS.",
      "Built and shipped a RAG-based customer-support assistant in production at Shopify.",
      "Active open-source contributor to LangChain and a vector-DB client.",
      "Skills: Python, PyTorch, transformers, RAG, AWS, embeddings, vLLM.",
      "Writes clear design docs; mentors in bootcamp alumni community."], "non-traditional"),
    ("Rosa Delgado", "Community college + online ML certificates", "Startups (Series A/B)", 6,
     ["Came up through community college and self-study; now senior IC.",
      "Owned end-to-end ML at two startups: training, serving, monitoring on AWS.",
      "Fine-tuned LLMs with LoRA; built eval pipelines from scratch.",
      "Skills: Python, PyTorch, TensorFlow, RAG, MLflow, embeddings.",
      "Strong written communication; documents everything."], "non-traditional"),
    ("Wei Chen", "Career switcher (former mechanical engineer); self-taught", "Tesla, AI startup", 5,
     ["Switched from mechanical engineering into ML 5 years ago.",
      "Built computer-vision and NLP models in production at Tesla and a startup.",
      "Distributed training on GPUs; latency optimization for serving.",
      "Skills: Python, PyTorch, transformers, GCP, RAG, embeddings.",
      "Translates between ML and hardware teams well."], "non-traditional"),
    ("Amara Okafor", "B.A. Linguistics (no CS degree); self-taught engineer", "NLP startup, Grammarly", 6,
     ["Linguist who became an NLP engineer; deep intuition for language models.",
      "Shipped production NLP features at Grammarly with monitoring.",
      "Fine-tuning + RAG; built evaluation datasets and harnesses.",
      "Skills: Python, PyTorch, transformers, AWS, embeddings, vector DBs.",
      "Exceptional written communication."], "non-traditional"),
    # ---- Clearly weaker candidates (should rank low) ----
    ("Brian Foster", "B.S. Information Technology, state university", "IT support, web agency", 4,
     ["Mostly front-end and web development; some Python scripting.",
      "Took one online ML course; no production ML experience.",
      "Skills: JavaScript, React, HTML/CSS, basic Python.",
      "Eager to move into ML."], "weak"),
    ("Chloe Bennett", "B.A. Marketing", "Marketing agency, e-commerce", 5,
     ["Marketing analyst who uses dashboards and basic SQL.",
      "Some experience with spreadsheet models; no programming depth.",
      "Skills: SQL, Excel, Tableau, light Python.",
      "Strong communicator."], "weak"),
    ("Kevin Park", "B.S. Computer Science, regional university", "Backend dev at SaaS co", 3,
     ["Backend web developer (Java, Spring); no ML in production.",
      "Self-studying ML on weekends; built a toy classifier.",
      "Skills: Java, Spring, SQL, some Python, basic scikit-learn.",
      "Solid engineer but new to ML."], "weak"),
]


def render_cv(name, education, companies, years, lines):
    body = [
        name,
        "=" * len(name),
        f"Experience: {years} years",
        f"Education: {education}",
        f"Companies: {companies}",
        "",
        "Summary:",
    ]
    body += [f"  - {ln}" for ln in lines]
    return "\n".join(body)


def write_txt(path, text):
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)


def write_docx(path, text):
    d = docx.Document()
    for line in text.split("\n"):
        d.add_paragraph(line)
    d.save(path)


def write_pdf(path, text):
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), text, fontsize=11)
    doc.save(path)
    doc.close()


def main():
    os.makedirs(OUT, exist_ok=True)
    # Clear any stale CVs from a previous run so filenames stay in sync.
    import glob
    for old in glob.glob(os.path.join(OUT, "cv_*")):
        os.remove(old)
    write_txt(os.path.join(OUT, "job_description.txt"), JOB_DESCRIPTION)

    formats = [write_txt, write_docx, write_pdf]
    exts = [".txt", ".docx", ".pdf"]

    for i, (name, edu, comp, yrs, lines, _tier) in enumerate(CANDIDATES):
        text = render_cv(name, edu, comp, yrs, lines)
        # rotate formats so we exercise TXT, DOCX, and PDF ingestion
        writer, ext = formats[i % 3], exts[i % 3]
        slug = name.lower().replace(" ", "_")
        writer(os.path.join(OUT, f"cv_{i+1:02d}_{slug}{ext}"), text)

    print(f"Wrote 1 job description + {len(CANDIDATES)} CVs to {OUT}")


if __name__ == "__main__":
    main()
