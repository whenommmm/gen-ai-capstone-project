# Deployment Guide

The app is two services — a **FastAPI backend** (Python) and a **React/TanStack
frontend** (TypeScript). Deploy the backend first, then point the frontend at it.

Both can run on free tiers. Recommended: **Render** (backend) + **Vercel** (frontend).

> ⚠️ Keep the live links unlisted. The free Gemini tier has tight rate limits
> (~10 requests/minute, small daily cap). A public URL can be drained by others and
> break your demo. Share the URLs only with your evaluators.

---

## Step 1 — Backend on Render (free)

1. Go to [render.com](https://render.com) → sign in with GitHub → **New → Blueprint**
   (or **New → Web Service**) and select the `gen-ai-capstone-project` repo.
   - Using **Blueprint** auto-reads `render.yaml` at the repo root.
   - Using **Web Service** (manual), set these fields:
     - **Root Directory:** `recruitment-platform`
     - **Runtime:** Python 3
     - **Build Command:** `pip install -r requirements.txt`
     - **Start Command:** `uvicorn backend:app --host 0.0.0.0 --port $PORT`
2. Add the environment variable (Render dashboard → Environment):
   - `GEMINI_API_KEY` = your key  *(mark as secret — never put it in the repo)*
   - `GEMINI_MODEL` = `gemini-2.5-flash`
3. Deploy. You'll get a URL like `https://recruitment-api.onrender.com`.
4. Verify it's up: open `https://recruitment-api.onrender.com/api/health` →
   should return `{"ok": true, "model": "gemini-2.5-flash"}`.

> Render's free tier sleeps after ~15 min idle, so the first request after a pause
> takes ~50 s to wake. Hit `/api/health` once right before demoing.

---

## Step 2 — Frontend on Vercel (free)

1. Go to [vercel.com](https://vercel.com) → sign in with GitHub → **Add New → Project**
   → import the `gen-ai-capstone-project` repo.
2. Configure the project:
   - **Root Directory:** `recruitment-platform/frontend-lovable/signal-finder`
   - Framework preset: Vercel auto-detects TanStack Start. Leave **Build Command**
     and **Output** at the detected defaults (`bun run build`).
3. Add an environment variable (Vercel → Settings → Environment Variables):
   - `VITE_API_BASE_URL` = your Render backend URL, e.g. `https://recruitment-api.onrender.com`
     **(no trailing slash)**
   - If the build fails on the server preset, also add `NITRO_PRESET` = `vercel`.
4. Deploy. You'll get a URL like `https://gen-ai-capstone-project.vercel.app`.

> `VITE_API_BASE_URL` is baked in **at build time**. If you change the backend URL
> later, you must **redeploy** the frontend for it to take effect.

---

## Step 3 — Verify the live app

1. Open the Vercel URL.
2. The sidebar should show your model name (the frontend reached the backend's
   `/api/health` — confirms the two are wired across the internet).
3. Run the full flow: load a sample brief → Parse the role → Use 20 sample
   candidates → Run analysis → Audit for bias.

---

## Notes

- **CORS** is already open (`allow_origins=["*"]`) so the Vercel domain can call the
  Render backend. To tighten later, replace `"*"` in `backend.py` with your exact
  Vercel URL.
- **Sample data** (the 20 CVs + JDs) is committed, so "Use 20 sample candidates"
  works in production with no extra setup.
- **Alternative hosts:** the backend runs anywhere that runs Python/Docker (Railway,
  Fly.io, Google Cloud Run). The frontend works on Netlify or Cloudflare Pages too —
  nitro auto-detects the host and picks the right build preset.
- **Cost:** both free tiers are sufficient for a capstone demo. The real ceiling is
  the Gemini free-tier quota, not hosting.
