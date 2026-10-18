/* Articoli Lazio + Categorie (sito servizi.lazio generato da Jekyll da _avada/). Vedi claude.md.
   COSA FA: elenca ed edita i file di _avada/_lazio (articoli, in cartelle che ricalcano l'URL) e _avada/_categorie (pagine categoria).
   Modifica titolo, SEO, descrizione, immagine in evidenza, estratto e il TESTO HTML dell'articolo. Duplica (= nuovo articolo) ed elimina.
   Elenchi, sidebar, correlati e categorie si aggiornano da soli al deploy (Jekyll li genera dai contenuti).
   PUNTI CRITICI: (1) il testo e' HTML grezzo (render_with_liquid: false nel front matter): non e' Markdown, non toccare il front matter a mano.
   (2) Il percorso del file = URL pubblico (_avada/_lazio/blog/x.html -> /blog/x/). Non c'e' rinomina: si duplica con il nuovo percorso e si elimina il vecchio.
   (3) Il front matter e' a righe singole 'chiave: "valore"': si usano A.fmGet/fmSet come negli altri moduli. */
(function (A) {
  var ROOTS = { art: '_avada/_lazio', cat: '_avada/_categorie' }, LBL = { art: 'Articoli', cat: 'Categorie' };
  var LST = { art: [], cat: [] }, cur = 'art', ED = null;
  var esc = A.esc, $ = A.$;
  function q(v) { return '"' + String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'; }
  function uq(v) { return String(v || '').replace(/\\"/g, '"').replace(/\\\\/g, '\\'); }
  function M() { return A.main(); }
  function walk(dir) {
    return A.getDir(dir).then(function (l) {
      l.forEach(function (x) { x.path = x.path || dir + '/' + x.name; });
      var fl = l.filter(function (x) { return x.type === 'file' && /\.(html|md)$/.test(x.name); });
      return Promise.all(l.filter(function (x) { return x.type === 'dir'; }).map(function (d) { return walk(d.path); })).then(function (r) { return fl.concat.apply(fl, r); });
    });
  }
  function load() {
    var root = ROOTS[cur];
    return walk(root).then(function (files) {
      return A.getFiles(root, files).then(function (rs) {
        LST[cur] = files.map(function (f, i) {
          var fm = rs[i] ? A.splitFM(rs[i].text).fm : '';
          return { path: f.path, url: f.path.slice(root.length + 1).replace(/\.\w+$/, ''), title: uq(A.fmGet(fm, 'title')), date: A.fmGet(fm, 'date').slice(0, 10) };
        });
        LST[cur].sort(function (a, b) { return (b.date || '').localeCompare(a.date || '') || a.url.localeCompare(b.url); });
      });
    });
  }
  function draw() {
    var h = '<h2>Articoli Lazio</h2><div style="margin-bottom:10px">';
    Object.keys(ROOTS).forEach(function (k) { h += '<button class="btn sm' + (k === cur ? ' primary' : '') + '" onclick="A.lzTab(\'' + k + '\')">' + LBL[k] + ' (' + LST[k].length + ')</button> '; });
    h += '<input id="lzQ" placeholder="Cerca titolo o indirizzo..." oninput="A.lzF()" style="margin-left:12px;padding:6px 8px;width:280px"></div><div class="card" id="lzT"></div>';
    M().innerHTML = h; $('topTitle').textContent = 'Articoli Lazio'; A.lzF();
  }
  A.lzF = function () {
    var s = (($('lzQ') || {}).value || '').toLowerCase(), h = '<table style="width:100%;border-collapse:collapse"><tr><th align="left">Titolo</th><th align="left">Indirizzo</th><th align="left">Data</th></tr>';
    LST[cur].forEach(function (it, i) {
      if (s && (it.title + ' ' + it.url).toLowerCase().indexOf(s) < 0) return;
      h += '<tr style="cursor:pointer;border-top:1px solid #e5e5e5" onclick="A.lzEdit(' + i + ')"><td style="padding:6px 4px">' + esc(it.title || '(senza titolo)') + '</td><td style="padding:6px 4px;color:#787c82">/' + esc(it.url) + '/</td><td style="padding:6px 4px">' + esc(it.date) + '</td></tr>';
    });
    $('lzT').innerHTML = h + '</table>';
  };
  A.lzTab = function (k) { cur = k; (LST[k].length ? Promise.resolve() : load()).then(draw); };
  A.views.lazio = function () { return load().then(draw); };

  var FIELDS = {
    art: [['title', 'Titolo', 'text'], ['seo_title', 'SEO Title', 'text'], ['description', 'Descrizione (meta description)', 'area'], ['thumb_full', 'Immagine in evidenza (percorso, es. /wp-content/uploads/2020/07/foto.jpg)', 'text'],
      ['thumb_alt', 'Testo alternativo immagine', 'text'], ['thumb_caption', 'Didascalia immagine', 'text'], ['excerpt', 'Estratto (nelle liste)', 'area']],
    cat: [['title', 'Titolo', 'text'], ['seo_title', 'SEO Title', 'text'], ['description', 'Descrizione', 'area']]
  };
  A.lzEdit = function (i) {
    var it = LST[cur][i];
    return A.getFile(it.path).then(function (f) {
      var s = A.splitFM(f.text); ED = { it: it, sha: f.sha, fm: s.fm, body: s.body };
      var h = '<h2><button class="btn sm" onclick="A.lzBack()">&larr; Elenco</button> ' + esc(it.title || it.url) + '</h2><div class="card"><p style="color:#787c82">Indirizzo: /' + esc(it.url) + '/ &nbsp; <a href="' + esc(A.siteUrl() ? A.siteUrl().replace(/\/$/, '') : '') + '/' + esc(it.url) + '/" target="_blank">apri</a></p>';
      FIELDS[cur].forEach(function (fd) {
        var v = uq(A.fmGet(s.fm, fd[0]));
        h += '<label style="display:block;margin-top:10px"><b>' + fd[1] + '</b>' + (fd[2] === 'area' ? '<textarea id="lz_' + fd[0] + '" rows="3" style="width:100%">' + esc(v) + '</textarea>' : '<input id="lz_' + fd[0] + '" value="' + esc(v) + '" style="width:100%">') + '</label>';
      });
      h += '<label style="display:block;margin-top:14px"><b>Testo (HTML)</b><textarea id="lz_body" rows="26" style="width:100%;font-family:monospace;font-size:12px">' + esc(s.body) + '</textarea></label>' +
        '<p style="margin-top:12px"><button class="btn primary" onclick="A.lzSave()">Salva</button> ' + (cur === 'art' ? '<button class="btn" onclick="A.lzDup()">Duplica come nuovo</button> ' : '') + '<button class="btn" style="color:#b32d2e" onclick="A.lzDel()">Elimina</button></p></div>';
      M().innerHTML = h;
    });
  };
  A.lzBack = function () { draw(); };
  A.lzSave = A.wrap(function () {
    var fm = ED.fm, old = A.fmGet(fm, 'thumb_full');
    FIELDS[cur].forEach(function (fd) {
      var v = $('lz_' + fd[0]).value.trim(), has = new RegExp('^' + fd[0] + ':', 'm').test(fm);
      if (v || has) fm = A.fmSet(fm, fd[0], q(v));
    });
    var nw = A.fmGet(fm, 'thumb_full');
    if (cur === 'art' && nw && nw !== old) { /* nuova immagine: stessa per miniatura, card e og:image (il browser la ridimensiona) */
      var og = A.fmGet(fm, 'og_image'); fm = A.fmSet(fm, 'thumb', q(nw)); fm = A.fmSet(fm, 'thumb_card', q(nw));
      if (og) fm = A.fmSet(fm, 'og_image', q(((og.match(/^https?:\/\/[^\/]+/) || [''])[0]) + nw));
    }
    if (cur === 'art') fm = A.fmSet(fm, 'last_modified_at', q(new Date().toISOString().slice(0, 19)));
    var out = '---\n' + fm + '\n---\n' + $('lz_body').value;
    return A.putFile(ED.it.path, out, ED.sha, 'admin: aggiorna ' + ED.it.url).then(function (r) {
      ED.sha = r && r.content ? r.content.sha : ED.sha; ED.fm = fm; ED.it.title = $('lz_title').value.trim();
      A.toast('Salvato. Il sito si aggiorna al prossimo deploy.');
    });
  });
  A.lzDup = A.wrap(function () {
    var np = (prompt('Nuovo indirizzo (cartelle/nome, senza slash iniziale), es. blog/nuovo-articolo', '') || '').trim().replace(/^\/+|\/+$/g, '');
    if (!np) return;
    if (!/^[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(np)) throw new Error('Indirizzo non valido: solo minuscole, numeri, trattini e cartelle separate da /');
    if (LST.art.some(function (x) { return x.url === np; })) throw new Error('Esiste gia\u0027 un articolo con questo indirizzo');
    var t = (prompt('Titolo del nuovo articolo', ED.it.title) || '').trim(); if (!t) return;
    var fm = A.fmSet(ED.fm, 'title', q(t)); fm = A.fmSet(fm, 'seo_title', q(t + ' - Servizi Lazio'));
    fm = A.fmSet(fm, 'date', q(new Date().toISOString().slice(0, 19))); fm = A.fmSet(fm, 'last_modified_at', q(new Date().toISOString().slice(0, 19)));
    fm = A.fmSet(fm, 'wp_id', q(String(100000 + Date.now() % 900000)));
    var p = ROOTS.art + '/' + np + '.html';
    return A.putFile(p, '---\n' + fm + '\n---\n' + ED.body, null, 'admin: nuovo articolo ' + np).then(function () {
      A.toast('Creato /' + np + '/. Ora modificalo.'); LST.art = []; return A.views.lazio().then(function () { var i = LST.art.findIndex(function (x) { return x.url === np; }); if (i >= 0) return A.lzEdit(i); });
    });
  });
  A.lzDel = A.wrap(function () {
    if (!confirm('Eliminare /' + ED.it.url + '/ ? Il file resta recuperabile dalla cronologia di GitHub.')) return;
    return A.getFile(ED.it.path).then(function (f) { return A.delFile(ED.it.path, f.sha); }).then(function () {
      A.toast('Eliminato.'); LST[cur] = []; return A.views.lazio();
    });
  });
})(window.A);
