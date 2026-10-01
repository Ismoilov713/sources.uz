# Ma'lumot shabloni (har bir davlat uchun `data/countries/<kod>.json`)

Har bir davlat faylida bir xil `criteria` kalitlari bo'ladi, shunda solishtirish avtomatik ishlaydi.

Har bir mezon (`criteria.<kalit>`) tuzilishi:

```json
{
  "summary": "Qisqa o'zbekcha bayon",
  "status": "tasdiqlangan | tekshirilmagan | ziddiyatli",
  "sources": [
    { "title": "Hujjat nomi", "ref": "130-modda", "url": "https://...", "retrieved": "2026-10-01" }
  ]
}
```

Qoida: `status = "tasdiqlangan"` faqat asosiy manbaning (qonun matni, rasmiy sayt) o'zida modda/bo'lim ko'rsatilganda qo'yiladi.
Tarjima bo'lsa, `original` maydoniga asl matn qisqa iqtibos sifatida qo'shiladi.

## Mezon kalitlari
- `legal_family` — huquq tizimi
- `structure` — sud pog'onalari
- `constitutional_review` — konstitutsiyaviy nazorat
- `judge_appointment` — sudyalarni tayinlash/saylash
- `judge_term` — vakolat muddati
- `judicial_independence` — mustaqillik kafolatlari
- `judicial_council` — sudyalar kengashi
- `public_participation` — hakamlar hay'ati va fuqarolar ishtiroki
- `openness_language` — ochiqlik va sud ishi tili
- `financing` — moliyalashtirish
