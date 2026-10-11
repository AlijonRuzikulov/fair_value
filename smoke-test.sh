#!/usr/bin/env bash
# Joylangan Fair Value saytini to'liq tekshirish.
# Ishlatish: ADMIN_PASSWORD=... ./smoke-test.sh https://fairvalue.xxx.workers.dev
set -uo pipefail
B="${1%/}"
PASS=0; FAIL=0
ok()   { echo "  ✅ $1"; PASS=$((PASS+1)); }
bad()  { echo "  ❌ $1"; FAIL=$((FAIL+1)); }
code() { curl -s -o /dev/null -w '%{http_code}' "$@"; }
# KV yozuvlari bir necha soniyada tarqaladi — holatni bir necha marta tekshiramiz
wait_for() { # $1=tavsif $2=jq filtri $3=url
  for i in $(seq 1 15); do
    out=$(curl -s "$3")
    if echo "$out" | jq -e "$2" >/dev/null 2>&1; then ok "$1"; return; fi
    sleep 3
  done
  bad "$1 — javob: $out"
}

echo "== Sahifalar ($B)"
for p in / /verify /admin /assets/style.css /assets/vendor/html5-qrcode.min.js /assets/vendor/qrcode-generator.js; do
  c=$(code "$B$p"); [ "$c" = 200 ] && ok "GET $p → 200" || bad "GET $p → $c"
done
c=$(code "$B/bunday-sahifa-yoq"); [ "$c" = 404 ] && ok "Noma'lum sahifa → 404" || bad "Noma'lum sahifa → $c"
home=$(curl -s "$B/")
grep -q "FAIR VALUE" <<<"$home" && ok "Bosh sahifada FAIR VALUE bor" || bad "Bosh sahifa mazmuni"

echo "== Admin kirish"
c=$(code -X POST "$B/api/admin/login" -H 'Content-Type: application/json' -d '{"password":"notogri-parol"}')
[ "$c" = 401 ] && ok "Noto'g'ri parol → 401" || bad "Noto'g'ri parol → $c"
c=$(code "$B/api/docs"); [ "$c" = 401 ] && ok "Tokensiz /api/docs → 401" || bad "Tokensiz /api/docs → $c"
TOKEN=$(curl -s -X POST "$B/api/admin/login" -H 'Content-Type: application/json' \
  -d "$(jq -nc --arg p "$ADMIN_PASSWORD" '{password:$p}')" | jq -r '.token // empty')
if [ -z "$TOKEN" ]; then bad "To'g'ri parol bilan kirish"; echo "Natija: $PASS ✅ / $FAIL ❌"; exit 1; fi
ok "To'g'ri parol bilan kirish"
AUTH=(-H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json')

echo "== Hujjat yaratish va QR tekshiruv"
ID=$(curl -s -X POST "$B/api/docs" "${AUTH[@]}" -d '{"number":"TEST/0001","client":"Test Mijoz","object":"Avtomatik test hujjati","value":"1000000","issueDate":"2026-01-01"}' | jq -r '.doc.id // empty')
[[ "$ID" =~ ^FV-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{2}$ ]] && ok "Hujjat yaratildi: $ID" || bad "Hujjat yaratish (ID: '$ID')"
loc=$(curl -s -o /dev/null -w '%{redirect_url}' "$B/v/$ID")
[[ "$loc" == *"/verify?id=$ID" ]] && ok "QR havola /v/$ID → /verify?id=$ID" || bad "QR yo'naltirish → '$loc'"
wait_for "Tekshiruv: hujjat HAQIQIY" '.found == true and .doc.status == "valid"' "$B/api/verify/$ID"
wait_for "Buyurtmachi ismi yashirilgan (T*** M****)" '.doc.client | test("^T\\*+ M\\*+$")' "$B/api/verify/$ID"
wait_for "Ichki izoh ochiq API'da yo'q" '.doc | has("note") | not' "$B/api/verify/$ID"

echo "== PDF"
printf '%%PDF-1.4\n%% test\n' > /tmp/fv-test.pdf
c=$(code -X PUT "$B/api/docs/$ID/file" -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/pdf' --data-binary @/tmp/fv-test.pdf)
[ "$c" = 200 ] && ok "PDF yuklandi" || bad "PDF yuklash → $c"
c=$(code -X PUT "$B/api/docs/$ID/file" -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/pdf' --data-binary 'not a pdf')
[ "$c" = 400 ] && ok "PDF bo'lmagan fayl rad etildi" || bad "PDF bo'lmagan fayl → $c"
wait_for "PDF tekshiruv sahifasida ko'rinadi" '.doc.hasFile == true and (.doc.fileUrl | length > 0)' "$B/api/verify/$ID"
SHA=$(sha256sum /tmp/fv-test.pdf | cut -d' ' -f1)
wait_for "PDF raqamli izi (SHA-256) to'g'ri saqlangan" ".doc.sha256 == \"$SHA\"" "$B/api/verify/$ID"
got=$(curl -s "$B/api/verify/$ID/file" | sha256sum | cut -d' ' -f1)
[ "$got" = "$SHA" ] && ok "Yuklab olingan PDF asl nusxa bilan bir xil" || bad "Yuklab olingan PDF izi: $got"

echo "== Imzo va QR sozlamalari"
c=$(code "$B/api/settings"); [ "$c" = 401 ] && ok "Tokensiz /api/settings → 401" || bad "Tokensiz /api/settings → $c"
st=$(curl -s "$B/api/settings" "${AUTH[@]}")
echo "$st" | jq -e '.settings | has("qrPages") and has("signatureImg")' >/dev/null && ok "Sozlamalar o'qiladi" || bad "Sozlamalar: $st"
c=$(code -X PUT "$B/api/settings" "${AUTH[@]}" -d '{"signatureImg":"data:text/html;base64,PHNjcmlwdD4="}')
[ "$c" = 400 ] && ok "Rasm bo'lmagan imzo rad etildi" || bad "Noto'g'ri imzo rasmi → $c"

echo "== Bekor qilish"
c=$(code -X PUT "$B/api/docs/$ID" "${AUTH[@]}" -d '{"status":"revoked","revokeReason":"Avtomatik test"}')
[ "$c" = 200 ] && ok "Hujjat bekor qilindi" || bad "Bekor qilish → $c"
wait_for "Tekshiruv: BEKOR QILINGAN" '.doc.status == "revoked" and .doc.revokeReason == "Avtomatik test" and .doc.fileUrl == null' "$B/api/verify/$ID"

echo "== Soxta hujjat"
c=$(code "$B/api/verify/FV-ZZZZ-ZZZZ-ZZ"); [ "$c" = 404 ] && ok "Soxta ID → topilmadi (404)" || bad "Soxta ID → $c"

echo "== Tozalash"
c=$(code -X DELETE "$B/api/docs/$ID" "${AUTH[@]}"); [ "$c" = 200 ] && ok "Test hujjati o'chirildi" || bad "O'chirish → $c"
wait_for "O'chirilgan hujjat endi topilmaydi" '.found == false' "$B/api/verify/$ID"
curl -s -o /dev/null -X POST "$B/api/admin/logout" "${AUTH[@]}"

echo ""
echo "Natija: $PASS ✅ / $FAIL ❌"
[ "$FAIL" = 0 ]
