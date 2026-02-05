#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
PAGES_DIR="${PAGES_DIR:-"$ROOT/../ccoc-pages"}"

if [[ ! -d "$PAGES_DIR/.git" ]]; then
  echo "ERROR: No encuentro un repo git en: $PAGES_DIR" >&2
  echo "Crea/clona primero el repo público `ccoc-pages` en esa ruta, o exporta PAGES_DIR." >&2
  exit 1
fi

rsync -a --delete \
  --exclude '.git' \
  --exclude '.vscode' \
  --exclude 'CCOC' \
  --exclude 'CDOC' \
  --exclude 'imagen.txt' \
  --exclude 'README.md' \
  --exclude '.gitignore' \
  "$ROOT/" "$PAGES_DIR/"

touch "$PAGES_DIR/.nojekyll"

pushd "$PAGES_DIR" >/dev/null
git add -A

if git diff --cached --quiet; then
  echo "Sin cambios para publicar."
  popd >/dev/null
  exit 0
fi

git commit -m "Publish landing $(date +%Y-%m-%d)"
git push
popd >/dev/null

echo "Publicado: https://gedeondt.github.io/ccoc-pages/"

