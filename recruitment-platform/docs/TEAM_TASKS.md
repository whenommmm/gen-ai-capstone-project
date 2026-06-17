# Team Tasks — finish your piece and commit it

Each person owns one small, real change below. Make **your** edit, confirm the app
still runs, then commit and push **from your own GitHub account** so the contribution
shows under your name. Each task is self-contained — you won't step on anyone else's.

> First time? Set up once:
> ```bash
> git clone <repo-url> && cd gen-ai-capstone-project/recruitment-platform
> python3 -m venv .venv && source .venv/bin/activate
> pip install -r requirements.txt
> cp .env.example .env        # then paste the team's GEMINI_API_KEY into .env
> ```

---

## Ayush — add `.env.example`
**Why:** lets new teammates set up without hunting for env-var names, and keeps the real key out of git.

1. Create a new file `recruitment-platform/.env.example` containing exactly:
   ```
   GEMINI_API_KEY=your_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```
2. Commit:
   ```bash
   git add recruitment-platform/.env.example
   git commit -m "chore: add .env.example for setup"
   git push
   ```

---

## Nirbhay — make the batch size configurable (`scorer.py`)
**Why:** different API quotas need different batch sizes; this makes it tunable without editing code.

1. Open `recruitment-platform/scorer.py`.
2. At the top, beside `import json`, add a line: `import os`
3. Find:
   ```python
   BATCH_SIZE = 5  # candidates evaluated per API call (tuned for the 10 req/min free tier)
   ```
   Change it to:
   ```python
   BATCH_SIZE = int(os.getenv("SCORER_BATCH_SIZE", "5"))  # candidates per API call; override via env
   ```
4. Commit:
   ```bash
   git add recruitment-platform/scorer.py
   git commit -m "feat: allow batch size override via SCORER_BATCH_SIZE"
   git push
   ```

---

## Shreyas — add an API root info route (`backend.py`)
**Why:** hitting `http://localhost:8000/` currently 404s; this returns a friendly pointer to the docs and health check.

1. Open `recruitment-platform/backend.py`.
2. Directly **after** the `@app.get("/api/health")` function, add:
   ```python
   @app.get("/")
   def root():
       return {"service": "Signal · Talent Analyzer API", "docs": "/docs", "health": "/api/health"}
   ```
3. Commit:
   ```bash
   git add recruitment-platform/backend.py
   git commit -m "feat: add API root info endpoint"
   git push
   ```

---

## Ojas — tighten the default shortlist (frontend)
**Why:** 8 is a more realistic default interview shortlist than 10 for most roles.

1. Open `recruitment-platform/frontend-lovable/signal-finder/src/routes/index.tsx`.
2. Find:
   ```tsx
   const [shortlistSize, setShortlistSize] = useState(10);
   ```
   Change `10` to `8`.
3. Commit:
   ```bash
   git add recruitment-platform/frontend-lovable/signal-finder/src/routes/index.tsx
   git commit -m "tweak: default shortlist size to 8"
   git push
   ```

---

### Before you push
- Pull first so you're up to date: `git pull --rebase`
- Make sure your git identity is your own:
  ```bash
  git config user.name "Your Name"
  git config user.email "your-github-email@example.com"
  ```
- Understand your change well enough to explain it — that's the point of owning it.
