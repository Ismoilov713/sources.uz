const CRITERIA = {
  legal_family: "Huquq tizimi",
  structure: "Sud pog'onalari",
  constitutional_review: "Konstitutsiyaviy nazorat",
  judge_appointment: "Sudyalarni tayinlash/saylash",
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
  defendant_presence: "Sudlanuvchining ishtiroki",
  opening: "Sud majlisini ochish (tayyorlov qismi)",
  charge_and_plea: "Ayblovni e'lon qilish va aybga munosabat",
  scope_change_charge: "Muhokama doirasi, ayblovni o'zgartirish, ishni tugatish",
  evidence: "Sud tergovi (dalillarni tekshirish)",
  negotiated: "Aybga iqrorlik / kelishuv tartibi",
  closing: "Taraflar muzokarasi va oxirgi so'z",
  verdict: "Hukm chiqarish",
  appeal: "Apellyatsiya",
  cassation: "Kassatsiya / taftish / revizya"
};

const countries = (window.COUNTRIES || []).slice().sort((a, b) => (b.code === "uz") - (a.code === "uz"));
const procedure = {};
(window.PROCEDURE || []).forEach(p => { procedure[p.code] = p; });
let selected = countries.map(c => c.code).slice(0, 2);
let tab = "procedure";

const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const $ = id => document.getElementById(id);

function renderPicker() {
  $("picker").innerHTML = countries.map(c =>
    `<label><input type="checkbox" value="${esc(c.code)}" ${selected.includes(c.code) ? "checked" : ""}> ${esc(c.name)}</label>`).join("");
  document.querySelectorAll("#picker input").forEach(i => i.onchange = () => {
    selected = [...document.querySelectorAll("#picker input:checked")].map(x => x.value);
    render();
  });
}

function sourcesHtml(v) {
  return (v.sources || []).map(s =>
    `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}${s.ref ? ", " + esc(s.ref) : ""}</a>` +
    (s.original ? `<details><summary>Asl matn</summary><q lang="de">${esc(s.original)}</q></details>` : "")).join("<br>");
}

// labels: {kalit: nom}; getter(country, kalit) -> {summary,status,sources} | undefined
function renderRows(labels, getter, numbered) {
  const cs = countries.filter(c => selected.includes(c.code));
  const onlyDiff = $("onlyDiff").checked, onlyVer = $("onlyVerified").checked;
  let html = "", i = 0;
  for (const [key, label] of Object.entries(labels)) {
    i++;
    const cells = cs.map(c => ({ c, v: getter(c, key) }));
    if (onlyVer && cells.some(x => !x.v || x.v.status !== "tasdiqlangan")) continue;
    if (onlyDiff && cells.length > 1 && new Set(cells.map(x => x.v && x.v.summary)).size === 1) continue;
    html += `<div class="row"><h3>${numbered ? `<span class="num">${i}</span>` : ""}${esc(label)}</h3><div class="cols" style="--n:${Math.max(cs.length, 1)}">` +
      cells.map(({ c, v }) => v
        ? `<div class="cell"><h4>${esc(c.name)} <span class="badge ${esc(v.status)}">${esc(v.status)}</span></h4><p>${esc(v.summary)}</p><div class="src">${sourcesHtml(v)}</div></div>`
        : `<div class="cell"><h4>${esc(c.name)}</h4><p class="empty">Ma'lumot hali qo'shilmagan</p></div>`).join("") +
      `</div></div>`;
  }
  return html || "<p>Ko'rsatish uchun ma'lumot topilmadi.</p>";
}

function renderScholarship() {
  const s = window.SCHOLARSHIP || { verified: [], unverified: [], discrepancies: [] };
  const link = (u, t) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a>`;
  return `<p class="note">${esc(s.note)}</p>
    <h2>Mazmuni tekshirilgan manbalar</h2>` +
    s.verified.map(v => `<div class="row"><div class="cell"><h4>${esc(v.type)}</h4><p>${esc(v.citation)}</p>
      <p><b>Nima tasdiqlaydi:</b> ${esc(v.supports)}</p><div class="src">${link(v.url, v.url)}</div></div></div>`).join("") +
    `<h2>Manbalar o'rtasidagi farqlar va qaror</h2>` +
    s.discrepancies.map(d => `<div class="row"><div class="cell"><h4>${esc(d.topic)}</h4>
      <p><b>Ikkilamchi manba:</b> ${esc(d.secondary)}</p><p><b>Asosiy manba:</b> ${esc(d.primary)}</p><p><b>Qaror:</b> ${esc(d.decision)}</p></div></div>`).join("") +
    `<h2>O'qish uchun tavsiya (mazmuni tekshirilmagan)</h2>` +
    s.unverified.map(u => `<div class="row"><div class="cell"><p>${esc(u.citation)}</p><p class="empty">${esc(u.why)}</p><div class="src">${link(u.url, u.url)}</div></div></div>`).join("");
}

function renderGlossary() {
  const g = window.GLOSSARY || { terms: [] };
  const names = { uz: "O'zbekiston", kz: "Qozog'iston", tr: "Turkiya", de: "Germaniya", fr: "Fransiya", us: "AQSh" };
  return `<p class="note">${esc(g.note)}</p>` + g.terms.map(t => `<div class="row"><h3>${esc(t.uz)}</h3><div class="cell">` +
    `<p>${Object.entries(t.orig).map(([k, v]) => `<b>${esc(names[k] || k)}:</b> ${esc(v)}`).join("<br>")}</p>` +
    (t.note ? `<p class="src">${esc(t.note)}</p>` : "") + `</div></div>`).join("");
}

function render() {
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  const compare = tab === "procedure" || tab === "system";
  $("controls").style.display = compare ? "" : "none";
  $("legend").style.display = compare ? "" : "none";
  if (tab === "scholarship") {
    $("intro").textContent = "Ilmiy va institutsional manbalar. Faqat ochilib o'qilgan va da'volari tekshirilgan manbalar asosiy ro'yxatda.";
    $("table").innerHTML = renderScholarship();
    return;
  }
  if (tab === "glossary") {
    $("intro").textContent = "Davlatlar bo'yicha asosiy atamalar va ularning o'zbekcha muqobillari.";
    $("table").innerHTML = renderGlossary();
    return;
  }
  if (tab === "procedure") {
    $("intro").textContent = "Jinoyat ishi birinchi instansiya sudiga kelib tushgandan hukm ustidan shikoyatgacha bo'lgan bosqichlar.";
    $("table").innerHTML = renderRows(STAGES, (c, k) => procedure[c.code] && procedure[c.code].stages[k], true);
  } else {
    $("intro").textContent = "Sud tizimi tuzilmasi va sudyalar maqomi bo'yicha umumiy mezonlar.";
    $("table").innerHTML = renderRows(CRITERIA, (c, k) => c.criteria[k], false);
  }
}

document.querySelectorAll(".tab").forEach(b => b.onclick = () => { tab = b.dataset.tab; render(); });
$("onlyDiff").onchange = render;
$("onlyVerified").onchange = render;
renderPicker();
render();
