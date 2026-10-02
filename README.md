# Sud tizimlari va jinoyat protsessi solishtiruvi

O'zbekiston va xorijiy davlatlar (Qozog'iston, Turkiya, Germaniya, Fransiya, AQSh, Buyuk Britaniya: Angliya va Uels) jinoyat ishlari bo'yicha sud jarayonini bosqichma-bosqich solishtiruvchi statik veb-sayt. Talabalar va huquqshunoslar uchun.

## Nima bor
- **Jinoyat ishi bo'yicha sud jarayoni:** 20 bosqich: sud muhokamasining umumiy shartlari (tarkib o'zgarmasligi, raislik qiluvchi, prokuror, ishtirok, kelmaslik oqibatlari, qoldirish va to'xtatish, ajrimlar, majlis tartibi, bayonnoma) hamda sud majlisi, sud tergovi, kelishuv, muzokara, hukm, apellyatsiya va kassatsiya.
- **Sud tizimi (umumiy):** tuzilma, konstitutsiyaviy nazorat, sudyalarni tayinlash va muddat, mustaqillik, kengash, xalq ishtiroki, ochiqlik, moliyalashtirish.
- **Ilmiy manbalar** va **Atamalar lug'ati**.
- Har bir ma'lumot yonida manba (modda raqami, havola, olingan sana) va holat belgisi: `tasdiqlangan`, `tekshirilmagan`, `ziddiyatli`.

## Qanday ochiladi
`index.html` ni brauzerda oching (serversiz ishlaydi) yoki GitHub Pages orqali joylashtiring (Settings, Pages, branch `main`, papka `/`).

## Ma'lumotlarni yangilash
1. `data/countries/<kod>.json` (umumiy mezonlar) va `data/procedure/<kod>.json` (sud jarayoni) fayllarini tahrirlang. Shablon: `data/schema.md`.
2. `build.ps1` ni ishga tushiring: u `data/bundle.js` ni yangilaydi (sayt shuni o'qiydi).

```powershell
powershell -ExecutionPolicy Bypass -File build.ps1
```

## Manbalar va sifat
- Jarayon bayonlari asosiy qonun matnlaridan olingan: O'zbekiston (lex.uz), Qozog'iston (adilet.zan.kz), Turkiya (mevzuat.gov.tr), Germaniya (gesetze-im-internet.de), Fransiya (Légifrance ochiq ma'lumotlari), AQSh (Cornell LII nusxalari), Buyuk Britaniya (legislation.gov.uk).
- Qonun matnlarining yuklangan nusxalari katta hajmli va uchinchi tomon saytlaridan olingani uchun repoga kiritilmagan (`sources/` papkasi `.gitignore` da). Har bir qatorda asosiy manba havolasi bor.
- O'zbekcha bayon bu loyiha doirasidagi tarjima. Rasmiy tarjima emas, huquqiy maslahat emas. Tekshiruv tartibi: `TARJIMA_TEKSHIRUV.md`.
- Ilmiy manbalar: `data/scholarship.json` (faqat mazmuni tekshirilganlari asosiy ro'yxatda).

## Cheklovlar
- AQSh uchun faqat federal daraja; shtatlar qoidalari boshqacha.
- Qonunlar o'zgaradi: har bir davlat faylida `updated` sanasi va manba havolasi bor, muhim muddatlarni foydalanishdan oldin rasmiy manbadan tekshiring.

## Litsenziya va muallif
Muallif: **Sud tizimlari solishtiruvi loyihasi** (sources.uz).
Litsenziya: [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 (CC BY-NC-SA 4.0)](LICENSE). Foydalanganda muallifni ko'rsating va havola bering, tijoriy maqsadda ishlatmang, o'zgartirilgan ishni xuddi shu litsenziya bilan tarqating.
Asl qonun matnlari bu litsenziyaga kirmaydi, ular o'z manbalarining shartlariga bo'ysunadi.

## Moddaga to'g'ridan-to'g'ri havolalar
Har bir kartadagi "Moddaga o'tish" tugmalari (masalan, `406-modda`) aynan shu moddaga olib boradi: lex.uz, gesetze-im-internet.de, Cornell LII, legislation.gov.uk, Légifrance va old.adilet.zan.kz da modda manziliga, Turkiyada mevzuat.gov.tr PDF faylining kerakli sahifasiga.
- `tools/build_anchors.js`: hujjat HTML/PDF fayllaridan modda -> manzil jadvalini (`data/anchors.json`) yig'adi (sources/ papkasi yoki internet, pdftotext kerak).
- `tools/links.js`: har bir manbaning `ref` maydonidan havolalarni yasab `links` ga yozadi. `build.ps1` uni avtomatik ishga tushiradi (node kerak).
- Ba'zi saytlar (masalan, Légifrance) avtomatik tekshiruvni bloklaydi, ularning havolalari qo'lda brauzerda tekshirilishi kerak.