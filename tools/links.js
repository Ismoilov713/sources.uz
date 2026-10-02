// Har bir manbadagi "ref" (modda raqamlari) dan to'g'ridan-to'g'ri moddaning o'ziga olib boruvchi havolalar yasaydi.
// data/countries/*.json va data/procedure/*.json ichidagi sources[].links massivini yangilaydi (qayta ishga tushirsa ham xavfsiz).
// Jadval: data/anchors.json (tools/build_anchors.js yaratadi).
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const A = JSON.parse(fs.readFileSync(path.join(root, "data", "anchors.json"), "utf8"));

const BASES = {
  uz_jpk: { id: "-111460" }, uz_sud: { id: "-5534923" }, uz_konst: { id: "-6445145" },
  kz_upk: { id: "K1400000231" }, kz_konst: { id: "K2600000000" },
  tr_cmk: { no: "5271" }, tr_5235: { no: "5235" }, tr_anayasa: { no: "2709" }
};

function docOf(url) {
  const u = url || "";
  if (/lex\.uz\/uz\/docs\/-111460/.test(u)) return "uz_jpk";
  if (/lex\.uz\/uz\/docs\/-5534923/.test(u)) return "uz_sud";
  if (/lex\.uz\/uz\/docs\/-6445145/.test(u)) return "uz_konst";
  if (/K1400000231/.test(u)) return "kz_upk";
  if (/K2600000000/.test(u)) return "kz_konst";
  if (/MevzuatNo=5271\b/.test(u)) return "tr_cmk";
  if (/MevzuatNo=5235\b/.test(u)) return "tr_5235";
  if (/MevzuatNo=2709\b/.test(u)) return "tr_anayasa";
  if (/gesetze-im-internet\.de\/stpo\/?$/.test(u)) return "de_stpo";
  if (/gesetze-im-internet\.de\/gvg\/?$/.test(u)) return "de_gvg";
  if (/gesetze-im-internet\.de\/gg\/?$/.test(u)) return "de_gg";
  if (/LEGITEXT000006071154/.test(u)) return "fr_cpp";
  if (/conseil-constitutionnel\.fr\/le-bloc/.test(u)) return "fr_const";
  if (/law\.cornell\.edu\/rules\/frcrmp(\/rule_[\d.]+)?$/.test(u)) return "us_frcrp";
  if (/law\.cornell\.edu\/rules\/frap/.test(u)) return "us_frap";
  if (/law\.cornell\.edu\/rules\/fre/.test(u)) return "us_fre";
  if (/legislation\.gov\.uk\/uksi\/2025\/909/.test(u)) return "uk_crimpr";
  return null;
}
// ref ichidagi bo'lak boshqa hujjatga tegishli bo'lsa, shuni aniqlaydi
function overrideDoc(seg, doc) {
  const m = seg.match(/^\s*(BVerfGG|DRiG|StPO|GVG|GG|Anayasa|CMK)\b/);
  if (!m) return doc;
  return { BVerfGG: "de_bverfgg", DRiG: "de_drig", StPO: "de_stpo", GVG: "de_gvg", GG: "de_gg", Anayasa: "tr_anayasa", CMK: "tr_cmk" }[m[1]] || doc;
}
const SUPMAP = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9" };
const supToDash = s => s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, m => "-" + [...m].map(c => SUPMAP[c]).join(""));

function tokens(seg, doc) {
  let s = seg.replace(/\(([^)]*)\)/g, (m, inner) => (/modda/.test(inner) ? " " + inner + " " : " ")).replace(/\d+(?:–\d+)?-(?:bob|boblar|qism|qismlar)\b:?/g, " ").replace(/\/\d+/g, " ");
  const out = [];
  if (/^de_/.test(doc)) {
    for (const m of s.matchAll(/\b(\d+[a-z]?)\b/g)) out.push({ n: m[1] });
  } else if (/^us_/.test(doc)) {
    for (const m of s.matchAll(/\b(\d+(?:\.\d+)?)\b/g)) out.push({ n: m[1] });
  } else if (doc === "uk_crimpr") {
    for (const m of s.matchAll(/\b(\d+\.\d+)\b/g)) out.push({ n: m[1] });
    for (const m of seg.replace(/\([^)]*\)/g, " ").matchAll(/(\d+)(?:–(\d+))?-qism(?:lar)?/g)) out.push({ n: "part:" + m[1], to: m[2] || null });
  } else {
    const re = /(\d+(?:[⁰¹²³⁴⁵⁶⁷⁸⁹]+)?(?:-\d+)?)(?:\s*–\s*(\d+(?:[⁰¹²³⁴⁵⁶⁷⁸⁹]+)?(?:-\d+)?))?/g;
    for (const m of s.matchAll(re)) out.push({ n: supToDash(m[1]), to: m[2] ? supToDash(m[2]) : null });
  }
  return out;
}

function urlFor(doc, n) {
  const a = A[doc];
  switch (doc) {
    case "uz_jpk": case "uz_sud": case "uz_konst":
      return a && a[n] ? `https://lex.uz/uz/docs/${BASES[doc].id}#${a[n]}` : null;
    case "kz_upk": case "kz_konst":
      return a && a[n] ? `https://old.adilet.zan.kz/rus/docs/${BASES[doc].id}#${a[n]}` : null;
    case "tr_cmk": case "tr_5235": case "tr_anayasa":
      return a && a[n] ? `https://www.mevzuat.gov.tr/MevzuatMetin/1.5.${BASES[doc].no}.pdf#page=${a[n]}` : null;
    case "fr_cpp": return a && a[n] ? `https://www.legifrance.gouv.fr/codes/article_lc/${a[n]}` : null;
    case "fr_const": return `https://www.conseil-constitutionnel.fr/le-bloc-de-constitutionnalite/texte-integral-de-la-constitution-du-4-octobre-1958-en-vigueur#article_${n}`;
    case "de_stpo": return `https://www.gesetze-im-internet.de/stpo/__${n}.html`;
    case "de_gvg": return `https://www.gesetze-im-internet.de/gvg/__${n}.html`;
    case "de_drig": return `https://www.gesetze-im-internet.de/drig/__${n}.html`;
    case "de_bverfgg": return `https://www.gesetze-im-internet.de/bverfgg/__${n}.html`;
    case "de_gg": return `https://www.gesetze-im-internet.de/gg/art_${n}.html`;
    case "us_frcrp": return `https://www.law.cornell.edu/rules/frcrmp/rule_${n}`;
    case "us_frap": return `https://www.law.cornell.edu/rules/frap/rule_${n}`;
    case "us_fre": return `https://www.law.cornell.edu/rules/fre/rule_${n}`;
    case "uk_crimpr": return n.startsWith("part:") ? `https://www.legislation.gov.uk/uksi/2025/909/part/${n.slice(5)}` : `https://www.legislation.gov.uk/uksi/2025/909/rule/${n}`;
  }
  return null;
}
function labelFor(doc, n, to) {
  const r = to ? `${n}–${to}` : n;
  if (/^uz_/.test(doc)) return `${r.replace(/(\d+)-(\d+)/g, (_, a, b) => a + [...b].map(c => "⁰¹²³⁴⁵⁶⁷⁸⁹"[c]).join(""))}-modda`;
  if (/^kz_/.test(doc)) return `${r}-modda`;
  if (/^tr_/.test(doc)) return `m. ${r}`;
  if (doc === "fr_cpp") return `art. ${r}`;
  if (doc === "fr_const" || doc === "de_gg") return `Art. ${r}`;
  if (/^de_/.test(doc)) return `§ ${r}`;
  if (n.startsWith && n.startsWith("part:")) return `${n.slice(5)}${to ? "–" + to : ""}-qism`;
  return `Rule ${r}`;
}

function enrich(source) {
  delete source.links;
  const baseDoc = docOf(source.url);
  if (!baseDoc && /uscode\/text|legislation\.gov\.uk\/ukpga|gesetze-im-internet\.de\/\w+\/(__|art_)|cornell\.edu\/constitution\/|supremecourt\/text/.test(source.url || "")) {
    source.links = [{ label: source.title.replace(/\s*\(.*\)$/, ""), url: source.url }];
    return 1;
  }
  if (!baseDoc || !source.ref) return 0;
  const links = [], seen = new Set();
  for (const seg of String(source.ref).split(";")) {
    const doc = overrideDoc(seg, baseDoc);
    for (const t of tokens(seg, doc)) {
      const url = urlFor(doc, t.n);
      if (!url) continue;
      const key = doc + "|" + t.n;
      if (seen.has(key)) continue;
      seen.add(key);
      const pre = doc !== baseDoc ? ({ de_bverfgg: "BVerfGG ", de_drig: "DRiG ", de_stpo: "StPO ", de_gvg: "GVG ", de_gg: "GG ", tr_anayasa: "Anayasa ", tr_cmk: "CMK " }[doc] || "") : "";
      links.push({ label: pre + labelFor(doc, t.n, t.to), url });
    }
  }
  if (links.length) source.links = links;
  return links.length;
}

let total = 0, withLinks = 0, srcCount = 0;
for (const dir of ["countries", "procedure"]) {
  const d = path.join(root, "data", dir);
  for (const f of fs.readdirSync(d).filter(x => x.endsWith(".json"))) {
    const p = path.join(d, f);
    const j = JSON.parse(fs.readFileSync(p, "utf8").replace(/^﻿/, ""));
    const groups = j.criteria || j.stages || {};
    for (const v of Object.values(groups)) for (const s of v.sources || []) { srcCount++; const n = enrich(s); total += n; if (n) withLinks++; }
    fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
  }
}
console.log(`manbalar: ${srcCount}, moddaga havolali: ${withLinks}, jami modda havolalari: ${total}`);
