/* GoatCounter (cookiesiz statistika). Kodni goatcounter.com da yaratilgan sayt nomiga almashtiring:
   masalan "sources" -> https://sources.goatcounter.com. Bo'sh bo'lsa hech narsa yuborilmaydi. */
(function () {
  var CODE = "";
  if (!CODE) { window.track = function () {}; return; }
  window.goatcounter = { no_onload: true, endpoint: "https://" + CODE + ".goatcounter.com/count" };
  var s = document.createElement("script");
  s.async = true; s.src = "https://gc.zgo.at/count.js";
  s.setAttribute("data-goatcounter", window.goatcounter.endpoint);
  s.setAttribute("data-goatcounter-settings", JSON.stringify({ no_onload: true }));
  document.head.appendChild(s);
  var last = "";
  function send(path, title, event) {
    try {
      if (!window.goatcounter || !window.goatcounter.count) return setTimeout(function () { send(path, title, event); }, 500);
      window.goatcounter.count({ path: path, title: title || path, event: !!event });
    } catch (e) {}
  }
  /* bo'lim va tanlangan davlatlar: "/agencies/us+de" */
  window.track = function (kind, a, b) {
    if (kind === "view") {
      var p = "/" + a + (b && b.length ? "/" + b.join("+") : "");
      if (p === last) return; last = p; send(p, "Bo'lim: " + a);
    } else if (kind === "search") {
      send("search/" + String(a).slice(0, 60), "Qidiruv: " + a, true);
    }
  };
})();
