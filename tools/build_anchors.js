// Qonun hujjatlaridan "modda raqami -> sahifa ichidagi manzil (anchor)" jadvalini yig'adi: data/anchors.json
// Kerak bo'lgan asl nusxalar sources/ papkasidan o'qiladi (bo'lmasa quyidagi manzillardan yuklanadi).
// PDF sahifalarini aniqlash uchun pdftotext (poppler) kerak.
const fs = require("fs"), path = require("path"), cp = require("child_process");
const root = path.join(__dirname, "..");
const src = p => path.join(root, "sources", p);

async function getText(file, url) {
  if (fs.existsSync(file)) return fs.readFileSync(file, "utf8");
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  const t = await r.text();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, t);
  return t;
}
const SUP = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };

// lex.uz: <div name="-123" id="-123">406-modda. Sarlavha</div>, 586<sup>1</sup>-modda
function lexUz(html) {
  const map = {};
  const re = /<div name="(-?\d+)" id="\1">\s*(\d+)(?:<sup>(\d+)<\/sup>)?-modda\./g;
  let m;
  while ((m = re.exec(html))) {
    const key = m[3] ? `${m[2]}-${m[3]}` : m[2];
    if (!(key in map)) map[key] = m[1];
  }
  return map;
}
// old.adilet.zan.kz UPK: <a name="z2617"></a>Статья 335.
function adiletUpk(html) {
  const map = {};
  const re = /<a name="(z\d+)"><\/a>\s*Статья (\d+(?:-\d+)?)\./g;
  let m;
  while ((m = re.exec(html))) if (!(m[2] in map)) map[m[2]] = m[1];
  return map;
}
// old.adilet.zan.kz Konstitutsiya: <h3 id="z433"> Статья 72</h3>
function adiletKonst(html) {
  const map = {};
  const re = /<h3 id="(z\d+)">\s*Статья (\d+(?:-\d+)?)\s*<\/h3>/g;
  let m;
  while ((m = re.exec(html))) if (!(m[2] in map)) map[m[2]] = m[1];
  return map;
}
// Légifrance ochiq ma'lumotlari XML: <article id="LEGIARTI..." num="496" etat="VIGUEUR"
function legifrance(xml) {
  const map = {};
  const re = /<article id="(LEGIARTI\d+)"[^>]*?num="([^"]+)"[^>]*?etat="VIGUEUR"/g;
  let m;
  while ((m = re.exec(xml))) if (!(m[2] in map)) map[m[2]] = m[1];
  return map;
}
// mevzuat.gov.tr PDF: modda -> PDF sahifa raqami
function pdfPages(pdf, re) {
  const out = cp.execFileSync("pdftotext", ["-enc", "UTF-8", "-layout", pdf, "-"], { maxBuffer: 1 << 30 }).toString("utf8");
  const pages = out.split("\f");
  const map = {};
  pages.forEach((txt, i) => {
    let m;
    const r = new RegExp(re.source, "gmi");
    while ((m = r.exec(txt))) if (!(m[1] in map)) map[m[1]] = i + 1;
  });
  return map;
}

(async () => {
  const anchors = {};
  anchors.uz_jpk = lexUz(await getText(src("uz/raw_jpk.html"), "https://lex.uz/uz/docs/-111460"));
  anchors.uz_sud = lexUz(await getText(src("uz/raw_sudlar.html"), "https://lex.uz/uz/docs/-5534923"));
  anchors.uz_konst = lexUz(await getText(src("uz/raw_6445145.html"), "https://lex.uz/uz/docs/-6445145"));
  anchors.kz_upk = adiletUpk(await getText(src("kz/raw_upk.html"), "https://old.adilet.zan.kz/rus/docs/K1400000231"));
  anchors.kz_konst = adiletKonst(await getText(src("kz/raw_konst2026.html"), "https://old.adilet.zan.kz/rus/docs/K2600000000"));
  anchors.fr_cpp = legifrance(await getText(src("fr/cpp.xml"), "https://codes.droit.org/payloads/Code%20de%20proc%C3%A9dure%20p%C3%A9nale.xml"));
  const madde = /^\s*Madde\s+(\d+)\s*[–-]/;
  anchors.tr_cmk = pdfPages(src("tr/cmk.bin"), madde);
  anchors.tr_5235 = pdfPages(src("tr/5235.pdf"), /^\s*Madde\s+(\d+)\s*[–-]/);
  anchors.tr_anayasa = pdfPages(src("tr/anayasa.bin"), /^\s*Madde\s+(\d+)\s*[–-]/);
  fs.writeFileSync(path.join(root, "data", "anchors.json"), JSON.stringify(anchors));
  for (const [k, v] of Object.entries(anchors)) console.log(k, Object.keys(v).length);
})();
