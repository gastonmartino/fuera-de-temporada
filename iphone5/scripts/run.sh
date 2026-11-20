#!/usr/bin/env bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PORT="${PORT:-8805}"
HOST="${HOST:-0.0.0.0}"
exec python3 "$PROJECT_DIR/server.py" --host "$HOST" --port "$PORT"
