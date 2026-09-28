/* STAN LEVIS — éléments animés (fil, dossier, tampon, balance, clés, téléphone, néon, badge holo) */
(function () {
  'use strict';
  var EN = function () { return document.body.classList.contains('lang-en'); };
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs, html) { var e = document.createElement(tag); if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]); if (html != null) e.innerHTML = html; return e; }
  function bi(fr, en) { return '<span class="fr">' + fr + '</span><span class="en">' + en + '</span>'; }

  /* ── WhatsApp : numéro direct (le lien wa.me/message/… ignore le texte) ── */
  var WA_NUM = '2250777653282'; // ex. '2250700000000' — indicatif + numéro, sans + ni espaces
  function waFix(a) {
    if (!WA_NUM || !a.href || a.href.indexOf('wa.me/message/') < 0) return;
    var q = ''; try { q = new URL(a.href).searchParams.get('text') || ''; } catch (e) {}
    if (!q) q = EN() ? 'Hello Stan, I found you on your website.' : 'Bonjour Stan, je vous contacte depuis votre site.';
    a.href = 'https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(q);
  }
  document.querySelectorAll('a[href*="wa.me/message/"]').forEach(waFix);

  /* ── Son ── */
  var S = { ac: null };
  S.on = function () { var b = document.getElementById('fin-sound'); return !b || b.getAttribute('aria-pressed') !== 'false'; };
  S.ctx = function () { try { S.ac = S.ac || new (window.AudioContext || window.webkitAudioContext)(); if (S.ac.state === 'suspended') S.ac.resume(); } catch (e) {} return S.ac; };
  document.addEventListener('pointerdown', function () { S.ctx(); }, { once: true });
  S.tone = function (f, d, o) {
    o = o || {}; if (!S.on()) return; var ac = S.ctx(); if (!ac) return;
    var t = ac.currentTime + (o.at || 0), osc = ac.createOscillator(), g = ac.createGain();
    osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(f, t); if (o.slide) osc.frequency.exponentialRampToValueAtTime(o.slide, t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.g || 0.05, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    osc.connect(g); g.connect(ac.destination); osc.start(t); osc.stop(t + d + 0.02);
  };
  S.noise = function (d, o) {
    o = o || {}; if (!S.on()) return; var ac = S.ctx(); if (!ac) return;
    var t = ac.currentTime + (o.at || 0), buf = ac.createBuffer(1, Math.max(1, ac.sampleRate * d), ac.sampleRate), ch = buf.getChannelData(0);
    for (var i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / ch.length, o.decay || 3);
    var src = ac.createBufferSource(); src.buffer = buf;
    var fl = ac.createBiquadFilter(); fl.type = o.type || 'lowpass'; fl.frequency.value = o.f || 1200; fl.Q.value = o.q || 0.8;
    var g = ac.createGain(); g.gain.value = o.g || 0.4;
    src.connect(fl); fl.connect(g); g.connect(ac.destination); src.start(t);
  };
  S.thud = function () { S.noise(0.22, { f: 160, g: 1.1, decay: 4 }); S.tone(62, 0.25, { g: 0.22, slide: 40 }); };
  S.pluck = function (f) { S.tone(f, 1.1, { type: 'triangle', g: 0.05 }); S.tone(f * 2, 0.6, { g: 0.015 }); };
  S.tink = function (f) { S.tone(f, 0.7, { g: 0.03 }); S.tone(f * 2.76, 0.45, { g: 0.012 }); S.tone(f * 5.4, 0.25, { g: 0.006 }); };
  S.paper = function () { S.noise(0.16, { type: 'highpass', f: 2500, g: 0.25, decay: 1.5 }); };
  S.tock = function () { S.tone(420, 0.09, { type: 'triangle', g: 0.07 }); S.noise(0.05, { type: 'bandpass', f: 1800, g: 0.3 }); };
  S.buzz = function (d) { S.tone(118, d, { type: 'sawtooth', g: 0.018 }); S.noise(d, { type: 'bandpass', f: 3200, q: 3, g: 0.08, decay: 0.5 }); };
  S.vibe = function () { for (var i = 0; i < 3; i++) S.tone(150, 0.14, { type: 'square', g: 0.012, at: i * 0.2 }); };

  /* ── Filtres SVG partagés (encre) ── */
  var defs = el('div', { 'aria-hidden': 'true', style: 'position:absolute;width:0;height:0;overflow:hidden' },
    '<svg width="0" height="0"><defs><filter id="fxInk" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.2"/><feGaussianBlur stdDeviation="0.35"/></filter></defs></svg>');
  document.body.appendChild(defs);

  var fin = document.getElementById('financement');

  /* ═ 1 · FIL DORÉ ═ */
  (function () {
    if (!fin) return;
    var chips = fin.querySelectorAll('.fin-chip'); if (!chips.length) return;
    var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'fx-wire'); svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<defs><linearGradient id="fxGold" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#DDB07C"/><stop offset="0.5" stop-color="#E8792B"/><stop offset="1" stop-color="#FFD9A8"/></linearGradient></defs><path/><circle r="3.5"/>';
    fin.appendChild(svg);
    var path = svg.querySelector('path'), dot = svg.querySelector('circle'), grad = svg.querySelector('#fxGold');
    var active = null, raf = 0, len = 0;
    function draw(chip, animate) {
      var s = fin.getBoundingClientRect(), c = chip.getBoundingClientRect(), card = document.querySelector(chip.getAttribute('href'));
      if (!card) return; var k = card.getBoundingClientRect();
      var sx = c.right - s.left - 4, sy = c.top + c.height / 2 - s.top, ex = k.left + k.width / 2 - s.left, ey = k.top - s.top + 2;
      var d = 'M' + sx + ',' + sy + ' C' + (sx + Math.max(80, (ex - sx) * 0.6)) + ',' + sy + ' ' + ex + ',' + (ey - Math.max(120, (ey - sy) * 0.5)) + ' ' + ex + ',' + ey;
      path.setAttribute('d', d);
      grad.setAttribute('x1', sx); grad.setAttribute('y1', sy); grad.setAttribute('x2', ex); grad.setAttribute('y2', ey);
      len = path.getTotalLength();
      path.style.strokeDasharray = len;
      if (animate) {
        path.style.transition = 'none'; path.style.strokeDashoffset = len; path.getBoundingClientRect();
        path.style.transition = ''; path.style.strokeDashoffset = 0; path.style.opacity = 1;
        var t0 = performance.now(); cancelAnimationFrame(raf);
        (function run(now) {
          var p = Math.min(1, (now - t0) / 900), e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2, pt = path.getPointAtLength(e * len);
          dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y); dot.style.opacity = p < 1 ? 1 : 0;
          if (p < 1) raf = requestAnimationFrame(run);
        })(t0);
      } else path.style.strokeDashoffset = 0;
    }
    function link(chip, i) {
      if (active === chip) return; unlink(); active = chip; chip.classList.add('fx-active');
      var card = document.querySelector(chip.getAttribute('href')); if (card) card.classList.add('fin-linked');
      draw(chip, true); S.pluck([196, 247, 294, 392][i] || 262);
    }
    function unlink() {
      if (!active) return; active.classList.remove('fx-active');
      var card = document.querySelector(active.getAttribute('href')); if (card) card.classList.remove('fin-linked');
      path.style.strokeDashoffset = len; path.style.opacity = 0; dot.style.opacity = 0; active = null;
    }
    chips.forEach(function (ch, i) { ch.addEventListener('mouseenter', function () { link(ch, i); }); ch.addEventListener('focus', function () { link(ch, i); }); ch.addEventListener('mouseleave', unlink); ch.addEventListener('blur', unlink); });
    window.addEventListener('scroll', function () { if (active) draw(active, false); }, { passive: true });
    window.addEventListener('resize', function () { if (active) draw(active, false); });
  })();

  /* ═ 2 · DOSSIER QUI S'EMPILE ═ */
  (function () {
    if (!fin) return; var cta = fin.querySelector('.financement-cta-wrap'); if (!cta) return;
    var items = [
      ['Activité en cours ou entreprise constituée', 'Active business or registered company'],
      ['Historique d\'entrées et sorties d\'argent', 'Record of money coming in and going out'],
      ['Montant recherché défini', 'Amount needed defined'],
      ['Pièces prêtes (CNI, RCCM, ACD…)', 'Documents ready (ID, RCCM, ACD…)']
    ];
    var wa = cta.querySelector('a.btn-wa'); var base = wa ? wa.href.split('?')[0] : 'https://wa.me/message/GD5WPMEZCKYDN1';
    var svgWa = wa ? wa.querySelector('svg').outerHTML : '';
    var box = el('div', { 'class': 'fx-dossier' });
    box.innerHTML =
      '<div class="fx-dossier-copy">' +
        '<p class="fx-dossier-label">' + bi('Vérifiez votre dossier', 'Check your file') + '</p>' +
        '<h3 class="fx-dossier-title">' + bi('4 cases. 30 secondes. <em>Vous savez où vous en êtes.</em>', '4 boxes. 30 seconds. <em>You know where you stand.</em>') + '</h3>' +
        '<ul class="fx-checks">' + items.map(function (it, i) { return '<li><label class="fx-check" data-i="' + i + '"><input type="checkbox"/><span class="fx-box"></span><span>' + bi(it[0], it[1]) + '</span></label></li>'; }).join('') + '</ul>' +
        '<a class="btn-wa fx-dossier-send" target="_blank" rel="noopener" href="' + base + '">' + svgWa + ' ' + bi('Envoyer mon dossier → WhatsApp', 'Send my file → WhatsApp') + '</a>' +
        '<p class="fx-dossier-hint">' + bi('Cochez tout pour débloquer l\'envoi.', 'Tick everything to unlock sending.') + '</p>' +
      '</div>' +
      '<div class="fx-folder" aria-hidden="true"><div class="fx-folder-back"></div>' +
        [0, 1, 2, 3].map(function () { return '<div class="fx-sheet"><span></span><span></span><span></span><span></span><span></span></div>'; }).join('') +
        '<div class="fx-folder-front"><span class="fx-folder-tab">' + bi('Dossier · Mise en relation', 'File · Loan matching') + '</span><span class="fx-folder-count">0/4</span></div>' +
        '<div class="fx-stamp-mark">' + bi('DOSSIER PRÊT', 'FILE READY') + '</div>' +
      '</div>';
    cta.parentNode.insertBefore(box, cta);
    var checks = box.querySelectorAll('.fx-check'), sheets = box.querySelectorAll('.fx-sheet'), count = box.querySelector('.fx-folder-count'), send = box.querySelector('.fx-dossier-send');
    function update() {
      var n = 0, list = [];
      checks.forEach(function (c, i) { var on = c.querySelector('input').checked; c.classList.toggle('on', on); if (on) { n++; list.push('✓ ' + items[i][EN() ? 1 : 0]); } });
      var sorted = []; checks.forEach(function (c, i) { if (c.querySelector('input').checked) sorted.push(i); });
      sheets.forEach(function (s, i) { s.classList.toggle('in', i < n); });
      count.textContent = n + '/4';
      var ready = n === 4, was = box.classList.contains('ready');
      box.classList.toggle('ready', ready);
      if (ready && !was) setTimeout(S.thud, 330);
      var msg = (EN() ? 'Hello Stan, my file is ready:\n' : 'Bonjour Stan, mon dossier est prêt :\n') + list.join('\n') + (EN() ? '\nCan we talk?' : '\nOn en parle ?');
      send.href = base + '?text=' + encodeURIComponent(msg);
    }
    checks.forEach(function (c) { c.querySelector('input').addEventListener('change', function () { S.paper(); update(); }); });
    update();
  })();

  /* ═ 3 · TAMPON ACD ═ */
  (function () {
    var card = document.getElementById('fin-03'); if (!card) return; var cta = card.querySelector('.financement-step-cta');
    var z = el('div', { 'class': 'fx-acd', role: 'button', tabindex: '0', 'aria-label': 'Tamponner : terrain vérifié' });
    z.innerHTML = '<span class="fx-acd-hint">' + bi('Appuyez — terrain ACD vérifié', 'Press — ACD land checked') + '</span>' +
      '<svg class="fx-acd-tool" viewBox="0 0 54 80" aria-hidden="true"><defs><linearGradient id="fxWood" x1="0" x2="1"><stop offset="0" stop-color="#3b2716"/><stop offset="0.5" stop-color="#7a5230"/><stop offset="1" stop-color="#2e1e10"/></linearGradient><linearGradient id="fxMetal" x1="0" x2="1"><stop offset="0" stop-color="#2a2a2d"/><stop offset="0.5" stop-color="#8d887d"/><stop offset="1" stop-color="#222225"/></linearGradient></defs>' +
      '<ellipse cx="27" cy="14" rx="15" ry="13" fill="url(#fxWood)"/><rect x="21" y="24" width="12" height="26" rx="3" fill="url(#fxWood)"/><rect x="6" y="50" width="42" height="16" rx="2" fill="url(#fxMetal)"/><rect x="8" y="66" width="38" height="8" rx="1.5" fill="#7a1a14"/></svg>';
    card.insertBefore(z, cta);
    var busy = false;
    function press() {
      if (busy) return; busy = true; z.classList.add('press');
      setTimeout(function () {
        S.thud();
        var old = z.querySelector('.fx-acd-mark'); if (old) old.remove();
        var w = z.clientWidth, rot = (Math.random() * 24 - 16).toFixed(1);
        var m = el('div', { 'class': 'fx-acd-mark' });
        m.style.left = (w - 18 - 27 - 70 - 48 + (Math.random() * 10 - 5)) + 'px'; m.style.top = (14 + Math.random() * 6) + 'px'; m.style.transform = 'rotate(' + rot + 'deg)';
        m.innerHTML = '<svg viewBox="0 0 96 96" width="96" height="96"><defs><path id="fxArc" d="M48,48 m-33,0 a33,33 0 1,1 66,0 a33,33 0 1,1 -66,0"/></defs><circle cx="48" cy="48" r="44" fill="none" stroke="#d2463c" stroke-width="3"/><circle cx="48" cy="48" r="25" fill="none" stroke="#d2463c" stroke-width="1.5"/>' +
          '<text font-family="Jost, sans-serif" font-size="8.6" font-weight="600" letter-spacing="2" fill="#d2463c"><textPath href="#fxArc">' + (EN() ? 'LAND CHECKED · GREATER ABIDJAN ·' : 'TERRAIN VÉRIFIÉ · GRAND ABIDJAN ·') + '</textPath></text>' +
          '<text x="48" y="53" text-anchor="middle" font-family="Jost, sans-serif" font-weight="700" font-size="15" letter-spacing="1" fill="#d2463c">ACD</text></svg>';
        z.appendChild(m); requestAnimationFrame(function () { m.classList.add('show'); });
        z.classList.add('used');
      }, 170);
      setTimeout(function () { z.classList.remove('press'); busy = false; }, 420);
    }
    z.addEventListener('click', press);
    z.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); press(); } });
  })();

  /* ═ 4 · BALANCE DES CABOSSES ═ */
  (function () {
    var card = document.getElementById('fin-04'); if (!card) return; var cta = card.querySelector('.financement-step-cta');
    var w = el('div', { 'class': 'fx-scale' });
    w.innerHTML = '<svg viewBox="0 0 260 150" aria-label="Balance : coopérative et cabosses">' +
      '<defs><linearGradient id="fxBrass" x1="0" x2="1"><stop offset="0" stop-color="#6e5030"/><stop offset="0.5" stop-color="#E7C08A"/><stop offset="1" stop-color="#7a5a35"/></linearGradient>' +
      '<radialGradient id="fxPod" cx="0.35" cy="0.35" r="0.8"><stop offset="0" stop-color="#e9a15a"/><stop offset="0.6" stop-color="#b0612a"/><stop offset="1" stop-color="#5c2c12"/></radialGradient></defs>' +
      '<path d="M100 146 L160 146 L150 136 L110 136 Z" fill="url(#fxBrass)"/><rect x="127" y="32" width="6" height="106" fill="url(#fxBrass)"/>' +
      '<g class="fx-beam"><rect x="38" y="28" width="184" height="4" rx="2" fill="url(#fxBrass)"/></g><circle cx="130" cy="30" r="6" fill="url(#fxBrass)" stroke="#3b2c1a" stroke-width="1"/>' +
      '<g class="fx-pan-l"><line x1="0" y1="0" x2="-24" y2="42" stroke="#8d7550" stroke-width="0.8"/><line x1="0" y1="0" x2="24" y2="42" stroke="#8d7550" stroke-width="0.8"/><path d="M-30 42 Q0 58 30 42 Z" fill="url(#fxBrass)"/>' +
        '<rect x="-15" y="24" width="30" height="20" rx="1.5" fill="#EDE8DC"/><line x1="-10" y1="30" x2="8" y2="30" stroke="#8f8778" stroke-width="1.6"/><line x1="-10" y1="35" x2="10" y2="35" stroke="#c9c2b2" stroke-width="1"/><line x1="-10" y1="39" x2="4" y2="39" stroke="#c9c2b2" stroke-width="1"/></g>' +
      '<g class="fx-pan-r"><line x1="0" y1="0" x2="-24" y2="42" stroke="#8d7550" stroke-width="0.8"/><line x1="0" y1="0" x2="24" y2="42" stroke="#8d7550" stroke-width="0.8"/><path d="M-30 42 Q0 58 30 42 Z" fill="url(#fxBrass)"/><g class="fx-pods"></g></g>' +
      '</svg><div class="fx-scale-row"><button type="button" class="fx-scale-btn">' + bi('+ Déposer une cabosse', '+ Add a cocoa pod') + '</button><span class="fx-scale-state"></span></div>';
    card.insertBefore(w, cta);
    var svg = w.querySelector('svg'), beam = w.querySelector('.fx-beam'), pl = w.querySelector('.fx-pan-l'), pr = w.querySelector('.fx-pan-r'), pods = w.querySelector('.fx-pods'), st = w.querySelector('.fx-scale-state');
    var n = 0, a = -13.5, v = 0, spots = [[-12, 36], [0, 37], [12, 36], [-6, 29], [6, 29], [0, 22]];
    function label() {
      var fr, en;
      if (n < 3) { fr = 'Il manque ' + (3 - n) + ' cabosse' + (3 - n > 1 ? 's' : '') + ' pour équilibrer'; en = (3 - n) + ' more pod' + (3 - n > 1 ? 's' : '') + ' to balance'; }
      else if (n === 3) { fr = 'Équilibre trouvé — la filière finance'; en = 'Balanced — the sector lends'; }
      else { fr = 'La coopérative pèse : dossier solide'; en = 'The co-op carries weight: strong file'; }
      st.innerHTML = bi(fr, en); w.classList.toggle('balanced', n >= 3);
    }
    function add() {
      if (n >= 6) { pods.innerHTML = ''; n = 0; S.noise(0.3, { f: 600, g: 0.5 }); label(); return; }
      var s = spots[n], g = document.createElementNS(NS, 'g');
      g.setAttribute('transform', 'translate(' + s[0] + ',' + s[1] + ') rotate(' + (Math.random() * 30 - 15).toFixed(0) + ')');
      g.innerHTML = '<g class="fx-pod"><ellipse rx="10" ry="5.6" fill="url(#fxPod)"/><path d="M-7 -1 Q0 -3 7 -1 M-7 2 Q0 0 7 2" stroke="rgba(60,25,8,0.55)" stroke-width="0.8" fill="none"/><path d="M10 0 l3 -1" stroke="#5c2c12" stroke-width="1.4"/></g>';
      pods.appendChild(g); n++; S.tock(); label();
    }
    w.querySelector('.fx-scale-btn').addEventListener('click', add);
    svg.addEventListener('click', add);
    var prev = performance.now();
    (function tick(now) {
      var dt = Math.min(0.033, (now - prev) / 1000); prev = now;
      var target = Math.max(-13.5, Math.min(13.5, (n - 3) * 4.5));
      v += ((target - a) * 60 - v * 5.5) * dt; a += v * dt;
      var r = a * Math.PI / 180, lx = 130 - 90 * Math.cos(r), ly = 30 - 90 * Math.sin(r), rx = 130 + 90 * Math.cos(r), ry = 30 + 90 * Math.sin(r);
      beam.setAttribute('transform', 'rotate(' + a.toFixed(2) + ' 130 30)');
      pl.setAttribute('transform', 'translate(' + lx.toFixed(1) + ',' + ly.toFixed(1) + ')');
      pr.setAttribute('transform', 'translate(' + rx.toFixed(1) + ',' + ry.toFixed(1) + ')');
      requestAnimationFrame(tick);
    })(prev);
    label();
  })();

  /* ═ 6 · TÉLÉPHONE WHATSAPP ═ */
  (function () {
    var bd = null, busy = false;
    function build() {
      bd = el('div', { 'class': 'fx-phone-bd', role: 'dialog', 'aria-label': 'Envoi WhatsApp' });
      bd.innerHTML = '<div class="fx-phone"><div class="fx-phone-screen"><span class="fx-phone-notch"></span>' +
        '<div class="fx-phone-status"><span class="fx-phone-time"></span><span>●●● 5G</span></div>' +
        '<div class="fx-phone-notif"><b>STAN LÉVIS</b><span class="fx-phone-notif-t"></span></div>' +
        '<div class="fx-phone-head"><span class="fx-phone-av">SL</span><span class="fx-phone-name">Stan Lévis<small>' + bi('en ligne', 'online') + '</small></span></div>' +
        '<div class="fx-phone-chat"><div class="fx-bubble"><span class="fx-bubble-t"></span><i>✓</i></div></div>' +
        '</div><button type="button" class="fx-phone-skip">' + bi('Ouvrir WhatsApp maintenant →', 'Open WhatsApp now →') + '</button></div>';
      document.body.appendChild(bd);
    }
    function reset() { busy = false; document.body.classList.remove('fx-menu-open'); document.body.style.overflow = ''; if (bd) bd.classList.remove('show'); }
    window.addEventListener('pageshow', reset);
    window.addEventListener('focus', reset);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) reset(); });
    var MOB = function () { return window.matchMedia('(hover: none), (max-width: 900px)').matches; };
    function go(href) {
      if (MOB()) { reset(); location.href = href; return; }
      var w = window.open(href, '_blank');
      if (w) { try { w.opener = null; } catch (e) {} reset(); return true; }
      return false;
    }
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href*="wa.me"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || busy) return;
      if (RM) return;
      waFix(a);
      e.preventDefault(); busy = true; clearTimeout(window.__fxBusyT); window.__fxBusyT = setTimeout(reset, 4000);
      if (!bd) build();
      var href = a.href, txt = ''; try { txt = new URL(href).searchParams.get('text') || ''; } catch (err) {}
      if (!txt) txt = EN() ? 'Hello Stan 👋' : 'Bonjour Stan 👋';
      var short = txt;
      var phone = bd.querySelector('.fx-phone'), tEl = bd.querySelector('.fx-bubble-t'), tick = bd.querySelector('.fx-bubble i'), notif = bd.querySelector('.fx-phone-notif');
      var d = new Date(); bd.querySelector('.fx-phone-time').textContent = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
      bd.querySelector('.fx-phone-notif-t').textContent = EN() ? 'Message received — I reply fast.' : 'Message reçu — je vous réponds vite.';
      tEl.textContent = ''; tick.textContent = '✓'; tick.classList.remove('read'); notif.classList.remove('show'); phone.classList.remove('buzz');
      requestAnimationFrame(function () { bd.classList.add('show'); });
      var i = 0, step = Math.max(1, Math.ceil(short.length / 40)), done = false;
      var typer = setInterval(function () { i += step; tEl.textContent = short.slice(0, i); if (i % 6 === 0) S.tone(1800 + Math.random() * 400, 0.02, { g: 0.008 }); if (i >= short.length) clearInterval(typer); }, 22);
      var t1 = setTimeout(function () { tick.textContent = '✓✓'; tick.classList.add('read'); phone.classList.add('buzz'); S.vibe(); notif.classList.add('show'); }, 1100);
      function finish() {
        if (done) return; done = true; clearInterval(typer); clearTimeout(t1); clearTimeout(t2); clearTimeout(window.__fxBusyT);
        tEl.textContent = short; tick.textContent = '✓✓'; tick.classList.add('read');
        if (go(href) === false) {
          var sk = bd.querySelector('.fx-phone-skip'); sk.classList.add('fx-cta-now');
          sk.onclick = function () { var w = window.open(href, '_blank'); if (w) { try { w.opener = null; } catch (e) {} } reset(); };
        }
      }
      var t2 = setTimeout(finish, 2600);
      var skb = bd.querySelector('.fx-phone-skip'); skb.classList.remove('fx-cta-now'); skb.onclick = function () { if (MOB()) { finish(); return; } done = true; clearInterval(typer); clearTimeout(t1); clearTimeout(t2); var w = window.open(href, '_blank'); if (w) { try { w.opener = null; } catch (e) {} } reset(); };
      bd.onclick = function (ev) { if (ev.target === bd) { done = true; clearInterval(typer); clearTimeout(t1); clearTimeout(t2); bd.classList.remove('show'); busy = false; } };
    }, true);
  })();

  /* ═ 7 · NÉON « OUVERT » ═ */
  (function () {
    var foot = document.querySelector('footer'); if (!foot) return; var copy = foot.querySelector('.footer-copy');
    var w = el('div', { 'class': 'fx-neon-wrap' });
    w.innerHTML = '<button type="button" class="fx-neon" aria-pressed="false">' + bi('Ouvert', 'Open') + '</button><p class="fx-neon-meta"></p>';
    var slot = foot.querySelector('.ft-neon-slot'); if (slot) slot.appendChild(w); else foot.insertBefore(w, copy);
    var n = w.querySelector('.fx-neon'), meta = w.querySelector('.fx-neon-meta');
    function hhmm() { var d = new Date(), h = d.getUTCHours(), m = d.getUTCMinutes(); return { h: h, s: ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2) }; }
    var night = (function () { var h = hhmm().h; return h >= 18 || h < 6; })();
    function render() {
      var t = hhmm().s, on = n.classList.contains('on');
      meta.innerHTML = on
        ? bi('Abidjan · <b>' + t + '</b><br>Écrivez-moi, je réponds.', 'Abidjan · <b>' + t + '</b><br>Write to me, I reply.')
        : bi('Le néon s\'allume à la nuit tombée · Abidjan <b>' + t + '</b><br>Cliquez pour l\'allumer quand même.', 'The neon lights up at nightfall · Abidjan <b>' + t + '</b><br>Click to switch it on anyway.');
    }
    function set(on, fx) {
      n.classList.toggle('on', on); n.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (fx) { S.buzz(on ? 0.5 : 0.12); if (on) { n.classList.remove('flick'); void n.offsetWidth; n.classList.add('flick'); } }
      render();
    }
    n.addEventListener('click', function () { set(!n.classList.contains('on'), true); });
    set(night, false);
    if (night) { n.classList.add('flick'); }
    setInterval(render, 30000);
    (function randomFlick() {
      setTimeout(function () { if (n.classList.contains('on') && !RM) { n.classList.remove('flick'); void n.offsetWidth; n.classList.add('flick'); } randomFlick(); }, 7000 + Math.random() * 9000);
    })();
  })();

  /* ═ MENU MOBILE ═ */
  (function () {
    var right = document.querySelector('.nav-right'), links = document.querySelectorAll('.nav-links > li'); if (!right || !links.length) return;
    var btn = el('button', { type: 'button', 'class': 'fx-burger', 'aria-label': 'Menu', 'aria-expanded': 'false' }, '<span></span><span></span><span></span>');
    right.appendChild(btn);
    var menu = el('div', { 'class': 'fx-menu', role: 'dialog', 'aria-label': 'Menu' });
    var nums = ['01', '02', '03', '04', '05'], html = '';
    links.forEach(function (li, i) {
      var fr = li.querySelector('a.fr') || li.querySelector('a'), en = li.querySelector('a.en') || fr;
      html += '<a class="fx-menu-link" href="' + fr.getAttribute('href') + '">' + bi(fr.textContent.trim(), en.textContent.trim()) + '<em>' + nums[i] + '</em></a>';
    });
    var soc = document.querySelector('footer .social-icons');
    menu.innerHTML = html + (soc ? soc.outerHTML : '');
    document.body.appendChild(menu);
    function set(open) { document.body.classList.toggle('fx-menu-open', open); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
    btn.addEventListener('click', function () { set(!document.body.classList.contains('fx-menu-open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  })();

  /* ═ 8 · BADGE HOLOGRAPHIQUE ═ */
  (function () {
    if (window.matchMedia('(hover: none), (max-width: 900px)').matches) return;
    var flip = document.querySelector('.badge-flip'), badge = document.querySelector('.stan-badge'); if (!flip || !badge) return;
    flip.appendChild(el('div', { 'class': 'fx-holo front', 'aria-hidden': 'true' }));
    flip.appendChild(el('div', { 'class': 'fx-holo back', 'aria-hidden': 'true' }));
    var hero = document.querySelector('.hero') || document.body, pend = false, lx = 0, ly = 0;
    hero.addEventListener('mousemove', function (e) {
      lx = e.clientX; ly = e.clientY; if (pend) return; pend = true;
      requestAnimationFrame(function () {
        pend = false; var r = badge.getBoundingClientRect();
        var hx = (lx - r.left) / r.width * 100, hy = (ly - r.top) / r.height * 100;
        var dist = Math.hypot(lx - (r.left + r.width / 2), ly - (r.top + r.height / 2)) / Math.max(r.width, 1);
        flip.style.setProperty('--hx', Math.max(-20, Math.min(120, hx)).toFixed(1) + '%');
        flip.style.setProperty('--hy', Math.max(-20, Math.min(120, hy)).toFixed(1) + '%');
        flip.style.setProperty('--ha', ((hx - 50) * 0.5).toFixed(1) + 'deg');
        flip.style.setProperty('--holo-o', Math.max(0.18, 0.6 - dist * 0.25).toFixed(2));
      });
    });
  })();
})();
