'use strict';
// ============================================================
// canvas-engine.js - Fable-inspired Generative Art Engine
// Helmi Irfansah Website
// ============================================================

const TAU = Math.PI * 2;

// ── Seeded RNG (mulberry32) ──────────────────────────────────
function mul32(seed) {
  return function () {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function stream(n) {
  const f = mul32((n * 2654435761) >>> 0);
  for (let i = 0; i < 9; i++) f();
  return f;
}

const rd  = (R, a, b) => a + R() * (b - a);
const ri  = (R, a, b) => Math.floor(rd(R, a, b + 1));
const ch_ = (R, p)    => R() < p;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;

// ── Noise ────────────────────────────────────────────────────
function h2(x, y, s) {
  const n = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453;
  return n - Math.floor(n);
}
function fbm(x, y, s, octaves) {
  let a = 0.5, f = 1, t = 0, n = 0;
  for (let i = 0; i < octaves; i++) {
    t += h2(x * f, y * f, s + i * 17) * a;
    n += a; a *= 0.5; f *= 2.03;
  }
  return t / n;
}

// ── Colour helpers ───────────────────────────────────────────
const rgba  = (c, a) => `rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a})`;
const shade = (c, k) => [c[0]*(1-k), c[1]*(1-k), c[2]*(1-k)];
const mix   = (a, b, t) => [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];

// ── Theme-aware colours ──────────────────────────────────────
function getThemeColours() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark'
    || document.body.getAttribute('data-theme') === 'dark';
  return {
    ink:   dark ? [238, 231, 210] : [42,  37,  31],
    cream: dark ? [24,  20,  16]  : [246, 241, 228],
    clay:  dark ? [214, 120, 96]  : [172, 80,  54],
    ochre: dark ? [214, 178, 108] : [176, 132, 50],
    sage:  dark ? [134, 158, 112] : [104, 126, 86],
    gold:  dark ? [228, 200, 138] : [214, 178, 108],
  };
}

// ── Geometry helpers ─────────────────────────────────────────
function resample(pts, step) {
  if (pts.length < 2) return pts.slice();
  const out = [[pts[0][0], pts[0][1]]]; let need = step;
  for (let i = 1; i < pts.length; i++) {
    let x0 = pts[i-1][0], y0 = pts[i-1][1];
    const x1 = pts[i][0], y1 = pts[i][1];
    let d = Math.hypot(x1-x0, y1-y0);
    while (d >= need && d > 0) {
      const t = need / d;
      x0 += (x1-x0)*t; y0 += (y1-y0)*t;
      out.push([x0, y0]);
      d = Math.hypot(x1-x0, y1-y0); need = step;
    }
    need -= d;
  }
  const last = pts[pts.length-1], le = out[out.length-1];
  if (Math.hypot(last[0]-le[0], last[1]-le[1]) > step * 0.2 || out.length < 2)
    out.push([last[0], last[1]]);
  return out;
}

function chaikin(pts, closed, it) {
  while (it-- > 0) {
    const out = [], n = pts.length;
    if (n < 3) return pts;
    if (!closed) out.push(pts[0]);
    const end = closed ? n : n-1;
    for (let i = 0; i < end; i++) {
      const a = pts[i], b = pts[(i+1)%n];
      out.push([a[0]*.75+b[0]*.25, a[1]*.75+b[1]*.25]);
      out.push([a[0]*.25+b[0]*.75, a[1]*.25+b[1]*.75]);
    }
    if (!closed) out.push(pts[n-1]);
    pts = out;
  }
  return pts;
}

function bbox(pts) {
  let x0=1e9, y0=1e9, x1=-1e9, y1=-1e9;
  for (const p of pts) {
    if(p[0]<x0)x0=p[0]; if(p[0]>x1)x1=p[0];
    if(p[1]<y0)y0=p[1]; if(p[1]>y1)y1=p[1];
  }
  return [x0, y0, x1, y1];
}

// ── Wobbling "hand" function ─────────────────────────────────
function wob(R, rs, amp) {
  const n = rs.length, q = [];
  const P1 = rd(R,0,7), P2 = rd(R,0,7), P3 = rd(R,0,7);
  const F1 = rd(R,1.6,3.2), F2 = rd(R,5,9);
  for (let i = 0; i < n; i++) {
    const t = i / (n-1);
    const A = rs[Math.max(0,i-1)], B = rs[Math.min(n-1,i+1)];
    let nx = -(B[1]-A[1]), ny = B[0]-A[0];
    const d = Math.hypot(nx, ny) || 1; nx /= d; ny /= d;
    const off = amp * (
      0.62*Math.sin(t*F1*2+P1) +
      0.28*Math.sin(t*F2+P2)   +
      0.10*Math.sin(t*17+P3)
    );
    q.push([rs[i][0]+nx*off+rd(R,-.3,.3), rs[i][1]+ny*off+rd(R,-.3,.3)]);
  }
  return q;
}

// ── Core sketch stroke ───────────────────────────────────────
function sk(cx, R, pts, o = {}) {
  const w = o.w ?? 1.3, a0 = o.a ?? 0.7;
  const rs = resample(pts, Math.max(2.4, w * 1.5));
  const n = rs.length;
  if (n < 2) return;
  const col = (o.col || [42,37,31]).slice();
  const passes = o.passes ?? 1;
  for (let p = 0; p < passes; p++) {
    const amp   = (o.amp ?? (w*.38+.55)) * (p ? 1.5 : 1);
    const alpha = a0 * (p ? 0.35 : 1);
    const q = wob(R, rs, amp);
    if (o.taper) {
      cx.lineCap = 'round';
      for (let i = 1; i < n; i++) {
        const t = i/(n-1);
        let e;
        if      (o.taper === 'out') e = 0.3 + 0.7*(1-t);
        else if (o.taper === 'in')  e = 0.3 + 0.7*t;
        else e = 0.35 + 0.65*Math.min(1, Math.min(t,1-t)/0.25);
        cx.strokeStyle = rgba(col, alpha * rd(R,.8,1));
        cx.lineWidth   = Math.max(0.5, w*e*rd(R,.85,1.15));
        cx.beginPath(); cx.moveTo(q[i-1][0], q[i-1][1]);
        cx.lineTo(q[i][0], q[i][1]); cx.stroke();
      }
    } else {
      cx.strokeStyle = rgba(col, alpha);
      cx.lineWidth   = w * rd(R,.85,1.12);
      cx.lineCap = 'round'; cx.lineJoin = 'round';
      cx.beginPath();
      for (let i = 0; i < n; i++) {
        if (i === 0) cx.moveTo(q[i][0],q[i][1]);
        else         cx.lineTo(q[i][0],q[i][1]);
      }
      cx.stroke();
    }
  }
}

function dotF(cx, R, x, y, r, a, col) {
  const c = col.slice(), pts = [];
  const n = 8, ph = rd(R,0,7);
  for (let i = 0; i <= n; i++) {
    const t = i/n*TAU, m = 1 + 0.2*Math.sin(t*2+ph);
    pts.push([x+Math.cos(t)*r*m+rd(R,-.2,.2), y+Math.sin(t)*r*m+rd(R,-.2,.2)]);
  }
  cx.beginPath();
  for (let i = 0; i < pts.length; i++) {
    if (i) cx.lineTo(pts[i][0],pts[i][1]);
    else   cx.moveTo(pts[i][0],pts[i][1]);
  }
  cx.closePath();
  cx.fillStyle = rgba(c, a);
  cx.fill();
}

function spark(cx, R, x, y, r, o = {}) {
  const n = o.nR ?? ri(R,5,8);
  const rot = rd(R,0,TAU), col = o.col || [42,37,31];
  for (let i = 0; i < n; i++) {
    const a  = rot + i/n*TAU + rd(R,-.14,.14)/n*TAU;
    const r0 = r*rd(R,.22,.34), r1 = r*rd(R,.85,1.1)*(i%2 ? .78 : 1);
    sk(cx, R, [
      [x+Math.cos(a)*r0, y+Math.sin(a)*r0],
      [x+Math.cos(a)*r1, y+Math.sin(a)*r1]
    ], { col, w: o.w??1.3, a:(o.a??.75)*rd(R,.8,1), taper:'out', amp:.3 });
  }
  if (!o.noCenter && ch_(R,.55))
    dotF(cx, R, x, y, Math.max(1, r*.13), o.a??.75, col);
}

// ── Enso circle ──────────────────────────────────────────────
function enso(cx, R, x, y, r, frac, col, o = {}) {
  const a0 = rd(R,0,TAU), pts = [];
  const n = Math.round(40*frac);
  for (let i = 0; i <= n; i++) {
    const t = a0 + i/n*TAU*frac;
    const rr2 = r*(1 + .03*Math.sin(i*.7));
    pts.push([x+Math.cos(t)*rr2, y+Math.sin(t)*rr2]);
  }
  sk(cx, R, pts, { col, w:o.w??8, a:o.a??.75, amp:2.5, taper:'out', noDust:true });
  sk(cx, R, pts.map(p=>[p[0]+rd(R,1,3), p[1]+rd(R,1,3)]),
    { col, w:(o.w??8)*.35, a:(o.a??.75)*.28, amp:3, noDust:true });
  return a0 + TAU*frac;
}

// ── Floating dots ────────────────────────────────────────────
function floatDots(cx, R, x, y, r, a, col) {
  for (let i = 0; i < 6; i++) {
    const t = rd(R,0,TAU), d = r*rd(R,.4,.9);
    dotF(cx, R, x+Math.cos(t)*d, y+Math.sin(t)*d, rd(R,.8,2), a*rd(R,.4,.9), col);
  }
}

// ============================================================
// ============================================================
// HERO GENERATIVE CANVAS (Seamless Cloud Topology Network)
// ============================================================
function initHeroEnso() {
  const wrap = document.getElementById('hero-enso');
  if (!wrap) return;
  const cv = document.createElement('canvas');
  cv.style.position = 'absolute';
  cv.style.inset = '0';
  cv.style.width = '100%';
  cv.style.height = '100%';
  wrap.style.position = 'relative';
  wrap.appendChild(cv);

  let animFrame = null;
  let phase = 0;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  // Seamless Cloud Topology Nodes (Relative 0..1 coordinates)
  const nodes = [
    { id: 'jkt', name: 'JKT', city: 'Jakarta', colorKey: 'sage', x: 0.28, y: 0.30 },
    { id: 'sgp', name: 'SGP', city: 'Singapore', colorKey: 'gold', x: 0.72, y: 0.24 },
    { id: 'hub', name: 'CORE', city: 'Cloud Gateway', colorKey: 'clay', x: 0.50, y: 0.52 },
    { id: 'fra', name: 'FRA', city: 'Frankfurt', colorKey: 'ochre', x: 0.24, y: 0.74 },
    { id: 'tyo', name: 'TYO', city: 'Tokyo', colorKey: 'gold', x: 0.78, y: 0.70 },
  ];

  const links = [
    [0, 1], [0, 2], [1, 2],
    [2, 3], [2, 4], [3, 4],
    [0, 3], [1, 4]
  ];

  const heroInner = wrap.closest('.hero-inner') || wrap;
  heroInner.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  });

  heroInner.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  function draw() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = wrap.getBoundingClientRect();
    const w = rect.width  || 360;
    const h = rect.height || 360;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
      cv.width  = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
    }

    const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const C = getThemeColours();

    mouseX += (targetX - mouseX) * 0.08;
    mouseY += (targetY - mouseY) * 0.08;

    const pts = nodes.map(n => {
      const depth = (n.id === 'hub') ? 0.25 : 0.65;
      const px = n.x * w + mouseX * 14 * depth;
      const py = n.y * h + mouseY * 14 * depth;
      return { ...n, px, py };
    });

    // 1. Concentric orbital resonance rings (breathing gently with chalk texture)
    ctx.save();
    ctx.beginPath();
    ctx.arc(w / 2 + mouseX * 4, h / 2 + mouseY * 4, Math.min(w, h) * 0.42, 0, Math.PI * 2);
    ctx.strokeStyle = rgba(C.ink, 0.08);
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(w / 2 + mouseX * 2, h / 2 + mouseY * 2, Math.min(w, h) * 0.22, 0, Math.PI * 2);
    ctx.strokeStyle = rgba(C.clay, 0.20);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // 2. Network links connecting nodes (drawn with organic hand-drawn sketch texture)
    links.forEach((pair, idx) => {
      const p1 = pts[pair[0]];
      const p2 = pts[pair[1]];

      sk(ctx, stream(400 + idx * 17), [
        [p1.px, p1.py],
        [p2.px, p2.py]
      ], { col: C.ink, w: 1.1, a: 0.32, amp: 0.65, noDust: true });
    });

    // 3. Moving Data Packets (Pulsing glowing packets along the lines)
    links.forEach((pair, idx) => {
      const p1 = pts[pair[0]];
      const p2 = pts[pair[1]];
      const speed = 0.006;
      const prog = (phase * speed * 60 + idx * 0.18) % 1;

      const packetX = p1.px + (p2.px - p1.px) * prog;
      const packetY = p1.py + (p2.py - p1.py) * prog;

      ctx.beginPath();
      ctx.arc(packetX, packetY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = rgba(C.clay, 0.95);
      ctx.shadowColor = rgba(C.clay, 0.8);
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // 4. Server Nodes with artisanal rings and halo
    pts.forEach(n => {
      const nodeCol = C[n.colorKey] || C.clay;

      // Organic Pulse Halo
      const pulseSize = 13 + Math.sin(phase * 2 + n.x * 8) * 3.5;
      ctx.beginPath();
      ctx.arc(n.px, n.py, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = rgba(nodeCol, 0.14);
      ctx.fill();

      // Outer ring
      ctx.beginPath();
      ctx.arc(n.px, n.py, 7, 0, Math.PI * 2);
      ctx.strokeStyle = rgba(nodeCol, 0.85);
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Core dot
      ctx.beginPath();
      ctx.arc(n.px, n.py, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = rgba(nodeCol, 1);
      ctx.fill();

      // Primary Node Code Label
      ctx.font = '600 10px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillStyle = rgba(C.ink, 0.88);
      ctx.textAlign = 'center';
      ctx.fillText(n.name, n.px, n.py + 18);

      // Sub-label (City / Region)
      ctx.font = '400 8.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = rgba(C.ink, 0.50);
      ctx.fillText(n.city, n.px, n.py + 28);
    });

    // Central Core Gateway Spark
    spark(ctx, stream(55), pts[2].px, pts[2].py, 15, { col: C.clay, a: 0.90, w: 1.6, nR: 6 });
  }

  function tick() {
    phase += 0.012;
    draw();
    animFrame = requestAnimationFrame(tick);
  }

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    draw();
  } else {
    tick();
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(draw, 120);
  });

  window.addEventListener('themechange', draw);
  return () => { if (animFrame) cancelAnimationFrame(animFrame); };
}

// ============================================================
// AMBIENT BACKGROUND CANVAS (fixed, behind content)
// ============================================================
function initAmbientCanvas() {
  const wallEl = document.getElementById('canvas-wall');
  if (!wallEl) return;

  const cv = document.createElement('canvas');
  wallEl.appendChild(cv);
  const ctx = cv.getContext('2d');
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width  = window.innerWidth  * dpr;
    cv.height = window.innerHeight * dpr;
    cv.style.width  = window.innerWidth  + 'px';
    cv.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    drawAmbient();
  }

  function drawAmbient() {
    const W = window.innerWidth, H = window.innerHeight;
    const C = getThemeColours();
    ctx.clearRect(0, 0, W, H);

    // Very subtle scatter marks - reads as paper texture, not random lines
    const R = stream(777);
    const n = 14;
    for (let i = 0; i < n; i++) {
      const x = rd(R, 0.05*W, 0.95*W);
      const y = rd(R, 0.05*H, 0.95*H);
      const kind = ri(R, 0, 3);
      const a = rd(R, 0.025, 0.06);
      if (kind === 0) {
        dotF(ctx, R, x, y, rd(R,1,2.2), a, C.ink);
      } else if (kind === 1) {
        spark(ctx, R, x, y, rd(R,5,10), { col:C.ochre, a:a*0.7, w:0.6, nR:4, noCenter:true });
      } else {
        // Very short arc
        const pts = [];
        const r2 = rd(R,6,14), a0=rd(R,0,TAU), frac=rd(R,.2,.5);
        for (let j=0;j<=8;j++) {
          const t = a0+j/8*TAU*frac;
          pts.push([x+Math.cos(t)*r2, y+Math.sin(t)*r2]);
        }
        sk(ctx, R, pts, { col:C.sage, w:0.6, a, amp:.3 });
      }
    }

    // Thread - a single faint golden meandering line
    const TR = stream(888);
    const threadPts = [];
    const steps = 50;
    for (let i = 0; i <= steps; i++) {
      const t = i/steps;
      const tx = W * (0.08 + 0.84*t);
      const ty = H * (0.5 + 0.18*Math.sin(t*TAU*1.4 + 1.1) + 0.05*Math.sin(t*TAU*3.8));
      threadPts.push([tx + rd(TR,-2,2), ty + rd(TR,-1,1)]);
    }
    sk(ctx, TR, threadPts, { col:C.gold, w:1.0, a:0.10, amp:0.8 });
  }

  resize();
  window.addEventListener('resize', () => { clearTimeout(window._ambTimer); window._ambTimer = setTimeout(resize, 150); });
  window.addEventListener('themechange', drawAmbient);
}

// ============================================================
// GRAPHITE CURSOR TRAIL
// ============================================================
function initCursorTrail() {
  const trailCv = document.getElementById('trail-canvas');
  if (!trailCv) return;
  const trailCx = trailCv.getContext('2d');

  let TP = [];
  const LIFE = 3200;

  function sizeTrail() {
    const d = Math.min(2, devicePixelRatio || 1);
    trailCv.width  = innerWidth  * d;
    trailCv.height = innerHeight * d;
    trailCv.style.width  = innerWidth  + 'px';
    trailCv.style.height = innerHeight + 'px';
    trailCx.setTransform(d, 0, 0, d, 0, 0);
    trailCx.lineCap = 'round';
  }
  sizeTrail();
  window.addEventListener('resize', sizeTrail);

  window.addEventListener('pointermove', e => {
    const t = performance.now();
    const L = TP[TP.length-1];
    if (L && Math.hypot(e.clientX-L.x, e.clientY-L.y) < 3) return;
    TP.push({ x:e.clientX, y:e.clientY, t });
    if (TP.length > 350) TP.shift();
  }, { passive:true });

  function drawTrail(now) {
    trailCx.clearRect(0, 0, innerWidth, innerHeight);
    if (TP.length < 2) { requestAnimationFrame(drawTrail); return; }

    const dark = document.body.getAttribute('data-theme') === 'dark';
    const col = dark ? [238, 231, 210] : [42, 37, 31];

    while (TP.length && now - TP[0].t > LIFE) TP.shift();
    for (let i = 1; i < TP.length; i++) {
      const a = TP[i-1], b = TP[i];
      if (b.t - a.t > 100) continue;
      const age = (now - b.t) / LIFE;
      const k = 1 - age;
      if (k <= 0) continue;
      const wobx = Math.sin(now*.0011+i*.7)*1.2*age;
      const woby = Math.cos(now*.0009+i*1.1)*1.2*age;
      trailCx.strokeStyle = rgba(col, 0.18*k*k);
      trailCx.lineWidth   = 0.7 + 1.5*k;
      trailCx.beginPath();
      trailCx.moveTo(a.x+wobx, a.y+woby);
      trailCx.lineTo(b.x+wobx, b.y+woby);
      trailCx.stroke();
    }
    requestAnimationFrame(drawTrail);
  }
  requestAnimationFrame(drawTrail);
}

// ============================================================
// THEME TOGGLE
// ============================================================
function initThemeToggle() {
  const btn       = document.getElementById('theme-toggle');
  const body      = document.body;
  const metaTheme = document.getElementById('theme-color-meta');

  const saved  = localStorage.getItem('hi-theme');
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const initial = saved || system;

  function applyTheme(theme) {
    body.setAttribute('data-theme', theme);
    body.className = theme;
    if (metaTheme) metaTheme.content = theme === 'dark' ? '#181410' : '#F6F1E4';
    localStorage.setItem('hi-theme', theme);
    window.dispatchEvent(new Event('themechange'));
  }

  applyTheme(initial);

  if (btn) {
    btn.addEventListener('click', () => {
      const current = body.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('hi-theme')) applyTheme(e.matches ? 'dark' : 'light');
  });
}


// ============================================================
// INIT
// ============================================================
function init() {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  initThemeToggle();
  initHeroEnso();
  initAmbientCanvas();
  if (!reducedMotion) initCursorTrail();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
