# Fair Value — baholash firmasi sayti (QR tasdiqlash bilan)

Cloudflare Workers'da ishlaydigan to'liq sayt:

| Sahifa | Manzil | Tavsif |
|---|---|---|
| Bosh sahifa | `/` | Xizmatlar, baholash obyektlari, afzalliklar, QR tizimi, ish jarayoni, FAQ, ariza formasi |
| Tekshirish | `/verify` | Hujjat ID sini kiritish yoki telefon kamerasi bilan QR skanerlash |
| QR qisqa havola | `/v/FV-XXXX-XXXX-XX` | QR kod shu manzilni saqlaydi → `/verify?id=...` ga yo'naltiradi |
| Admin panel | `/admin` | Hujjat yaratish, QR olish (PNG / chop etish), PDF yuklash, bekor qilish, arizalar |

Sayt 3 tilda: O'zbek (lotin), Ўзбек (кирилл), Русский.

## QR tasdiqlash qanday ishlaydi

1. Admin `/admin` da yangi hujjat yaratadi (raqam, buyurtmachi, obyekt, qiymat, sana...).
2. Tizim taxmin qilib bo'lmaydigan ID beradi (`FV-7KQ2-M9XA-4T`) va QR kod chizadi.
3. QR kod PNG qilib yuklab olinadi yoki chop etiladi va hisobotga joylashtiriladi.
4. Bank/notarius QR ni skanerlaydi → `/verify` sahifasida:
   - ✅ **Hujjat haqiqiy** — asosiy ma'lumotlar bilan (buyurtmachi ismi yashirilishi mumkin);
   - ⛔ **Bekor qilingan** — admin hujjatni bekor qilgan bo'lsa;
   - ⏰ **Muddati tugagan** — amal qilish muddati o'tgan bo'lsa;
   - ❌ **Topilmadi** — soxta hujjat.
5. Ixtiyoriy: hujjatning asl PDF nusxasi yuklansa, tekshiruvchi uni ko'rib solishtira oladi.

## Tayyor hujjatni QR, imzo va muhr bilan chiqarish

1. **Admin → «Imzo va QR»**: imzo qo'yuvchi F.I.Sh. va lavozimi, imzo va muhr rasmlari
   (oq fon avtomatik olib tashlanadi), standart QR joylashuvi.
2. **Admin → «+ Yangi hujjat»**: ma'lumotlarni to'ldiring va tayyor hisobotni PDF qilib tanlang
   (Word'da: *Fayl → Saqlash → PDF*).
3. «Saqlash» bosilganda brauzerning o'zida PDF ga qo'yiladi:
   - QR kod bloki (oxirgi / har bir / birinchi sahifa, tanlangan burchakda);
   - oxirgi sahifaga imzo va muhr (ixtiyoriy);
   - oxiriga «Tasdiq varag'i» — hujjat ma'lumotlari, katta QR, imzo va muhr (ixtiyoriy).
4. Tayyor PDF serverga saqlanadi, uning SHA-256 izi yoziladi va admin uni ko'rib, yuklab oladi.
5. Tekshiruvchi `/verify` sahifasida qo'lidagi PDF ni tanlab, uning asl nusxa bilan
   **aynan bir xil** ekanini tekshira oladi (fayl brauzerdan chiqmaydi).

Kutubxonalar (`public/assets/vendor/`): pdf-lib (MIT), @pdf-lib/fontkit (MIT),
DejaVu Sans — lotin va kirill harflari bilan qisqartirilgan (bepul litsenziya).

## Joylash (deploy)

```bash
npx wrangler login          # yoki CLOUDFLARE_API_TOKEN=... eksport qiling
./deploy.sh                 # saytni joylaydi va admin parolini so'raydi
```

Keyin Cloudflare dashboard → Workers → `fairvalue` → Settings → Domains orqali
`fairvalue.uz` domenini ulang (QR kodlar joriy domen bilan yaratiladi — domenni
**birinchi hujjatlarni chiqarishdan oldin** ulang).

## Lokal ishga tushirish

```bash
echo 'ADMIN_PASSWORD=test12345' > .dev.vars
npx wrangler dev            # http://localhost:8787
```

## Sozlash

- Telefon, email, manzil, Instagram/Telegram: `public/assets/config.js` (TODO belgilangan joylar).
- Logotip: `public/assets/logo.svg` ni asl logotip bilan almashtiring.
- Matnlar va tarjimalar: `public/assets/i18n.js`.

## Tuzilma

```
fair_value/
  src/worker.js         API + /v/:id yo'naltirish (KV: FV_KV, secret: ADMIN_PASSWORD)
  public/               statik sayt (index, verify, admin, 404)
  wrangler.toml
  deploy.sh
```

## Avtomatik deploy (GitHub Actions)

`.github/workflows/deploy.yml` har push'da saytni Cloudflare'ga joylaydi va
`smoke-test.sh` bilan tekshiradi (hujjat yaratish → QR → PDF va SHA-256 → sozlamalar → bekor qilish → o'chirish).
Repo **Settings → Secrets and variables → Actions** bo'limiga qo'shing:

| Secret | Qiymat |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare token ("Edit Cloudflare Workers" shabloni) |
| `FV_ADMIN_PASSWORD` | `/admin` paroli (kamida 12 belgi) |
| `CLOUDFLARE_ACCOUNT_ID` | ixtiyoriy — token bir nechta akkauntga ega bo'lsa |
