/* Articoli, Categorie e PAGINE (Home, portfolio, autore, slide-page...) del sito servizi.lazio generato da Jekyll da _avada/. Vedi claude.md.
   COSA FA: elenca ed edita i file di _avada/_lazio (articoli), _avada/_categorie (pagine categoria) e _avada/_pagine (tutte le altre pagine, Home compresa).
   Articoli/categorie: titolo, SEO, descrizione, immagine, estratto e TESTO HTML. Duplica (= nuovo articolo) ed elimina.
   Pagine: titolo, SEO title, descrizione + contenuto in due modi: scheda "Testi e immagini" (campi semplici per ogni testo, immagine e link, come l'editor di
   WordPress) e scheda "HTML" (codice della sola zona <main>). Testata, menu e piede della pagina non si toccano da qui.
   Elenchi, sidebar, correlati e categorie degli articoli si aggiornano da soli al deploy (Jekyll li genera dai contenuti).
   PUNTI CRITICI: (1) il testo e' HTML grezzo (render_with_liquid: false nel front matter): non e' Markdown, non toccare il front matter a mano.
   (2) Il percorso del file = URL pubblico (_avada/_lazio/blog/x.html -> /blog/x/; _avada/_pagine/home.html -> / ; _pagine/slide-page/x.html -> /slide-page/x/).
   Non c'e' rinomina: si duplica con il nuovo percorso e si elimina il vecchio.
   (3) Il front matter e' a righe singole 'chiave: "valore"': si usano A.fmGet/fmSet come negli altri moduli.
   (4) PAGINE: la pagina e' il file HTML completo del mirror (le risorse hanno percorsi relativi in base alla profondita' dell'URL): una pagina nuova si crea
   duplicandone una con la STESSA profondita' (stesso numero di cartelle nell'indirizzo). La scheda "Testi e immagini" rilegge la zona <main> col parser del browser
   e la riscrive SOLO se cambi qualcosa; senza modifiche il codice resta identico all'originale.
   (5) Home (_pagine/home.html) non si elimina da qui. */
(function (A) {
  var ROOTS = { art: '_avada/_lazio', cat: '_avada/_categorie', pag: '_avada/_pagine' }, LBL = { art: 'Articoli', cat: 'Categorie', pag: 'Pagine' };
  var LST = { art: [], cat: [], pag: [] }, cur = 'art', ED = null, VIS = null;
  var esc = A.esc, $ = A.$;
  function q(v) { return '"' + String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'; }
  function uq(v) { return String(v || '').replace(/\\"/g, '"').replace(/\\\\/g, '\\'); }
  function M() { return A.main(); }
  function disp(it) { return it.url ? '/' + it.url + '/' : '/'; }
  function live(it) { return (A.siteUrl() ? A.siteUrl().replace(/\/$/, '') : '') + disp(it); }
  function walk(dir) {
    return A.getDir(dir).then(function (l) {
      l.forEach(function (x) { x.path = x.path || dir + '/' + x.name; });
      var fl = l.filter(function (x) { return x.type === 'file' && /\.(html|md)$/.test(x.name); });
      return Promise.all(l.filter(function (x) { return x.type === 'dir'; }).map(function (d) { return walk(d.path); })).then(function (r) { return fl.concat.apply(fl, r); });
    });
  }
  function load() {
    var k = cur, root = ROOTS[k];
    return walk(root).then(function (files) {
      return A.getFiles(root, files).then(function (rs) {
        LST[k] = files.map(function (f, i) {
          var fm = rs[i] ? A.splitFM(rs[i].text).fm : '', u = f.path.slice(root.length + 1).replace(/\.\w+$/, '');
          if (k === 'pag' && u === 'home') u = '';
          return { path: f.path, url: u, title: uq(A.fmGet(fm, 'title')), date: A.fmGet(fm, 'date').slice(0, 10) };
        });
        LST[k].sort(k === 'pag' ? function (a, b) { return (a.url === '' ? -1 : 0) - (b.url === '' ? -1 : 0) || a.url.localeCompare(b.url); }
          : function (a, b) { return (b.date || '').localeCompare(a.date || '') || a.url.localeCompare(b.url); });
      });
    });
  }
  function head() { return cur === 'pag' ? 'Pagine' : 'Articoli Lazio'; }
  function draw() {
    var h = '<h2>' + head() + '</h2><div style="margin-bottom:10px">';
    Object.keys(ROOTS).forEach(function (k) { h += '<button class="btn sm' + (k === cur ? ' primary' : '') + '" onclick="A.lzTab(\'' + k + '\')">' + LBL[k] + ' (' + LST[k].length + ')</button> '; });
    h += '<input id="lzQ" placeholder="Cerca titolo o indirizzo..." oninput="A.lzF()" style="margin-left:12px;padding:6px 8px;width:280px"></div><div class="card" id="lzT"></div>';
    M().innerHTML = h; $('topTitle').textContent = head(); A.lzF();
  }
  A.lzF = function () {
    var s = (($('lzQ') || {}).value || '').toLowerCase(), h = '<table style="width:100%;border-collapse:collapse"><tr><th align="left">Titolo</th><th align="left">Indirizzo</th><th align="left">' + (cur === 'pag' ? '' : 'Data') + '</th></tr>';
    LST[cur].forEach(function (it, i) {
      if (s && (it.title + ' ' + it.url).toLowerCase().indexOf(s) < 0) return;
      h += '<tr style="cursor:pointer;border-top:1px solid #e5e5e5" onclick="A.lzEdit(' + i + ')"><td style="padding:6px 4px">' + esc(it.title || '(senza titolo)') + '</td><td style="padding:6px 4px;color:#787c82">' + esc(disp(it)) + '</td><td style="padding:6px 4px">' + esc(it.date) + '</td></tr>';
    });
    $('lzT').innerHTML = h + '</table>';
  };
  A.lzTab = function (k) { cur = k; (LST[k].length ? Promise.resolve() : load()).then(draw); };
  A.views.lazio = function () { cur = 'art'; return (LST.art.length ? Promise.resolve() : load()).then(draw); };
  A.views.pagine = function () { cur = 'pag'; return (LST.pag.length ? Promise.resolve() : load()).then(draw); };
  var INC = [['_avada/_includes/avada/header.html', 'Menu e testata'], ['_avada/_includes/avada/footer.html', 'Piè di pagina']], INCED = null;
  A.views.menu = function () {
    var h = '<h2>Menu e piè di pagina</h2><div class="card"><p style="color:#787c82">Questi blocchi sono unici: una modifica vale per TUTTE le pagine e gli articoli del sito. Nel codice ci sono istruzioni tra parentesi graffe ({% ... %} e {{ ... }}): non cancellarle.</p>';
    INC.forEach(function (x, i) { h += '<p><button class="btn" onclick="A.incEdit(' + i + ')">' + x[1] + '</button></p>'; });
    M().innerHTML = h + '</div>'; return Promise.resolve();
  };
  A.incEdit = function (i) {
    return A.getFile(INC[i][0]).then(function (f) {
      INCED = { i: i, sha: f.sha };
      M().innerHTML = '<h2><button class="btn sm" onclick="A.go(\'menu\')">&larr; Indietro</button> ' + INC[i][1] + '</h2><div class="card"><textarea id="incTxt" rows="28" style="width:100%;font-family:monospace;font-size:12px">' + esc(f.text) + '</textarea><p><button class="btn primary" onclick="A.incSave()">Salva</button></p></div>';
    });
  };
  A.incSave = A.wrap(function () {
    return A.putFile(INC[INCED.i][0], $('incTxt').value, INCED.sha, 'admin: aggiorna ' + INC[INCED.i][1]).then(function (r) {
      INCED.sha = r && r.content ? r.content.sha : INCED.sha; A.toast('Salvato. Il sito si aggiorna al prossimo deploy.');
    });
  });

  var FIELDS = {
    art: [['title', 'Titolo', 'text'], ['seo_title', 'SEO Title', 'text'], ['description', 'Descrizione (meta description)', 'area'], ['thumb_full', 'Immagine in evidenza (percorso, es. /wp-content/uploads/2020/07/foto.jpg)', 'text'],
      ['thumb_alt', 'Testo alternativo immagine', 'text'], ['thumb_caption', 'Didascalia immagine', 'text'], ['excerpt', 'Estratto (nelle liste)', 'area']],
    cat: [['title', 'Titolo', 'text'], ['seo_title', 'SEO Title', 'text'], ['description', 'Descrizione', 'area']],
    pag: [['title', 'Titolo (nell\u0027elenco)', 'text'], ['seo_title', 'SEO Title (titolo nel browser e su Google)', 'text'], ['description', 'Descrizione (meta description)', 'area']]
  };

  /* ---------- PAGINE: zona <main>, testata, editor "Testi e immagini" ---------- */
  function esH(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function splitPage(body) {
    var o = /<main\b[^>]*>/.exec(body), e = body.lastIndexOf('</main>');
    if (!o || e < 0) return null;
    var s = o.index + o[0].length;
    return { pre: body.slice(0, s), main: body.slice(s, e), post: body.slice(e) };
  }
  function setHead(pre, seo, desc) {
    pre = pre.replace(/<title>[\s\S]*?<\/title>/, function () { return '<title>' + esH(seo) + '</title>'; });
    if (/<meta name="description" content="[^"]*"/.test(pre)) pre = pre.replace(/(<meta name="description" content=")[^"]*(")/, function (m, a, b) { return a + esH(desc) + b; });
    else if (desc) pre = pre.replace('</title>', function () { return '</title>\n\t<meta name="description" content="' + esH(desc) + '" />'; });
    pre = pre.replace(/(<meta property="og:title" content=")[^"]*(")/, function (m, a, b) { return a + esH(seo) + b; });
    pre = pre.replace(/(<meta property="og:description" content=")[^"]*(")/, function (m, a, b) { return a + esH(desc) + b; });
    return pre;
  }
  function buildVis(main) {
    var d = new DOMParser().parseFromString('<!DOCTYPE html><html><body>' + main + '</body></html>', 'text/html'), v = { d: d, tx: [], im: [], lk: [] }, w = d.createTreeWalker(d.body, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) {
      var pn = n.parentNode.nodeName;
      if (/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|TITLE)$/.test(pn) || !/\S/.test(n.nodeValue) || /\{[{%]/.test(n.nodeValue)) continue;
      v.tx.push({ n: n, tag: pn, v: n.nodeValue.replace(/\s+/g, ' ').trim() });
    }
    [].forEach.call(d.body.querySelectorAll('img'), function (el) { if (/\{[{%]/.test((el.getAttribute('src') || '') + (el.getAttribute('alt') || ''))) return; v.im.push({ el: el, src: el.getAttribute('src') || '', alt: el.getAttribute('alt') || '' }); });
    [].forEach.call(d.body.querySelectorAll('a[href]'), function (el) { if (/\{[{%]/.test(el.getAttribute('href') || '')) return; v.lk.push({ el: el, href: el.getAttribute('href') || '', t: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40) }); });
    return v;
  }
  function fld(id, val, lab) {
    var st = 'width:100%;box-sizing:border-box';
    return '<label style="display:block;margin:6px 0"><span style="color:#787c82;font-size:11px">' + esc(lab) + '</span>' +
      (val.length > 70 ? '<textarea id="' + id + '" rows="' + Math.min(6, Math.ceil(val.length / 80)) + '" style="' + st + '">' + esc(val) + '</textarea>' : '<input id="' + id + '" value="' + esc(val) + '" style="' + st + '">') + '</label>';
  }
  function visHtml(v) {
    var h = '<p style="color:#787c82">Cambia i testi, le immagini e i link della pagina come nell\u0027editor di WordPress. Per spostare o aggiungere blocchi usa la scheda HTML.</p><h3>Testi (' + v.tx.length + ')</h3>';
    v.tx.forEach(function (x, i) { h += fld('vt_' + i, x.v, x.tag.toLowerCase()); });
    h += '<h3 style="margin-top:18px">Immagini (' + v.im.length + ')</h3>';
    v.im.forEach(function (x, i) { h += '<div style="margin:8px 0;padding:6px;border:1px solid #e5e5e5">' + fld('vi_' + i, x.src, 'immagine (percorso)') + fld('va_' + i, x.alt, 'testo alternativo') + '</div>'; });
    h += '<h3 style="margin-top:18px">Link (' + v.lk.length + ')</h3>';
    v.lk.forEach(function (x, i) { h += fld('vl_' + i, x.href, 'link' + (x.t ? ': ' + x.t : '')); });
    return h;
  }
  function applyVis() { /* riporta i campi nel DOM; ritorna l'HTML nuovo, oppure null se non e' cambiato niente */
    var ch = false;
    VIS.tx.forEach(function (x, i) {
      var el = $('vt_' + i); if (!el || el.value === x.v) return;
      var raw = x.n.nodeValue; x.n.nodeValue = raw.match(/^\s*/)[0] + el.value.trim() + raw.match(/\s*$/)[0]; ch = true;
    });
    VIS.im.forEach(function (x, i) {
      var s = $('vi_' + i), a = $('va_' + i);
      if (s && s.value !== x.src) {
        x.el.setAttribute('src', s.value); if (x.el.hasAttribute('data-orig-src')) x.el.setAttribute('data-orig-src', s.value);
        x.el.removeAttribute('srcset'); x.el.removeAttribute('data-srcset'); ch = true;
      }
      if (a && a.value !== x.alt) { x.el.setAttribute('alt', a.value); ch = true; }
    });
    VIS.lk.forEach(function (x, i) { var l = $('vl_' + i); if (l && l.value !== x.href) { x.el.setAttribute('href', l.value); ch = true; } });
    return ch ? VIS.d.body.innerHTML : null;
  }
  function syncMain() { /* dalla scheda attiva a ED.main */
    if (ED.mode === 'vis') { var r = VIS ? applyVis() : null; if (r !== null) ED.main = r; }
    else ED.main = $('pgHtml').value;
  }
  function pgDraw() {
    var h = '<div style="margin:12px 0 8px"><button class="btn sm' + (ED.mode === 'vis' ? ' primary' : '') + '" onclick="A.pgMode(\'vis\')">Testi e immagini</button> <button class="btn sm' + (ED.mode === 'html' ? ' primary' : '') + '" onclick="A.pgMode(\'html\')">HTML</button></div>';
    if (ED.mode === 'vis') { VIS = buildVis(ED.main); h += '<div id="pgVis" style="max-height:640px;overflow:auto;padding-right:8px">' + visHtml(VIS) + '</div>'; }
    else { VIS = null; h += '<textarea id="pgHtml" rows="30" style="width:100%;font-family:monospace;font-size:12px">' + esc(ED.main) + '</textarea>'; }
    $('pgBox').innerHTML = h;
  }
  A.pgMode = function (m) { if (m === ED.mode) return; syncMain(); ED.mode = m; pgDraw(); };
  function pagEdit(it) {
    return A.getFile(it.path).then(function (f) {
      var s = A.splitFM(f.text), sp = splitPage(s.body);
      if (!sp) throw new Error('Questa pagina non ha una zona <main>: non si puo\u0027 modificare da qui.');
      ED = { it: it, sha: f.sha, fm: s.fm, pre: sp.pre, main: sp.main, post: sp.post, mode: 'vis', seo0: uq(A.fmGet(s.fm, 'seo_title')), desc0: uq(A.fmGet(s.fm, 'description')) };
      var h = '<h2><button class="btn sm" onclick="A.lzBack()">&larr; Elenco</button> ' + esc(it.title || it.url) + '</h2><div class="card"><p style="color:#787c82">Indirizzo: ' + esc(disp(it)) + ' &nbsp; <a href="' + esc(live(it)) + '" target="_blank">apri</a></p>';
      FIELDS.pag.forEach(function (fd) {
        var v = uq(A.fmGet(s.fm, fd[0]));
        h += '<label style="display:block;margin-top:10px"><b>' + fd[1] + '</b>' + (fd[2] === 'area' ? '<textarea id="lz_' + fd[0] + '" rows="3" style="width:100%">' + esc(v) + '</textarea>' : '<input id="lz_' + fd[0] + '" value="' + esc(v) + '" style="width:100%">') + '</label>';
      });
      h += '<div id="pgBox"></div><p style="margin-top:12px"><button class="btn primary" onclick="A.lzSave()">Salva</button> <button class="btn" onclick="A.lzDup()">Duplica come nuova</button> ' +
        (it.url ? '<button class="btn" style="color:#b32d2e" onclick="A.lzDel()">Elimina</button>' : '') + '</p></div>';
      M().innerHTML = h; pgDraw();
    });
  }
  var pagSave = A.wrap(function () {
    syncMain();
    var fm = ED.fm, seo = $('lz_seo_title').value.trim(), desc = $('lz_description').value.trim(), pre = ED.pre;
    FIELDS.pag.forEach(function (fd) { var v = $('lz_' + fd[0]).value.trim(), has = new RegExp('^' + fd[0] + ':', 'm').test(fm); if (v || has) fm = A.fmSet(fm, fd[0], q(v)); });
    if (seo !== ED.seo0 || desc !== ED.desc0) pre = setHead(pre, seo || $('lz_title').value.trim(), desc);
    var out = '---\n' + fm + '\n---\n' + pre + ED.main + ED.post;
    return A.putFile(ED.it.path, out, ED.sha, 'admin: aggiorna pagina ' + (ED.it.url || 'home')).then(function (r) {
      ED.sha = r && r.content ? r.content.sha : ED.sha; ED.fm = fm; ED.pre = pre; ED.seo0 = seo; ED.desc0 = desc; ED.it.title = $('lz_title').value.trim();
      A.toast('Salvato. Il sito si aggiorna al prossimo deploy.');
    });
  });

  A.lzEdit = function (i) {
    var it = LST[cur][i];
    if (cur === 'pag') return pagEdit(it);
    return A.getFile(it.path).then(function (f) {
      var s = A.splitFM(f.text); ED = { it: it, sha: f.sha, fm: s.fm, body: s.body };
      var h = '<h2><button class="btn sm" onclick="A.lzBack()">&larr; Elenco</button> ' + esc(it.title || it.url) + '</h2><div class="card"><p style="color:#787c82">Indirizzo: ' + esc(disp(it)) + ' &nbsp; <a href="' + esc(live(it)) + '" target="_blank">apri</a></p>';
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
  A.lzSave = function () {
    if (cur === 'pag') return pagSave();
    return artSave();
  };
  var artSave = A.wrap(function () {
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
    var np = (prompt('Nuovo indirizzo (cartelle/nome, senza slash iniziale), es. ' + (cur === 'pag' ? 'slide-page/nuova-pagina' : 'blog/nuovo-articolo'), '') || '').trim().replace(/^\/+|\/+$/g, '');
    if (!np) return;
    if (!/^[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(np)) throw new Error('Indirizzo non valido: solo minuscole, numeri, trattini e cartelle separate da /');
    if (LST[cur].some(function (x) { return x.url === np; })) throw new Error('Esiste gia\u0027 una pagina con questo indirizzo');
    var depth = function (u) { return u ? u.split('/').length : 0; };
    if (cur === 'pag' && depth(np) !== depth(ED.it.url)) throw new Error('Una pagina nuova deve avere lo stesso numero di cartelle di quella che duplichi (' + depth(ED.it.url) + '): le immagini e gli stili usano percorsi relativi. Duplica una pagina con la stessa profondita\u0027.');
    var t = (prompt('Titolo della nuova ' + (cur === 'pag' ? 'pagina' : 'articolo'), ED.it.title) || '').trim(); if (!t) return;
    var now = new Date().toISOString().slice(0, 19), p, out;
    if (cur === 'pag') {
      syncMain();
      var seo = t + ' - Servizi Lazio', fm = A.fmSet(ED.fm, 'title', q(t)); fm = A.fmSet(fm, 'seo_title', q(seo)); fm = fm.replace(/^permalink:.*\n?/m, '');
      var pre = setHead(ED.pre, seo, uq(A.fmGet(fm, 'description')));
      var all = pre + ED.main + ED.post, old = 'https://servizi.lazio.it/' + (ED.it.url ? ED.it.url + '/' : '');
      all = all.split(old).join('https://servizi.lazio.it/' + np + '/');
      p = ROOTS.pag + '/' + np + '.html'; out = '---\n' + fm.replace(/\n+$/, '') + '\n---\n' + all;
    } else {
      var fm2 = A.fmSet(ED.fm, 'title', q(t)); fm2 = A.fmSet(fm2, 'seo_title', q(t + ' - Servizi Lazio'));
      fm2 = A.fmSet(fm2, 'date', q(now)); fm2 = A.fmSet(fm2, 'last_modified_at', q(now)); fm2 = A.fmSet(fm2, 'wp_id', q(String(100000 + Date.now() % 900000)));
      p = ROOTS[cur] + '/' + np + '.html'; out = '---\n' + fm2 + '\n---\n' + ED.body;
    }
    var k = cur;
    return A.putFile(p, out, null, 'admin: nuovo ' + (k === 'pag' ? 'pagina ' : 'articolo ') + np).then(function () {
      A.toast('Creato /' + np + '/. Ora modificalo.'); LST[k] = []; return load().then(function () { var i = LST[k].findIndex(function (x) { return x.url === np; }); if (i >= 0) return A.lzEdit(i); });
    });
  });
  A.lzDel = A.wrap(function () {
    if (cur === 'pag' && !ED.it.url) throw new Error('La Home non si puo\u0027 eliminare.');
    if (!confirm('Eliminare ' + disp(ED.it) + ' ? Il file resta recuperabile dalla cronologia di GitHub.')) return;
    var k = cur;
    return A.getFile(ED.it.path).then(function (f) { return A.delFile(ED.it.path, f.sha); }).then(function () {
      A.toast('Eliminato.'); LST[k] = []; return load().then(draw);
    });
  });
})(window.A);
