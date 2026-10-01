# Sud tizimlari va jinoyat protsessi solishtiruvi

O'zbekiston va xorijiy davlatlar (Qozog'iston, Turkiya, Germaniya, Fransiya, AQSh) jinoyat ishlari bo'yicha sud jarayonini bosqichma-bosqich solishtiruvchi statik veb-sayt. Talabalar va huquqshunoslar uchun.

## Nima bor
- **Jinoyat ishi bo'yicha sud jarayoni:** 12 bosqich (sudga tayyorlash, sud tarkibi, ishtirok, majlis, ayblov va aybga munosabat, ayblovni o'zgartirish, sud tergovi, kelishuv, muzokara va oxirgi so'z, hukm, apellyatsiya, kassatsiya).
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
- Jarayon bayonlari asosiy qonun matnlaridan olingan: O'zbekiston (lex.uz), Qozog'iston (adilet.zan.kz), Turkiya (mevzuat.gov.tr), Germaniya (gesetze-im-internet.de), Fransiya (Légifrance ochiq ma'lumotlari), AQSh (Cornell LII nusxalari).
- Qonun matnlarining yuklangan nusxalari katta hajmli va uchinchi tomon saytlaridan olingani uchun repoga kiritilmagan (`sources/` papkasi `.gitignore` da). Har bir qatorda asosiy manba havolasi bor.
- O'zbekcha bayon bu loyiha doirasidagi tarjima. Rasmiy tarjima emas, huquqiy maslahat emas. Tekshiruv tartibi: `TARJIMA_TEKSHIRUV.md`.
- Ilmiy manbalar: `data/scholarship.json` (faqat mazmuni tekshirilganlari asosiy ro'yxatda).

## Cheklovlar
- AQSh uchun faqat federal daraja; shtatlar qoidalari boshqacha.
- Qonunlar o'zgaradi: har bir davlat faylida `updated` sanasi va manba havolasi bor, muhim muddatlarni foydalanishdan oldin rasmiy manbadan tekshiring.
