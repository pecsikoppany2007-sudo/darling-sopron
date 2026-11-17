/* Darling – hangkulissza. Minden hang itt születik (Web Audio), nincs hangfájl, nincs külső kérés.
   Alapból KI van kapcsolva; a fejléc „Hang” gombja kapcsolja, a választást megjegyzi (localStorage dl-hang).
   Szintek (a profi UI-hangkészletek szerint): pillanat (bekapcsolás, kicsengés) > visszajelzés (kattintás) > pötty (gomb fölé vitel, < 100 ms indulás).
   Kifelé: window.DLS = { on, dialOut(n, mp), dialBack(n, mp), ring(), lamp(x) } */
(function () {
  'use strict';
  var AC = window.AudioContext || window.webkitAudioContext;
  var html = document.documentElement;
  var KEY = 'dl-hang';
  var want = false; try { want = localStorage.getItem(KEY) === '1'; } catch (e) {}
  var ctx = null, master, comp, verb, verbIn, amb = null, noiseBuf = null, crackBuf = null;
  var api = { on: false, dialOut: nop, dialBack: nop, ring: nop, lamp: nop };
  window.DLS = api;
  function nop() {}
  if (!AC) { html.classList.add('no-snd'); return; }

  /* ---------------------------------------------------------------- hangmotor */
  function init() {
    if (ctx) return;
    ctx = new AC({ latencyHint: 'interactive' });
    comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.knee.value = 12; comp.ratio.value = 3; comp.attack.value = .004; comp.release.value = .2;
    master = ctx.createGain(); master.gain.value = 0;
    master.connect(comp); comp.connect(ctx.destination);
    /* terem: 1,9 mp-es sötét, lecsengő zengés (generált), csak egy csipet megy bele */
    verb = ctx.createConvolver(); verb.buffer = impulse(1.9, 2.6);
    var vlp = ctx.createBiquadFilter(); vlp.type = 'lowpass'; vlp.frequency.value = 2600;
    verbIn = ctx.createGain(); verbIn.gain.value = .9;
    verbIn.connect(verb); verb.connect(vlp); vlp.connect(master);
    noiseBuf = makeNoise(2, 'pink');
    crackBuf = makeCrackle(6);
  }
  function impulse(sec, decay) {
    var n = Math.floor(ctx.sampleRate * sec), b = ctx.createBuffer(2, n, ctx.sampleRate);
    for (var c = 0; c < 2; c++) { var d = b.getChannelData(c); for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, decay) * (i < 90 ? i / 90 : 1); }
    return b;
  }
  function makeNoise(sec, kind) {
    var n = Math.floor(ctx.sampleRate * sec), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    var b0 = 0, b1 = 0, b2 = 0, last = 0;
    for (var i = 0; i < n; i++) {
      var w = Math.random() * 2 - 1;
      if (kind === 'pink') { b0 = .99765 * b0 + w * .099046; b1 = .963 * b1 + w * .2965164; b2 = .57 * b2 + w * 1.0526913; d[i] = (b0 + b1 + b2 + w * .1848) * .18; }
      else { last = (last + .02 * w) / 1.02; d[i] = last * 3.5; } /* barna */
    }
    return b;
  }
  /* bakelit-sercegés: ritka, eltérő erejű pattanások + halk sziszegés, hurokban */
  function makeCrackle(sec) {
    var sr = ctx.sampleRate, n = Math.floor(sr * sec), b = ctx.createBuffer(2, n, sr);
    for (var c = 0; c < 2; c++) {
      var d = b.getChannelData(c), lp = 0;
      for (var i = 0; i < n; i++) { lp += ((Math.random() * 2 - 1) - lp) * .08; d[i] = lp * .05; }
      var pops = Math.floor(sec * 9);
      for (var p = 0; p < pops; p++) {
        var at = Math.floor(Math.random() * (n - 400)), amp = Math.pow(Math.random(), 3) * .9 + .05, len = 12 + Math.floor(Math.random() * 60);
        for (var k = 0; k < len; k++) d[at + k] += (Math.random() * 2 - 1) * amp * Math.pow(1 - k / len, 2);
      }
    }
    return b;
  }
  function pan(x) { var p = ctx.createStereoPanner ? ctx.createStereoPanner() : null; if (p) p.pan.value = Math.max(-.7, Math.min(.7, x || 0)); return p; }
  /* egy hangforrás kimenete: [szűrő ->] [pan ->] master (+ zengés) */
  function out(node, x, wet) {
    var p = pan(x), last = node;
    if (p) { last.connect(p); last = p; }
    last.connect(master);
    if (wet) { var s = ctx.createGain(); s.gain.value = wet; last.connect(s); s.connect(verbIn); }
  }
  function env(g, t, a, peak, d) { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + a + d); }
  function noiseHit(t, dur, type, freq, q, peak, x, wet) {
    var s = ctx.createBufferSource(); s.buffer = noiseBuf; s.playbackRate.value = .8 + Math.random() * .4;
    var f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    var g = ctx.createGain(); env(g, t, .001, peak, dur);
    s.connect(f); f.connect(g); out(g, x, wet);
    s.start(t, Math.random() * 1.5); s.stop(t + dur + .05);
  }
  function tone(t, f, type, peak, a, d, x, wet, detune) {
    var o = ctx.createOscillator(); o.type = type; o.frequency.value = f; if (detune) o.detune.value = detune;
    var g = ctx.createGain(); env(g, t, a, peak, d);
    o.connect(g); out(g, x, wet); o.start(t); o.stop(t + a + d + .05);
    return o;
  }

  /* ---------------------------------------------------------------- a hangok */
  /* izzószál-csendülés a fénygombokhoz: üveges, nem harmonikus felhang, moll pentaton, sosem kétszer ugyanaz */
  var PENTA = [220, 261.63, 293.66, 329.63, 392, 440, 523.25], lastN = -1;
  function tink(x, big) {
    var t = ctx.currentTime + .005, i;
    do { i = Math.floor(Math.random() * PENTA.length); } while (i === lastN); lastN = i;
    var f = PENTA[i] * 2 * (1 + (Math.random() - .5) * .006);
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3400; lp.Q.value = .3;
    [[1, .07, .9], [2.756, .022, .45], [5.404, .008, .22], [.5, .02, .6]].forEach(function (p) {
      var o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f * p[0];
      var g = ctx.createGain(); env(g, t, .002, p[1] * (big ? 1 : .7), p[2]);
      o.connect(g); g.connect(lp); o.start(t); o.stop(t + p[2] + .1);
    });
    out(lp, x, .45);
    noiseHit(t, .012, 'highpass', 3800, .7, .012, x, 0); /* a kapcsoló érintkezője */
  }
  /* apró pötty a többi linkhez, nyelvgombhoz, fülhöz */
  function tick(x, f) {
    var t = ctx.currentTime + .003;
    noiseHit(t, .018, 'bandpass', f || 3200, 2.2, .045, x, .12);
    tone(t, (f || 3200) * .56, 'sine', .012, .001, .03, x, 0);
  }
  /* kattintás: relé-csattanás, alul egy puha koppanás */
  function clack(x, soft) {
    var t = ctx.currentTime + .003, k = soft ? .55 : 1;
    noiseHit(t, .035, 'bandpass', 1400, 1.4, .16 * k, x, .2);
    noiseHit(t + .028, .02, 'bandpass', 2600, 3, .05 * k, x, .1);
    var o = tone(t, 140, 'sine', .14 * k, .002, .09, x, .1); o.frequency.exponentialRampToValueAtTime(60, t + .09);
  }
  /* lámpa felkapcsol: zümmögő, vibráló izzószál, a CSS-villogás ritmusában */
  var lastLamp = 0;
  function lamp(x) {
    if (!api.on || !ctx || ctx.state !== 'running') return;
    var now = ctx.currentTime; if (now - lastLamp < .5) return; lastLamp = now;
    var t = now + .01;
    var o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 100;
    var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = .9;
    var g = ctx.createGain(); g.gain.setValueAtTime(0, t);
    [[0, .016], [.06, 0], [.12, .02], [.17, .004], [.26, .018], [.3, 0], [.42, .014], [.7, .006], [1.4, 0]].forEach(function (s) { g.gain.linearRampToValueAtTime(s[1], t + s[0]); });
    o.connect(bp); bp.connect(g); out(g, x, .2); o.start(t); o.stop(t + 1.5);
    noiseHit(t, .01, 'highpass', 4500, .7, .03, x, .1);
    noiseHit(t + .12, .008, 'highpass', 5200, .7, .02, x, .1);
    setTimeout(function () { if (api.on) { var tt = ctx.currentTime + .01; tone(tt, 110, 'sine', .02, .05, 1.2, x, .5); tone(tt, 164.8, 'sine', .009, .08, 1.1, x, .5); } }, 420);
  }

  /* tárcsa. Kifelé húzva a racsni kattog lyukanként, visszafelé a régulátor zúg és a szám impulzusai kattannak (mint egy valódi tárcsán) */
  function dialOut(n, dur) {
    if (!api.on || !ctx) return;
    var t = ctx.currentTime + .01, holes = Math.max(1, n);
    whirr(t, dur, 1500, .02);
    for (var i = 0; i < holes; i++) noiseHit(t + dur * (i + .5) / holes, .012, 'bandpass', 3400, 4, .05, .15, .05);
  }
  function dialBack(n, dur) {
    if (!api.on || !ctx) return;
    var t = ctx.currentTime + .02;
    whirr(t, dur, 700, .045, 1);
    for (var i = 0; i < n; i++) {
      var at = t + dur * (i + .6) / (n + .4);
      noiseHit(at, .022, 'bandpass', 2300, 2.5, .12, .12, .12);
      tone(at, 420, 'triangle', .035, .001, .04, .12, 0);
    }
    noiseHit(t + dur, .05, 'bandpass', 900, 1.2, .1, .12, .15); /* az ujjütköző koppanása */
    if (navigator.vibrate && !matchMedia('(hover: hover)').matches) { var pat = []; for (var j = 0; j < n; j++) pat.push(8, Math.max(20, Math.round(dur * 1000 / n) - 8)); try { navigator.vibrate(pat); } catch (e) {} }
  }
  function whirr(t, dur, f, peak, gov) {
    var s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = 5;
    var g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + .04); g.gain.setValueAtTime(peak, t + Math.max(.05, dur - .05)); g.gain.linearRampToValueAtTime(0, t + dur);
    if (gov) { /* régulátor: gyors remegés a zúgásban */
      var lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 34; lg.gain.value = 260; lfo.connect(lg); lg.connect(bp.frequency); lfo.start(t); lfo.stop(t + dur + .05);
    }
    s.connect(bp); bp.connect(g); out(g, .12, .1); s.start(t); s.stop(t + dur + .05);
  }
  /* kicsengés: telefonvonal (300–3400 Hz), 425 Hz-es csengőhang, felveszik… aztán a Darling hangjegye, végül leteszik */
  function lineTone(t, f, on, peak) {
    var o = ctx.createOscillator(); o.frequency.value = f;
    var ws = ctx.createWaveShaper(), cv = new Float32Array(256); for (var i = 0; i < 256; i++) { var v = i / 128 - 1; cv[i] = Math.tanh(v * 2.2); } ws.curve = cv;
    var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 320;
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3300;
    var g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + .02); g.gain.setValueAtTime(peak, t + on - .03); g.gain.linearRampToValueAtTime(0, t + on);
    o.connect(ws); ws.connect(hp); hp.connect(lp); lp.connect(g); out(g, .1, .08); o.start(t); o.stop(t + on + .05);
  }
  function lineHiss(t, dur, peak) {
    var s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1700; bp.Q.value = .6;
    var g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + .15); g.gain.setValueAtTime(peak, t + dur - .2); g.gain.linearRampToValueAtTime(0, t + dur);
    s.connect(bp); bp.connect(g); out(g, .1, 0); s.start(t); s.stop(t + dur + .05);
  }
  /* a Darling hangjegye: puha, elektromos zongora (FM), lassú moll arpeggio, nyitott vége */
  function motif(t) {
    [[220, 0], [329.63, .26], [493.88, .52], [415.3, .95]].forEach(function (n, i) {
      var tt = t + n[1], car = ctx.createOscillator(), mod = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain();
      car.frequency.value = n[0]; mod.frequency.value = n[0] * 2; mg.gain.setValueAtTime(n[0] * 1.6, tt); mg.gain.exponentialRampToValueAtTime(n[0] * .05, tt + 1.4);
      mod.connect(mg); mg.connect(car.frequency);
      env(g, tt, .006, i === 3 ? .07 : .1, i === 3 ? 2.6 : 1.8);
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2200;
      car.connect(g); g.connect(lp); out(lp, (i - 1.5) * .25, .6);
      car.start(tt); mod.start(tt); car.stop(tt + 3); mod.stop(tt + 3);
    });
  }
  function ring() {
    if (!api.on || !ctx) return;
    var t = ctx.currentTime + .05;
    lineHiss(t, 4.6, .012);
    lineTone(t + .45, 425, 1.0, .05);           /* egy kicsengés */
    setTimeout(function () { if (api.on) clack(.1, true); }, 1950); /* felveszik */
    setTimeout(function () { if (api.on) motif(ctx.currentTime + .05); }, 2250);
    setTimeout(function () { if (!api.on) return; clack(.1); var tt = ctx.currentTime + .25; lineTone(tt, 425, .18, .03); lineTone(tt + .36, 425, .18, .03); }, 4500); /* leteszik: foglalt */
  }

  /* háttér: halk bakelit-sercegés, a lámpák 50 Hz-es zúgása, sötét terem-moraj és egy alig hallható, lassan nyíló mély akkord */
  function ambientOn() {
    if (amb) return;
    var t = ctx.currentTime, bus = ctx.createGain(); bus.gain.setValueAtTime(0, t); bus.gain.linearRampToValueAtTime(1, t + 3);
    bus.connect(master); amb = { bus: bus, src: [] };
    var cr = ctx.createBufferSource(); cr.buffer = crackBuf; cr.loop = true;
    var crf = ctx.createBiquadFilter(); crf.type = 'bandpass'; crf.frequency.value = 2400; crf.Q.value = .5;
    var crg = ctx.createGain(); crg.gain.value = .022; cr.connect(crf); crf.connect(crg); crg.connect(bus); cr.start(); amb.src.push(cr);
    var room = ctx.createBufferSource(); room.buffer = makeNoise(4, 'brown'); room.loop = true;
    var rlp = ctx.createBiquadFilter(); rlp.type = 'lowpass'; rlp.frequency.value = 320;
    var rg = ctx.createGain(); rg.gain.value = .03; room.connect(rlp); rlp.connect(rg); rg.connect(bus); room.start(); amb.src.push(room);
    var hum = ctx.createGain(); hum.gain.value = .006; hum.connect(bus);
    [50, 100, 150].forEach(function (f, i) { var o = ctx.createOscillator(); o.frequency.value = f; var g = ctx.createGain(); g.gain.value = [1, .5, .2][i]; o.connect(g); g.connect(hum); o.start(); amb.src.push(o); });
    var trem = ctx.createOscillator(), tg = ctx.createGain(); trem.frequency.value = .11; tg.gain.value = .003; trem.connect(tg); tg.connect(hum.gain); trem.start(); amb.src.push(trem);
    var pad = ctx.createGain(); pad.gain.value = .0; pad.gain.linearRampToValueAtTime(.011, t + 8); pad.connect(bus);
    var plp = ctx.createBiquadFilter(); plp.type = 'lowpass'; plp.frequency.value = 380; plp.Q.value = 2; plp.connect(pad);
    var plfo = ctx.createOscillator(), plg = ctx.createGain(); plfo.frequency.value = .045; plg.gain.value = 160; plfo.connect(plg); plg.connect(plp.frequency); plfo.start(); amb.src.push(plfo);
    [[55, -6], [55, 7], [82.41, 0], [130.81, 4]].forEach(function (p) { var o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = p[0]; o.detune.value = p[1]; o.connect(plp); o.start(); amb.src.push(o); });
  }
  function ambientOff() {
    if (!amb) return; var a = amb, t = ctx.currentTime; amb = null;
    a.bus.gain.cancelScheduledValues(t); a.bus.gain.setValueAtTime(a.bus.gain.value, t); a.bus.gain.linearRampToValueAtTime(0, t + .5);
    setTimeout(function () { a.src.forEach(function (s) { try { s.stop(); } catch (e) {} }); a.bus.disconnect(); }, 700);
  }

  /* ---------------------------------------------------------------- be / ki */
  var VOL = .9;
  function fadeTo(v, sec) { var t = ctx.currentTime; master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t); master.gain.linearRampToValueAtTime(v, t + sec); }
  function start(withCue) {
    init();
    var go = function () {
      api.on = true; fadeTo(document.hidden ? 0 : VOL, .02);
      if (withCue) { var t0 = ctx.currentTime + .04; noiseHit(t0, .035, 'bandpass', 1400, 1.4, .14, 0, .2); var o = tone(t0, 140, 'sine', .12, .002, .09, 0, .1); o.frequency.exponentialRampToValueAtTime(60, t0 + .09); lineHiss(t0 + .06, .9, .012); }
      setTimeout(ambientOn, withCue ? 500 : 0);
    };
    if (ctx.state === 'suspended') ctx.resume().then(go, function () {}); else go();
  }
  function stop() {
    if (!ctx) { api.on = false; return; }
    clack(0, true); api.on = false; ambientOff();
    setTimeout(function () { if (!api.on) { fadeTo(0, .3); setTimeout(function () { if (!api.on && ctx.state === 'running') ctx.suspend(); }, 450); } }, 160);
  }
  function setBtns(v) { document.querySelectorAll('.snd').forEach(function (b) { b.setAttribute('aria-pressed', v ? 'true' : 'false'); }); html.classList.toggle('snd-on', v); }
  function toggle() {
    want = !want; try { localStorage.setItem(KEY, want ? '1' : '0'); } catch (e) {}
    setBtns(want); if (want) start(true); else stop();
  }
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('.snd'); if (b) { e.preventDefault(); toggle(); } });
  setBtns(want);
  /* ha korábban bekapcsolta: az első kattintásnál/billentyűnél indul (a böngésző csak felhasználói mozdulatra enged hangot) */
  if (want) {
    var unlock = function (e) {
      if (e.target.closest && e.target.closest('.snd')) return;
      removeEventListener('pointerdown', unlock, true); removeEventListener('keydown', unlock, true);
      if (want && !api.on) start(false);
    };
    addEventListener('pointerdown', unlock, true); addEventListener('keydown', unlock, true);
  }
  document.addEventListener('visibilitychange', function () { if (ctx && api.on && !window.__dlsTest) fadeTo(document.hidden ? 0 : VOL, .4); });

  /* ---------------------------------------------------------------- kötések */
  function xOf(el) { var r = el.getBoundingClientRect(); return ((r.left + r.width / 2) / innerWidth - .5) * 1.4; }
  var lastT = 0, lastEl = null;
  document.addEventListener('pointerover', function (e) {
    if (!api.on || e.pointerType !== 'mouse' || !ctx || ctx.state !== 'running') return;
    var el = e.target.closest && e.target.closest('.go, .dial__hole, a, button, [role=tab]'); if (!el || el.contains(e.relatedTarget)) return;
    var now = performance.now(); if (now - lastT < 55 || (el === lastEl && now - lastT < 350)) return; lastT = now; lastEl = el;
    if (el.classList.contains('go')) tink(xOf(el), true);
    else if (el.classList.contains('dial__hole')) { var d = +el.getAttribute('data-d'); tick(xOf(el), 1400 + (d === 0 ? 10 : d) * 160); }
    else if (el.classList.contains('snd')) return;
    else tick(xOf(el));
  }, { passive: true });
  document.addEventListener('pointerdown', function (e) {
    if (!api.on || !ctx || ctx.state !== 'running') return;
    var el = e.target.closest && e.target.closest('a, button, [role=tab]'); if (!el || el.classList.contains('snd') || el.closest('.dial')) return;
    clack(xOf(el), !el.classList.contains('go'));
  }, { passive: true });
  document.addEventListener('animationstart', function (e) {
    if (e.animationName === 'lampOn' && api.on) lamp(xOf(e.target));
  });
  api.dialOut = dialOut; api.dialBack = dialBack; api.ring = ring; api.lamp = lamp;
})();
