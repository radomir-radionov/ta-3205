#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "==> Building and starting with Docker Compose…"
echo "UI:  http://localhost:8080"
echo "API: http://localhost:3000/api"
echo ""

exec docker compose up --build "$@"
