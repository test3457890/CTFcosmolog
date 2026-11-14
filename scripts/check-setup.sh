#!/bin/sh
# Read-only environment check. No installation, privilege escalation, or reset.
failed=0
printf '%s\n' 'CosmoLog setup check'
if command -v docker >/dev/null 2>&1; then
  docker --version
  if docker info >/dev/null 2>&1; then printf '%s\n' 'Docker service: accessible'; else printf '%s\n' 'Docker service: unavailable or permission denied'; failed=1; fi
else printf '%s\n' 'Docker: missing'; failed=1; fi
if command -v docker-compose >/dev/null 2>&1; then
  docker-compose version || failed=1
elif command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  printf '%s\n' 'Compose plugin: available; classic docker-compose command missing. See docs/Setup.md.'
  failed=1
else printf '%s\n' 'Compose: missing'; failed=1; fi
if command -v curl >/dev/null 2>&1; then
  if curl --max-time 5 -fsS http://127.0.0.1:3000/api/health; then printf '\n%s\n' 'Local app health: reachable'; else printf '%s\n' 'Local app health: not reachable; start the app before checking health'; fi
else printf '%s\n' 'curl: unavailable; check health in the browser'; fi
printf '%s\n' 'Optional analysis commands (GUI alternatives may also be used):'
for tool in tshark exiftool sqlite3 fls icat unzip python3; do
  if command -v "$tool" >/dev/null 2>&1; then printf '  %s: available\n' "$tool"; else printf '  %s: not found\n' "$tool"; fi
done
exit "$failed"
