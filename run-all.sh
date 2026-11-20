#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_BIN="${PYTHON_BIN:-python3}"
HOST="${HOST:-0.0.0.0}"

devices=(
  "iphone4:8804"
  "iphone5:8805"
  "iphone11:8811"
  "iphone15:8815"
  "ipadMini:8888"
  "basic:8899"
)

declare -a PIDS=()

cleanup() {
  echo
  echo "Deteniendo los cinco sitios..."
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
}
trap cleanup INT TERM

echo "Fuera de temporada — levantando las cinco páginas y la versión básica"
echo "Servidor: $PYTHON_BIN | Host: $HOST"
echo

for entry in "${devices[@]}"; do
  device="${entry%%:*}"
  port="${entry##*:}"
  (
    cd "$ROOT_DIR/$device"
    "$PYTHON_BIN" server.py --host "$HOST" --port "$port"
  ) >"$ROOT_DIR/$device/server.log" 2>&1 &
  pid=$!
  PIDS+=("$pid")
  sleep 0.25
  if kill -0 "$pid" 2>/dev/null; then
    echo "✓ $device listo en http://127.0.0.1:$port/  (LAN: http://IP-LAN:$port/)"
  else
    echo "✗ $device no pudo iniciar en el puerto $port — revisar $device/server.log"
  fi
done

echo
echo "Todos los sitios están activos. Presioná Ctrl+C para detenerlos."
wait
