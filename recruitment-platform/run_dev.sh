#!/usr/bin/env bash
# Starts the FastAPI backend (:8000) and the Lovable frontend (:8080) together.
# Stop both with Ctrl+C.
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
FRONTEND="$HERE/frontend-lovable/signal-finder"

echo "→ Backend  : http://localhost:8000  (FastAPI)"
echo "→ Frontend : http://localhost:8080  (open this one)"
echo ""

# Backend
"$HERE/.venv/bin/python" -m uvicorn backend:app --host 0.0.0.0 --port 8000 --app-dir "$HERE" &
BACK_PID=$!

# Frontend
( cd "$FRONTEND" && bun run dev ) &
FRONT_PID=$!

# Kill both children when this script is interrupted.
trap 'echo "stopping…"; kill $BACK_PID $FRONT_PID 2>/dev/null' INT TERM
wait
