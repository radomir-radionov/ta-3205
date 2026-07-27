#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

need_install() {
  local dir="$1"
  [[ ! -d "$dir/node_modules" ]] || [[ "$dir/package-lock.json" -nt "$dir/node_modules" ]]
}

echo "==> Installing dependencies (if needed)…"
if need_install backend; then
  (cd backend && npm install)
fi
if need_install frontend; then
  (cd frontend && npm install)
fi

cleanup() {
  echo ""
  echo "==> Stopping…"
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
  wait "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "==> Starting backend (http://localhost:3000/api)…"
(cd backend && npm run start:dev) &
BACKEND_PID=$!

echo "==> Starting frontend (http://localhost:5173)…"
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "UI:  http://localhost:5173"
echo "API: http://localhost:3000/api"
echo "Press Ctrl+C to stop both."
echo ""

wait
