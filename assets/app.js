const CRITERIA = {
  legal_family: "Huquq tizimi",
  structure: "Sud pog'onalari",
  constitutional_review: "Konstitutsiyaviy nazorat",
  judge_appointment: "Sudyalarni tayinlash va saylash",
  judge_term: "Sudyalar vakolat muddati",
  judicial_independence: "Sudyalar mustaqilligi",
  judicial_council: "Sudyalar kengashi",
  public_participation: "Hakamlar hay'ati va fuqarolar ishtiroki",
  openness_language: "Ochiqlik va sud ishi tili",
  financing: "Moliyalashtirish"
};
// Jinoyat ishi bo'yicha sudda ish yuritish bosqichlari (tartib bo'yicha)
const STAGES = {
  trial_prep: "Ishni sudda ko'rishga tayyorlash",
  court_composition: "Sud tarkibi",
  composition_stability: "Sud tarkibining o'zgarmasligi, zaxira sudya va hakam",
  presiding_judge: "Raislik qiluvchining vakolati va majlisni boshqarish",
  prosecutor_role: "Prokuror ishtiroki va ayblovdan voz kechish",
  defendant_presence: "Sudlanuvchining ishtiroki",
  absence_others: "Jabrlanuvchi, himoyachi va boshqalar kelmasligi oqibatlari",
  scope_change_charge: "Muhokama doirasi, ayblovni o'zgartirish, ishni tugatish",
  adjourn_suspend: "Muhokamani qoldirish, to'xtatish va qayta boshlash",
  interim_rulings: "Ehtiyot chorasi va muhokama paytidagi ajrimlar",
  courtroom_order: "Majlis tartibi va tartibbuzarlarga choralar",
  trial_record: "Majlis bayonnomasi va mulohazalar",
  opening: "Sud majlisini ochish",
  charge_and_plea: "Ayblovni e'lon qilish va aybga munosabat",
  evidence: "Sud tergovi (dalillarni tekshirish)",
  negotiated: "Aybga iqrorlik va kelishuv tartibi",
  closing: "Taraflar muzokarasi va oxirgi so'z",
  verdict: "Hukm chiqarish",
  appeal: "Apellyatsiya",
  cassation: "Kassatsiya, taftish va oliy sud"
};
const STATUS_LABEL = { tasdiqlangan: "✓ tasdiqlangan", tekshirilmagan: "? tekshirilmagan", ziddiyatli: "! ziddiyatli" };

const snap = (window.SNAPSHOT && window.SNAPSHOT.countries) || {};
const countries = (window.COUNTRIES || []).slice().sort((a, b) => (b.code === "uz") - (a.code === "uz"));
const procedure = {};
(window.PROCEDURE || []).forEach(p => { procedure[p.code] = p; });
const colorOf = code => (snap[code] && snap[code].color) || "#1f5b94";

const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const $ = id => document.getElementById(id);

let tab = "home";
let selected = ["uz", countries[1] ? countries[1].code : "uz"].filter((v, i, a) => a.indexOf(v) === i);

/* ---------- marshrutlash (#/procedure?c=uz,tr) ---------- */
function readHash() {
  const h = location.hash.replace(/^#\/?/, "");
  const [p, q] = h.split("?");
  const valid = ["home", "procedure", "system", "scholarship", "glossary"];
  tab = valid.includes(p) ? p : "home";
  if (q) {
    const m = q.match(/(?:^|&)c=([^&]*)/);
    if (m) {
      const list = m[1].split(",").filter(c => countries.some(x => x.code === c));
      if (list.length) selected = list;
    }
  }
}
function writeHash() {
  const q = (tab === "procedure" || tab === "system") ? "?c=" + selected.join(",") : "";
  const next = "#/" + tab + q;
  if (location.hash !== next) history.replaceState(null, "", next);
}
function go(t, sel) {
  tab = t;
  if (sel) selected = sel;
  writeHash();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- yon panel ---------- */
function renderSide() {
  document.querySelectorAll("#nav a").forEach(a => a.classList.toggle("active", a.dataset.tab === tab));
  $("sideCompare").style.display = (tab === "procedure" || tab === "system") ? "" : "none";
  $("picker").innerHTML = countries.map(c =>
    `<button type="button" class="chip ${selected.includes(c.code) ? "on" : ""}" data-c="${esc(c.code)}" style="--c:${colorOf(c.code)}">
       <span class="dot">${esc(c.code)}</span>${esc(c.name.replace(/ \(.*\)/, ""))}</button>`).join("");
  $("picker").querySelectorAll(".chip").forEach(b => b.onclick = () => {
    const c = b.dataset.c;
    selected = selected.includes(c) ? selected.filter(x => x !== c) : [...selected, c];
    writeHash(); render();
  });
}

/* ---------- umumiy bloklar ---------- */
function sourcesHtml(v) {
  const items = (v.sources || []).map(s =>
    `<li><a href="${esc(s.url)}" target="_blank" rel="noopener" title="Hujjatning bosh sahifasi">${esc(s.title)}${s.ref ? ", " + esc(s.ref) : ""}</a>${s.retrieved ? " <span>(" + esc(s.retrieved) + ")</span>" : ""}${s.original ? `<q>${esc(s.original)}</q>` : ""}</li>`).join("");
  return items ? `<details class="srcs"><summary>Manbalar (${v.sources.length}) va asl matn</summary><ul>${items}</ul></details>` : `<div class="srcs empty">Manba hali qo'shilmagan</div>`;
}
// Moddaning o'ziga olib boruvchi havolalar (bir bosishda shu moddaga o'tadi)
function artLinks(v) {
  const chips = [];
  (v.sources || []).forEach(s => (s.links || []).forEach(l =>
    chips.push(`<a class="art" href="${esc(l.url)}" target="_blank" rel="noopener" title="${esc(s.title)}: ${esc(l.label)} moddasiga o'tish">${esc(l.label)}</a>`)));
  return chips.length ? `<div class="arts"><span>Moddaga o'tish:</span>${chips.join("")}</div>` : "";
}
function cellHtml(c, v) {
  if (!v) return `<div class="cell" style="--c:${colorOf(c.code)}"><h4><span class="dot"></span>${esc(c.name)}</h4><p class="empty">Ma'lumot hali qo'shilmagan</p></div>`;
  return `<div class="cell" style="--c:${colorOf(c.code)}">
    <h4><span class="dot"></span>${esc(c.name)} <span class="status ${esc(v.status)}">${esc(STATUS_LABEL[v.status] || v.status)}</span></h4>
    <p class="sum">${esc(v.summary)}</p>${artLinks(v)}${sourcesHtml(v)}</div>`;
}

/* ---------- bosh sahifa ---------- */
function countUnique() {
  const urls = new Set();
  countries.forEach(c => Object.values(c.criteria).forEach(v => (v.sources || []).forEach(s => urls.add(s.url))));
  (window.PROCEDURE || []).forEach(p => Object.values(p.stages).forEach(v => (v.sources || []).forEach(s => urls.add(s.url))));
  return urls.size;
}
function renderHome() {
  const nStages = Object.keys(STAGES).length;
  const verified = (window.PROCEDURE || []).reduce((n, p) => n + Object.values(p.stages).filter(v => v.status === "tasdiqlangan").length, 0)
    + countries.reduce((n, c) => n + Object.values(c.criteria).filter(v => v.status === "tasdiqlangan").length, 0);
  const cards = countries.map(c => {
    const s = snap[c.code] || {};
    return `<article class="ccard" style="--c:${colorOf(c.code)}">
      <header><span class="badge-c">${esc(c.code)}</span><h3>${esc(c.name)}</h3></header>
      <dl>
        <div><dt>Huquq tizimi</dt><dd>${esc(s.family || "")}</dd></div>
        <div><dt>Xalq ishtiroki</dt><dd>${esc(s.lay || "")}</dd></div>
        <div><dt>Shikoyat bosqichlari</dt><dd>${esc(s.appeals || "")}</dd></div>
        <div><dt>Kelishuv</dt><dd>${esc(s.deal || "")}</dd></div>
      </dl>
      <div class="go"><a href="#/procedure?c=${c.code === "uz" ? "uz" : "uz," + c.code}" data-go="procedure" data-sel="${c.code === "uz" ? "uz" : "uz," + c.code}">${c.code === "uz" ? "Jarayonni ko'rish" : "O'zbekiston bilan solishtirish"} →</a></div>
    </article>`;
  }).join("");
  return `
  <section class="hero">
    <span class="kick">Jinoyat protsessi · qiyosiy tadqiqot</span>
    <h1>Sud tizimlarini bosqichma-bosqich solishtiring</h1>
    <p>O'zbekiston va ${countries.length - 1} ta xorijiy davlatda jinoyat ishi sudga kelib tushgandan hukm ustidan shikoyatgacha bo'lgan jarayon, har bir qatorda qonun moddasi va manba bilan.</p>
    <div class="btns">
      <a class="btn gold" href="#/procedure" data-go="procedure">Jarayonni solishtirish</a>
      <a class="btn ghost" href="#/scholarship" data-go="scholarship">Ilmiy manbalar</a>
    </div>
  </section>
  <section class="stats">
    <div class="stat"><b>${countries.length}</b><span>davlat</span></div>
    <div class="stat"><b>${nStages}</b><span>jarayon bosqichi</span></div>
    <div class="stat"><b>${verified}</b><span>tasdiqlangan ma'lumot qatori</span></div>
    <div class="stat"><b>${countUnique()}</b><span>manba havolasi</span></div>
  </section>
  <div class="sec-h"><h2>Bir qarashda</h2><p>Davlatni tanlab, O'zbekiston bilan yonma-yon solishtiring</p></div>
  <div class="cgrid">${cards}</div>
  <div class="sec-h"><h2>Qanday foydalaniladi</h2></div>
  <div class="steps">
    <div class="step"><i>1</i><h3>Davlatlarni tanlang</h3><p>Chap paneldan solishtirmoqchi bo'lgan davlatlarni belgilang, ustunlar yonma-yon chiqadi.</p></div>
    <div class="step"><i>2</i><h3>Bosqichni toping</h3><p>Yuqoridagi bosqichlar chizig'idan kerakli bosqichga o'ting: sud tarkibi, sud tergovi, hukm va boshqalar.</p></div>
    <div class="step"><i>3</i><h3>Manbani tekshiring</h3><p>Har bir kartada "Manbalar" ochiladi: modda raqami, havola va asl matndan iqtibos.</p></div>
    <div class="step"><i>4</i><h3>Havolani ulashing</h3><p>Tanlangan davlatlar manzilda saqlanadi, shu havolani boshqalarga yuborsangiz, ular ham xuddi shuni ko'radi.</p></div>
  </div>
  <div class="sec-h"><h2>Ma'lumot qanchalik ishonchli</h2></div>
  <div class="legend">
    <span class="status tasdiqlangan">✓ tasdiqlangan</span> asosiy qonun matni va modda raqami bilan
    <span class="status tekshirilmagan">? tekshirilmagan</span> manba kutilmoqda
    <span class="status ziddiyatli">! ziddiyatli</span> manbalar mos kelmaydi
  </div>`;
}

/* ---------- solishtirish ko'rinishlari ---------- */
function filtered(labels, getter) {
  const cs = countries.filter(c => selected.includes(c.code));
  const onlyDiff = $("onlyDiff").checked, onlyVer = $("onlyVerified").checked;
  const out = [];
  let i = 0;
  for (const [key, label] of Object.entries(labels)) {
    i++;
    const cells = cs.map(c => ({ c, v: getter(c, key) }));
    if (onlyVer && cells.some(x => !x.v || x.v.status !== "tasdiqlangan")) continue;
    if (onlyDiff && cells.length > 1 && new Set(cells.map(x => x.v && x.v.summary)).size === 1) continue;
    out.push({ key, label, n: i, cells });
  }
  return { cs, rows: out };
}
function renderCompare(labels, getter, title, intro) {
  const { cs, rows } = filtered(labels, getter);
  let html = `<div class="ph"><h1>${esc(title)}</h1><p>${esc(intro)}</p></div>`;
  if (!cs.length) return html + `<div class="none">Chap paneldan kamida bitta davlatni tanlang.</div>`;
  if (!rows.length) return html + `<div class="none">Tanlangan filtrlar bo'yicha ko'rsatadigan qator topilmadi.</div>`;
  html += `<nav class="navchips" aria-label="Bosqichlar">${rows.map(r => `<a href="#s-${r.key}" data-anchor="s-${r.key}"><b>${r.n}</b>${esc(r.label)}</a>`).join("")}</nav>`;
  html += rows.map(r => `<section class="stage" id="s-${r.key}"><h2><span class="n">${r.n}</span>${esc(r.label)}</h2>
    <div class="cols" style="--n:${cs.length}">${r.cells.map(({ c, v }) => cellHtml(c, v)).join("")}</div></section>`).join("");
  return html;
}

/* ---------- ilmiy manbalar va lug'at ---------- */
function renderScholarship() {
  const s = window.SCHOLARSHIP || { verified: [], unverified: [], discrepancies: [] };
  const link = u => `<a class="u" href="${esc(u)}" target="_blank" rel="noopener">${esc(u)}</a>`;
  return `<div class="ph"><h1>Ilmiy manbalar</h1><p>${esc(s.note)}</p></div>
  <div class="sec-h"><h2>Mazmuni tekshirilgan manbalar</h2></div>
  <div class="list">${s.verified.map(v => `<div class="card okc"><div class="tag">${esc(v.type)}</div><p><b>${esc(v.citation)}</b></p><p>${esc(v.supports)}</p>${link(v.url)}</div>`).join("")}</div>
  <div class="sec-h"><h2>Manbalar o'rtasidagi farqlar</h2></div>
  <div class="list">${s.discrepancies.map(d => `<div class="card warnc"><div class="tag">${esc(d.topic)}</div><p><b>Ikkilamchi manba:</b> ${esc(d.secondary)}</p><p><b>Asosiy manba:</b> ${esc(d.primary)}</p><p><b>Qaror:</b> ${esc(d.decision)}</p></div>`).join("")}</div>
  <div class="sec-h"><h2>O'qish uchun tavsiya</h2><p>mazmuni tekshirilmagan</p></div>
  <div class="list">${s.unverified.map(u => `<div class="card"><p>${esc(u.citation)}</p><p class="empty">${esc(u.why)}</p>${link(u.url)}</div>`).join("")}</div>`;
}
function renderGlossary() {
  const g = window.GLOSSARY || { terms: [] };
  const names = { uz: "O'zbekiston", kz: "Qozog'iston", tr: "Turkiya", de: "Germaniya", fr: "Fransiya", us: "AQSh", uk: "Buyuk Britaniya", kr: "Janubiy Koreya", ru: "Rossiya" };
  return `<div class="ph"><h1>Atamalar lug'ati</h1><p>${esc(g.note)}</p></div>
  <input class="search" id="glq" type="search" placeholder="Atama qidirish: apellyatsiya, hakamlar, kelishuv...">
  <div class="gl" id="glist">${g.terms.map(t => `<div class="card" data-q="${esc((t.uz + " " + Object.values(t.orig).join(" ")).toLowerCase())}"><h3>${esc(t.uz)}</h3>` +
    Object.entries(t.orig).map(([k, v]) => `<div class="row"><b>${esc(names[k] || k)}:</b> ${esc(v)}</div>`).join("") +
    (t.note ? `<p class="empty" style="font-size:.84rem">${esc(t.note)}</p>` : "") + `</div>`).join("")}</div>`;
}

/* ---------- asosiy chizish ---------- */
function render() {
  renderSide();
  const v = $("view");
  if (tab === "home") v.innerHTML = renderHome();
  else if (tab === "procedure") v.innerHTML = renderCompare(STAGES, (c, k) => procedure[c.code] && procedure[c.code].stages[k], "Jinoyat ishi bo'yicha sud jarayoni", "Ish birinchi instansiya sudiga kelib tushgandan hukm ustidan shikoyatgacha bo'lgan bosqichlar. Davlatlarni chap paneldan tanlang.");
  else if (tab === "system") v.innerHTML = renderCompare(CRITERIA, (c, k) => c.criteria[k], "Sud tizimi", "Tuzilma, konstitutsiyaviy nazorat, sudyalarni tayinlash va muddat, mustaqillik, xalq ishtiroki, ochiqlik va moliyalashtirish.");
  else if (tab === "scholarship") v.innerHTML = renderScholarship();
  else v.innerHTML = renderGlossary();
  wire();
}
function wire() {
  document.querySelectorAll("[data-go]").forEach(a => a.onclick = e => {
    e.preventDefault();
    const sel = a.dataset.sel ? a.dataset.sel.split(",") : null;
    go(a.dataset.go, sel);
  });
  document.querySelectorAll("[data-anchor]").forEach(a => a.onclick = e => {
    e.preventDefault();
    const el = document.getElementById(a.dataset.anchor);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  // uzun matnlarni qisqartirish tugmasi
  document.querySelectorAll(".sum").forEach(p => {
    if (p.scrollHeight > p.clientHeight + 2) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "more"; b.textContent = "To'liq o'qish ↓";
      b.onclick = () => { const o = p.classList.toggle("open"); b.textContent = o ? "Yig'ish ↑" : "To'liq o'qish ↓"; };
      p.after(b);
    }
  });
  const q = $("glq");
  if (q) q.oninput = () => {
    const t = q.value.trim().toLowerCase();
    document.querySelectorAll("#glist .card").forEach(c => { c.style.display = !t || c.dataset.q.includes(t) ? "" : "none"; });
  };
}

document.querySelectorAll("#nav a").forEach(a => a.onclick = e => { e.preventDefault(); go(a.dataset.tab); });
$("onlyDiff").onchange = render;
$("onlyVerified").onchange = render;
$("selAll").onclick = () => { selected = countries.map(c => c.code); writeHash(); render(); };
$("selNone").onclick = () => { selected = []; writeHash(); render(); };
window.addEventListener("hashchange", () => { readHash(); render(); });
readHash();
render();
