'use strict';
// ============================================================
// tools.js - Interactive Calculators
// Helmi Irfansah Website
// ============================================================

// ── Cloud Pricing Data (September 2026, USD→IDR @16000) ──────
let USD_IDR = 16000;

const CLOUD_PROVIDERS = [
  {
    name: 'DigitalOcean',
    flag: '🇺🇸',
    // Pricing model: baseCPU + baseRAM + baseStorage + bandwidth
    cpuRate:     4.00,   // USD per vCPU/month
    ramRate:     0.50,   // USD per GB RAM/month
    storageRate: 0.10,   // USD per GB SSD/month
    bwRate:      0.01,   // USD per GB over free allowance
    bwFree:      1000,   // GB free transfer per TB => 1 TB
    note:        'Harga Premium Droplet'
  },
  {
    name: 'Vultr',
    flag: '🇺🇸',
    cpuRate:     3.50,
    ramRate:     0.45,
    storageRate: 0.08,
    bwRate:      0.01,
    bwFree:      1024,
    note:        'Cloud Compute Regular'
  },
  {
    name: 'AWS EC2 + EBS',
    flag: '🌐',
    cpuRate:     5.50,
    ramRate:     0.70,
    storageRate: 0.10,
    bwRate:      0.09,
    bwFree:      100,
    note:        'On-Demand ap-southeast-1'
  },
  {
    name: 'Google Cloud',
    flag: '🌐',
    cpuRate:     5.20,
    ramRate:     0.65,
    storageRate: 0.085,
    bwRate:      0.08,
    bwFree:      200,
    note:        'N1 Standard, asia-southeast2'
  },
  {
    name: 'Biznet Gio (ID)',
    flag: '🇮🇩',
    cpuRate:     3.20,
    ramRate:     0.40,
    storageRate: 0.07,
    bwRate:      0.005,
    bwFree:      2000,
    note:        'Data center Jakarta (IDR lokal)'
  },
  {
    name: 'IDCloudHost (ID)',
    flag: '🇮🇩',
    cpuRate:     2.80,
    ramRate:     0.35,
    storageRate: 0.065,
    bwRate:      0.004,
    bwFree:      2048,
    note:        'Cloud VPS NVMe, Jakarta'
  },
];

// ── AI Pricing Data ───────────────────────────────────────────
// Prices in USD per 1 Million tokens (input / output)
const AI_MODELS = [
  { name: 'GPT-4o',            provider: 'OpenAI',    inputPer1M:  5.00, outputPer1M: 15.00 },
  { name: 'GPT-4o mini',       provider: 'OpenAI',    inputPer1M:  0.15, outputPer1M:  0.60 },
  { name: 'Claude 3.7 Sonnet', provider: 'Anthropic', inputPer1M:  3.00, outputPer1M: 15.00 },
  { name: 'Claude 3.5 Haiku',  provider: 'Anthropic', inputPer1M:  0.80, outputPer1M:  4.00 },
  { name: 'Gemini 2.5 Pro',    provider: 'Google',    inputPer1M:  2.50, outputPer1M: 10.00 },
  { name: 'Gemini 2.5 Flash',  provider: 'Google',    inputPer1M:  0.075,outputPer1M:  0.30 },
];

// ── Helpers ───────────────────────────────────────────────────
function formatIDR(amount) {
  if (amount >= 1_000_000) {
    return 'Rp ' + (amount / 1_000_000).toFixed(2).replace('.', ',') + ' jt';
  }
  return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
}

function calcCloudCost(provider, vcpu, ramGB, storageGB, bwTB) {
  const bwGB = bwTB * 1000;
  const cpuCost     = provider.cpuRate     * vcpu;
  const ramCost     = provider.ramRate     * ramGB;
  const storageCost = provider.storageRate * storageGB;
  const bwOver      = Math.max(0, bwGB - provider.bwFree);
  const bwCost      = provider.bwRate * bwOver;
  const totalUSD    = cpuCost + ramCost + storageCost + bwCost;
  return { totalUSD, totalIDR: totalUSD * USD_IDR };
}

function calcAICost(model, inputKTokensDay, outputKTokensDay) {
  const inputMDay  = inputKTokensDay  / 1000;
  const outputMDay = outputKTokensDay / 1000;
  const dayUSD  = model.inputPer1M * inputMDay + model.outputPer1M * outputMDay;
  const monthUSD = dayUSD * 30;
  return { dayUSD, monthUSD, dayIDR: dayUSD*USD_IDR, monthIDR: monthUSD*USD_IDR };
}

// ── Cloud Calculator Render ───────────────────────────────────
function renderCloudResults() {
  const vcpu    = parseInt(document.getElementById('vcpu')?.value    || 4, 10);
  const ramGB   = parseInt(document.getElementById('ram')?.value     || 8, 10);
  const storGB  = parseInt(document.getElementById('storage')?.value || 100, 10);
  const bwTB    = parseInt(document.getElementById('transfer')?.value || 2, 10);

  // Update output labels
  const setOut = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
  setOut('vcpu-val',     vcpu    + ' vCPU');
  setOut('ram-val',      ramGB   + ' GB');
  setOut('storage-val',  storGB  + ' GB');
  setOut('transfer-val', bwTB    + ' TB');

  const results = CLOUD_PROVIDERS.map(p => ({
    provider: p,
    ...calcCloudCost(p, vcpu, ramGB, storGB, bwTB)
  }));

  results.sort((a, b) => a.totalIDR - b.totalIDR);
  const minIDR = results[0].totalIDR;

  const el = document.getElementById('cloud-results');
  if (!el) return;

  el.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Provider</th>
          <th>Per Bulan (IDR)</th>
          <th>Per Bulan (USD)</th>
          <th>Per Tahun (IDR)</th>
        </tr>
      </thead>
      <tbody>
        ${results.map((r, i) => `
          <tr>
            <td>
              ${r.provider.flag} <strong>${r.provider.name}</strong>
              ${i === 0 ? ' <span class="badge-cheapest">Termurah</span>' : ''}
              <br><small style="font-weight:400;color:var(--ink-muted);font-size:0.75rem">${r.provider.note}</small>
            </td>
            <td class="${i === 0 ? 'price-best' : 'price-highlight'}">${formatIDR(r.totalIDR)}</td>
            <td style="color:var(--ink-muted)">$${r.totalUSD.toFixed(2)}</td>
            <td style="color:var(--ink-muted)">${formatIDR(r.totalIDR * 12)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div style="margin-top:1rem;padding:0.875rem 1rem;background:var(--bg);border:1px solid var(--border);border-radius:2px">
      <p style="font-size:0.875rem;color:var(--ink-secondary);margin:0">
        💡 <strong>Potensi Hemat:</strong> Memilih <strong>${results[0].provider.name}</strong> dibanding 
        <strong>${results[results.length-1].provider.name}</strong> bisa menghemat 
        <strong style="color:var(--accent-clay)">${formatIDR((results[results.length-1].totalIDR - minIDR)*12)}/tahun</strong> 
        untuk spesifikasi yang sama.
      </p>
    </div>
  `;
}

// ── AI Calculator Render ──────────────────────────────────────
function renderAIResults() {
  const inputK  = parseInt(document.getElementById('tokens-in')?.value  || 500, 10);
  const outputK = parseInt(document.getElementById('tokens-out')?.value || 200, 10);

  const setOut = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
  setOut('tokens-in-val',  inputK  + 'K token');
  setOut('tokens-out-val', outputK + 'K token');

  const results = AI_MODELS.map(m => ({
    model: m,
    ...calcAICost(m, inputK, outputK)
  }));

  results.sort((a, b) => a.monthIDR - b.monthIDR);

  const el = document.getElementById('ai-results');
  if (!el) return;

  el.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Model AI</th>
          <th>Per Hari (IDR)</th>
          <th>Per Bulan (IDR)</th>
          <th>Per Bulan (USD)</th>
        </tr>
      </thead>
      <tbody>
        ${results.map((r, i) => `
          <tr>
            <td>
              <strong>${r.model.name}</strong>
              ${i === 0 ? ' <span class="badge-cheapest">Termurah</span>' : ''}
              <br><small style="font-weight:400;color:var(--ink-muted);font-size:0.75rem">${r.model.provider}</small>
            </td>
            <td style="color:var(--ink-muted)">${formatIDR(r.dayIDR)}</td>
            <td class="${i === 0 ? 'price-best' : 'price-highlight'}">${formatIDR(r.monthIDR)}</td>
            <td style="color:var(--ink-muted)">$${r.monthUSD.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div style="margin-top:1rem;padding:0.875rem 1rem;background:var(--bg);border:1px solid var(--border);border-radius:2px">
      <p style="font-size:0.875rem;color:var(--ink-secondary);margin:0">
        💡 Menggunakan <strong>${results[0].model.name}</strong> dibanding <strong>${results[results.length-1].model.name}</strong> 
        bisa hemat hingga <strong style="color:var(--accent-clay)">${formatIDR((results[results.length-1].monthIDR - results[0].monthIDR) * 12)}/tahun</strong> 
        untuk volume penggunaan yang sama.
      </p>
    </div>
  `;
}

// ── Tab Switching ─────────────────────────────────────────────
function initTabs() {
  const tabs = document.querySelectorAll('.calc-tab');
  const bodies = document.querySelectorAll('.calc-body');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      bodies.forEach(b => {
        const isTarget = b.id === 'tab-' + target;
        b.classList.toggle('hidden', !isTarget);
      });
      // Re-render the now-visible tab
      if (target === 'cloud') renderCloudResults();
      else renderAIResults();
    });
  });
}

// ── Bind Sliders ──────────────────────────────────────────────
function bindSliders() {
  const cloudSliders = ['vcpu', 'ram', 'storage', 'transfer'];
  cloudSliders.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', renderCloudResults);
  });

  const aiSliders = ['tokens-in', 'tokens-out'];
  aiSliders.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', renderAIResults);
  });
}

// ── Smooth Scroll for Nav ─────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('site-header')?.offsetHeight || 70;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });
}

// ── Active Nav Highlight on Scroll ───────────────────────────
function initScrollSpy() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('#main-nav a');
  const headerH   = () => (document.getElementById('site-header')?.offsetHeight || 70) + 8;

  function onScroll() {
    const scrollY = window.scrollY;
    let active = null;
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop - headerH()) active = sec.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href')?.replace('#','');
      link.style.color = href === active ? 'var(--ink)' : '';
    });
  }

  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
}

// ── Mobile Navigation Drawer ──────────────────────────────────
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-nav-drawer');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  if (!btn || !drawer) return;

  function openMenu() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('open')) closeMenu();
    else openMenu();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  // Close when a nav link is clicked (delegated for dynamic links)
  drawer.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMenu();
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeMenu();
  });
}

function applyLabSettings() {
  const s = window.BlogService?.getSettings ? window.BlogService.getSettings() : null;
  if (!s) return;

  const labSec = document.getElementById('lab');
  const navLinks = document.querySelectorAll('a[href*="#lab"]');

  if (s.lab_enabled === false) {
    if (labSec) labSec.style.display = 'none';
    navLinks.forEach(a => {
      const li = a.closest('li') || a;
      li.style.display = 'none';
    });
    return;
  }

  // If enabled: ensure displayed and update dynamic copy
  if (labSec) labSec.style.display = '';
  navLinks.forEach(a => {
    const li = a.closest('li') || a;
    li.style.display = '';
  });

  if (s.lab_badge) {
    const badgeEl = labSec?.querySelector('.section-label');
    if (badgeEl) badgeEl.textContent = s.lab_badge;
  }
  if (s.lab_title) {
    const titleEl = document.getElementById('lab-heading');
    if (titleEl) titleEl.innerHTML = s.lab_title.replace(/\n/g, '<br>');
  }
  if (s.lab_desc) {
    const descEl = labSec?.querySelector('.section-sub, .section-desc');
    if (descEl) descEl.textContent = s.lab_desc;
  }
  if (s.lab_usd_idr) {
    USD_IDR = parseInt(s.lab_usd_idr, 10) || 16000;
  }
}

// ── Init ──────────────────────────────────────────────────────
function initTools() {
  applyLabSettings();
  initTabs();
  bindSliders();
  initSmoothScroll();
  initScrollSpy();
  initHamburger();
  renderCloudResults();
  renderAIResults();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTools);
} else {
  initTools();
}
