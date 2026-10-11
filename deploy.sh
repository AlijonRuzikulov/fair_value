#!/usr/bin/env bash
# Fair Value saytini Cloudflare Workers'ga joylash.
# Ishlatish:  CLOUDFLARE_API_TOKEN=xxxx ./deploy.sh
# (yoki oldindan `npx wrangler login` qiling)
set -e
cd "$(dirname "$0")"

if ! grep -q '^\[\[kv_namespaces\]\]' wrangler.toml; then
  echo "==> KV namespace FV_KV yaratilmoqda..."
  OUT=$(npx wrangler kv namespace create FV_KV 2>&1) || true
  echo "$OUT"
  KV_ID=$(echo "$OUT" | grep -oE '"?id"? ?[:=] ?"[0-9a-f]{32}"' | grep -oE '[0-9a-f]{32}' | head -1)
  if [ -z "$KV_ID" ]; then
    KV_ID=$(npx wrangler kv namespace list 2>/dev/null | python3 -c "
import sys, json
for ns in json.load(sys.stdin):
    if ns.get('title', '').endswith('FV_KV'):
        print(ns['id']); break
" 2>/dev/null)
  fi
  [ -z "$KV_ID" ] && { echo "XATO: KV namespace ID aniqlanmadi"; exit 1; }
  printf '\n[[kv_namespaces]]\nbinding = "FV_KV"\nid = "%s"\n' "$KV_ID" >> wrangler.toml
  echo "==> KV ID: $KV_ID (wrangler.toml ga yozildi)"
fi

echo "==> Deploy..."
npx wrangler deploy

if ! npx wrangler secret list 2>/dev/null | grep -q ADMIN_PASSWORD; then
  echo "==> Admin paroli (kamida 12 belgi, kiritilganda ko'rinmaydi):"
  read -rs ADMIN_PASS
  printf '%s' "$ADMIN_PASS" | npx wrangler secret put ADMIN_PASSWORD
fi
echo ""
echo "✅ Tayyor! Admin panel: <sayt manzili>/admin"
