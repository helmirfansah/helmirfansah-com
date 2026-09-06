'use strict';
// ============================================================
// tools.js - Interactive Calculators
// Helmi Irfansah Website
// Focused on Social Media & Affiliate Marketing + Cloud & AI
// ============================================================

// ── Currency & Base Config ──────────────────────────────────
let USD_IDR = 16000;

// ── Helpers ─────────────────────────────────────────────────
function formatIDR(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) return 'Rp 0';
  if (amount >= 1_000_000_000) {
    return 'Rp ' + (amount / 1_000_000_000).toFixed(2).replace('.', ',') + ' M';
  }
  if (amount >= 1_000_000) {
    return 'Rp ' + (amount / 1_000_000).toFixed(2).replace('.', ',') + ' jt';
  }
  return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
}

function formatNum(num) {
  if (isNaN(num) || num === null || num === undefined) return '0';
  return Math.round(num).toLocaleString('id-ID');
}

// ============================================================
// 1. AFFILIATE MARKETING COMMISSION CALCULATOR
// ============================================================

const AFFILIATE_PRESETS = {
  shopee: {
    name: 'Shopee Affiliate',
    views: 60000,
    ctr: 4.0,
    cvr: 2.5,
    price: 125000,
    comm: 7.0
  },
  tiktok: {
    name: 'TikTok Shop Affiliate',
    views: 80000,
    ctr: 5.5,
    cvr: 3.2,
    price: 95000,
    comm: 12.0
  },
  saas: {
    name: 'Digital Course / SaaS',
    views: 25000,
    ctr: 2.8,
    cvr: 1.8,
    price: 350000,
    comm: 35.0
  },
  web3: {
    name: 'Web3 / Crypto Referral',
    views: 35000,
    ctr: 3.2,
    cvr: 1.5,
    price: 500000,
    comm: 25.0
  }
};

function renderAffiliateResults() {
  const viewsEl = document.getElementById('aff-views');
  const ctrEl   = document.getElementById('aff-ctr');
  const cvrEl   = document.getElementById('aff-cvr');
  const priceEl = document.getElementById('aff-price');
  const commEl  = document.getElementById('aff-comm');

  if (!viewsEl || !ctrEl || !cvrEl || !priceEl || !commEl) return;

  const views = parseFloat(viewsEl.value) || 50000;
  const ctr   = parseFloat(ctrEl.value)   || 3.5;
  const cvr   = parseFloat(cvrEl.value)   || 2.0;
  const price = parseFloat(priceEl.value) || 150000;
  const comm  = parseFloat(commEl.value)  || 10.0;

  const setOut = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setOut('aff-views-val', formatNum(views) + ' Views');
  setOut('aff-ctr-val', ctr.toFixed(1) + '%');
  setOut('aff-cvr-val', cvr.toFixed(1) + '%');
  setOut('aff-price-val', formatIDR(price));
  setOut('aff-comm-val', comm.toFixed(1) + '%');

  const clicks = views * (ctr / 100);
  const orders = clicks * (cvr / 100);
  const gmv    = orders * price;
  const monthlyCommission = gmv * (comm / 100);
  const yearlyCommission  = monthlyCommission * 12;
  const epc = clicks > 0 ? (monthlyCommission / clicks) : 0;
  const rpm = views > 0 ? (monthlyCommission / (views / 1000)) : 0;

  const el = document.getElementById('affiliate-results');
  if (!el) return;

  const platforms = [
    { name: 'Shopee Affiliate', ctr: 4.0, cvr: 2.5, price: 120000, comm: 7.0, badge: 'Retail E-commerce' },
    { name: 'TikTok Shop', ctr: 5.5, cvr: 3.2, price: 95000, comm: 12.0, badge: 'Live & Video FYP' },
    { name: 'Produk Digital / SaaS', ctr: 2.8, cvr: 1.8, price: 350000, comm: 35.0, badge: 'High Margin' },
    { name: 'Web3 / Crypto Referral', ctr: 3.2, cvr: 1.5, price: 500000, comm: 25.0, badge: 'High Ticket' },
  ].map(p => {
    const c = views * (p.ctr / 100);
    const o = c * (p.cvr / 100);
    const g = o * p.price;
    const commMonth = g * (p.comm / 100);
    return { ...p, clicks: c, orders: o, gmv: g, commMonth };
  });

  el.innerHTML = `
    <div style="background: linear-gradient(135deg, rgba(184,80,66,0.08) 0%, rgba(68,140,93,0.08) 100%); border: 1px solid var(--border-strong); border-radius: var(--radius-sm); padding: 1.5rem; margin-bottom: 1.5rem; text-align: center;">
      <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-clay); display: inline-block; margin-bottom: 0.25rem;">
        ESTIMASI PENGHASILAN BERSIH AFILIASI
      </span>
      <div style="font-family: var(--font-serif); font-size: clamp(1.85rem, 4vw, 2.5rem); font-weight: 700; color: var(--ink); line-height: 1.2;">
        ${formatIDR(monthlyCommission)} <span style="font-size: 1.1rem; font-weight: 400; color: var(--ink-muted); font-family: var(--font-sans);">/ bulan</span>
      </div>
      <p style="font-size: 0.95rem; color: var(--ink-secondary); margin: 0.5rem 0 0;">
        Setara dengan <strong style="color: var(--accent-sage); font-weight: 600;">${formatIDR(yearlyCommission)}</strong> per tahun dari ${formatNum(views)} views/bulan.
      </p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
      <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 4px; padding: 1rem;">
        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--ink-muted); letter-spacing: 0.05em; margin-bottom: 0.25rem;">Klik Link (Traffic)</div>
        <div style="font-size: 1.25rem; font-weight: 700; color: var(--ink);">${formatNum(clicks)} <span style="font-size: 0.8rem; font-weight: 400; color: var(--ink-muted);">klik</span></div>
        <div style="font-size: 0.75rem; color: var(--ink-muted); margin-top: 0.2rem;">CTR: ${ctr.toFixed(1)}%</div>
      </div>

      <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 4px; padding: 1rem;">
        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--ink-muted); letter-spacing: 0.05em; margin-bottom: 0.25rem;">Penjualan / Order</div>
        <div style="font-size: 1.25rem; font-weight: 700; color: var(--ink);">${formatNum(orders)} <span style="font-size: 0.8rem; font-weight: 400; color: var(--ink-muted);">trx</span></div>
        <div style="font-size: 0.75rem; color: var(--ink-muted); margin-top: 0.2rem;">Konversi: ${cvr.toFixed(1)}%</div>
      </div>

      <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 4px; padding: 1rem;">
        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--ink-muted); letter-spacing: 0.05em; margin-bottom: 0.25rem;">Total Omset (GMV)</div>
        <div style="font-size: 1.25rem; font-weight: 700; color: var(--ink);">${formatIDR(gmv)}</div>
        <div style="font-size: 0.75rem; color: var(--ink-muted); margin-top: 0.2rem;">Nilai barang terjual</div>
      </div>

      <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 4px; padding: 1rem;">
        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--ink-muted); letter-spacing: 0.05em; margin-bottom: 0.25rem;">EPC (Cuan per Klik)</div>
        <div style="font-size: 1.25rem; font-weight: 700; color: var(--accent-clay);">${formatIDR(epc)}</div>
        <div style="font-size: 0.75rem; color: var(--ink-muted); margin-top: 0.2rem;">RPM: ${formatIDR(rpm)} /1k views</div>
      </div>
    </div>

    <div style="margin-top: 1rem;">
      <h4 style="font-size: 0.9rem; font-weight: 600; color: var(--ink); margin-bottom: 0.5rem;">
        Komparasi Potensi Cuan dengan ${formatNum(views)} Views di Berbagai Platform:
      </h4>
      <table>
        <thead>
          <tr>
            <th>Platform Afiliasi</th>
            <th>Rata-rata Komisi</th>
            <th>Est. Order</th>
            <th>Potensi Komisi / Bulan</th>
          </tr>
        </thead>
        <tbody>
          ${platforms.map((p, idx) => `
            <tr>
              <td>
                <strong>${p.name}</strong>
                <br><small style="color:var(--ink-muted);font-size:0.75rem">${p.badge}</small>
              </td>
              <td>${p.comm}% (${formatIDR(p.price)}/item)</td>
              <td>${formatNum(p.orders)} transaksi</td>
              <td class="${idx === 2 || idx === 3 ? 'price-highlight' : ''}" style="font-weight:600;">
                ${formatIDR(p.commMonth)}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div style="margin-top: 1rem; padding: 0.85rem 1rem; background: var(--bg); border: 1px solid var(--border); border-radius: 4px; font-size: 0.85rem; color: var(--ink-secondary);">
      💡 <strong>Insight Strategis:</strong> Meningkatkan <em>Conversion Rate</em> dari 2% ke 3% memberikan peningkatan komisi <strong>+50%</strong> secara instan tanpa perlu mengeluarkan biaya iklan tambahan. Fokuslah membangun <em>trust</em> dan konten ulasan yang mendalam.
    </div>
  `;
}

function initAffiliatePresets() {
  const buttons = document.querySelectorAll('.aff-preset-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.preset;
      const preset = AFFILIATE_PRESETS[key];
      if (!preset) return;

      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
      };

      setVal('aff-views', preset.views);
      setVal('aff-ctr', preset.ctr);
      setVal('aff-cvr', preset.cvr);
      setVal('aff-price', preset.price);
      setVal('aff-comm', preset.comm);

      buttons.forEach(b => b.classList.toggle('active', b === btn));
      renderAffiliateResults();
    });
  });
}

// ============================================================
// 2. SOCIAL MEDIA ENGAGEMENT RATE & RATE CARD CALCULATOR
// ============================================================

function renderSocialResults() {
  const platformEl  = document.querySelector('input[name="soc-platform"]:checked') || { value: 'tiktok' };
  const followersEl = document.getElementById('soc-followers');
  const likesEl     = document.getElementById('soc-likes');
  const commentsEl  = document.getElementById('soc-comments');
  const sharesEl    = document.getElementById('soc-shares');

  if (!followersEl || !likesEl || !commentsEl || !sharesEl) return;

  const platform  = platformEl.value || 'tiktok';
  const followers = parseFloat(followersEl.value) || 25000;
  const likes     = parseFloat(likesEl.value)     || 1200;
  const comments  = parseFloat(commentsEl.value)  || 85;
  const shares    = parseFloat(sharesEl.value)    || 45;

  const setOut = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setOut('soc-followers-val', formatNum(followers) + ' Followers');
  setOut('soc-likes-val', formatNum(likes) + ' Likes');
  setOut('soc-comments-val', formatNum(comments) + ' Komentar');
  setOut('soc-shares-val', formatNum(shares) + ' Shares / Saves');

  let shareWeight = 1.2;
  if (platform === 'tiktok') shareWeight = 1.6;
  if (platform === 'instagram') shareWeight = 1.4;

  const totalRawInteractions = likes + comments + shares;
  const er = followers > 0 ? (totalRawInteractions / followers) * 100 : 0;

  let erBadge = 'Rata-rata';
  let erColor = 'var(--ink-secondary)';
  let erStatus = 'Interaksi Standar';
  let erAdvice = 'Performa akun Anda berada di rata-rata industri. Perkuat hook 3 detik pertama dan sertakan CTA (Call-to-Action) interaktif di akhir konten.';

  if (er < 1.5) {
    erBadge = 'Perlu Optimasi';
    erColor = '#b91c1c';
    erStatus = 'Engagement Rendah (< 1.5%)';
    erAdvice = 'Audience Anda kurang aktif berinteraksi. Uji format konten baru, gunakan stiker polling di Instagram Story, atau buat video kontroversi/opini ringan di TikTok.';
  } else if (er >= 1.5 && er <= 3.5) {
    erBadge = 'Standar Sehat';
    erColor = '#d97706';
    erStatus = 'Sehat & Konsisten (1.5% - 3.5%)';
    erAdvice = 'Tingkat interaksi yang sehat untuk akun berkembang. Pertahankan konsistensi jadwal posting dan mulai jangkau brand sponsorship mikro.';
  } else if (er > 3.5 && er <= 6.5) {
    erBadge = 'Bagus & Interaktif';
    erColor = '#15803d';
    erStatus = 'Tinggi (3.5% - 6.5%) 🔥';
    erAdvice = 'Interaksi sangat kuat! Brand sangat menyukai kreator dengan ER di rentang ini karena konversi pembelian biasanya jauh lebih tinggi daripada akun besar tapi pasif.';
  } else {
    erBadge = 'Sangat Tinggi / Viral';
    erColor = 'var(--accent-clay)';
    erStatus = 'Viral / Super High (> 6.5%) 🚀';
    erAdvice = 'Luar biasa! Akun Anda memiliki loyalitas audiens sangat tinggi atau konten Anda kerap masuk FYP / Algoritma rekomendasi. Anda berhak pasang rate card di batas atas!';
  }

  const erMultiplier = Math.max(0.75, Math.min(2.0, er / 2.8));

  let baseFeedMin = 0, baseFeedMax = 0;
  let baseVideoMin = 0, baseVideoMax = 0;
  let baseStoryMin = 0, baseStoryMax = 0;

  if (followers <= 10000) {
    baseStoryMin = 75000;   baseStoryMax = 200000;
    baseFeedMin  = 150000;  baseFeedMax  = 400000;
    baseVideoMin = 300000;  baseVideoMax = 800000;
  } else if (followers <= 50000) {
    baseStoryMin = 200000;  baseStoryMax = 500000;
    baseFeedMin  = 450000;  baseFeedMax  = 1200000;
    baseVideoMin = 800000;  baseVideoMax = 2500000;
  } else if (followers <= 200000) {
    baseStoryMin = 500000;  baseStoryMax = 1500000;
    baseFeedMin  = 1200000; baseFeedMax  = 3500000;
    baseVideoMin = 2200000; baseVideoMax = 6500000;
  } else if (followers <= 1000000) {
    baseStoryMin = 1500000; baseStoryMax = 3500000;
    baseFeedMin  = 3500000; baseFeedMax  = 9000000;
    baseVideoMin = 6500000; baseVideoMax = 18000000;
  } else {
    baseStoryMin = 3500000; baseStoryMax = 8000000;
    baseFeedMin  = 9000000; baseFeedMax  = 25000000;
    baseVideoMin = 18000000;baseVideoMax = 55000000;
  }

  const rateStoryMin = Math.round((baseStoryMin * erMultiplier) / 25000) * 25000;
  const rateStoryMax = Math.round((baseStoryMax * erMultiplier) / 25000) * 25000;

  const rateFeedMin = Math.round((baseFeedMin * erMultiplier) / 50000) * 50000;
  const rateFeedMax = Math.round((baseFeedMax * erMultiplier) / 50000) * 50000;

  const rateVideoMin = Math.round((baseVideoMin * erMultiplier) / 100000) * 100000;
  const rateVideoMax = Math.round((baseVideoMax * erMultiplier) / 100000) * 100000;

  const el = document.getElementById('social-results');
  if (!el) return;

  el.innerHTML = `
    <div style="background: var(--bg); border: 1px solid var(--border-strong); border-radius: var(--radius-sm); padding: 1.5rem; margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-muted);">
            ENGAGEMENT RATE (ER) HASIL ANALISIS
          </span>
          <div style="font-family: var(--font-serif); font-size: clamp(2rem, 4vw, 2.75rem); font-weight: 700; color: ${erColor}; line-height: 1.1; margin: 0.25rem 0;">
            ${er.toFixed(2)}%
          </div>
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
            <span style="font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 999px; background: var(--bg-alt); border: 1px solid var(--border); color: ${erColor};">
              ${erBadge}
            </span>
            <span style="font-size: 0.85rem; color: var(--ink-secondary);">${erStatus}</span>
          </div>
        </div>

        <div style="background: var(--bg-card); border: 1px solid var(--border); padding: 0.85rem 1.25rem; border-radius: 4px; min-width: 220px;">
          <div style="font-size: 0.75rem; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.05em;">Total Interaksi / Konten</div>
          <div style="font-size: 1.15rem; font-weight: 700; color: var(--ink); margin-top: 0.2rem;">
            ${formatNum(totalRawInteractions)} interaksi
          </div>
          <div style="font-size: 0.75rem; color: var(--ink-muted); margin-top: 0.2rem;">
            (${formatNum(likes)} likes · ${formatNum(comments)} komen · ${formatNum(shares)} shares)
          </div>
        </div>
      </div>

      <p style="margin: 1rem 0 0; font-size: 0.875rem; color: var(--ink-secondary); line-height: 1.6; border-top: 1px dashed var(--border); padding-top: 0.85rem;">
        💡 <strong>Analisis &amp; Rekomendasi:</strong> ${erAdvice}
      </p>
    </div>

    <h4 style="font-size: 0.95rem; font-weight: 600; color: var(--ink); margin-bottom: 0.75rem;">
      Estimasi Nilai Wajar Rate Card Endorsement (${platform.toUpperCase()})
    </h4>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
      
      <div style="background: var(--bg-card); border: 1px solid var(--border-strong); border-radius: 4px; padding: 1.25rem; position: relative;">
        <span style="position: absolute; top: 0.75rem; right: 0.75rem; font-size: 10px; font-weight: 700; background: var(--accent-clay); color: #fff; padding: 0.15rem 0.45rem; border-radius: 3px;">PALING DICARI BRAND</span>
        <div style="font-size: 0.8rem; font-weight: 600; color: var(--ink-secondary); margin-bottom: 0.25rem;">🎬 Video Singkat (Reels / TikTok)</div>
        <div style="font-size: 1.2rem; font-weight: 700; color: var(--ink); margin: 0.35rem 0;">
          ${formatIDR(rateVideoMin)} – ${formatIDR(rateVideoMax)}
        </div>
        <div style="font-size: 0.75rem; color: var(--ink-muted);">Format video vertikal 30-60 detik dengan hook kuat &amp; storytelling.</div>
      </div>

      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 4px; padding: 1.25rem;">
        <div style="font-size: 0.8rem; font-weight: 600; color: var(--ink-secondary); margin-bottom: 0.25rem;">🖼️ Feed Post / Carousel / Thread</div>
        <div style="font-size: 1.2rem; font-weight: 700; color: var(--ink); margin: 0.35rem 0;">
          ${formatIDR(rateFeedMin)} – ${formatIDR(rateFeedMax)}
        </div>
        <div style="font-size: 0.75rem; color: var(--ink-muted);">Single post feed atau carousel edukasi mendalam.</div>
      </div>

      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 4px; padding: 1.25rem;">
        <div style="font-size: 0.8rem; font-weight: 600; color: var(--ink-secondary); margin-bottom: 0.25rem;">📱 Story (24 Jam)</div>
        <div style="font-size: 1.2rem; font-weight: 700; color: var(--ink); margin: 0.35rem 0;">
          ${formatIDR(rateStoryMin)} – ${formatIDR(rateStoryMax)}
        </div>
        <div style="font-size: 0.75rem; color: var(--ink-muted);">1-3 frame story dilengkapi link stiker affiliate / swipe up.</div>
      </div>

    </div>

    <div style="padding: 0.85rem 1rem; background: var(--bg); border: 1px solid var(--border); border-radius: 4px; font-size: 0.825rem; color: var(--ink-muted);">
      ⚠️ <em>Catatan:</em> Angka di atas merupakan tolak ukur pasar Indonesia 2026. Nilai riil dapat lebih tinggi jika niche Anda spesifik bernilai tinggi (seperti Web3/Finance, Tech SaaS, Properti, atau B2B), atau jika brand meminta hak tayang iklan berbayar (<em>Whitelisting / Spark Ads</em>).
    </div>
  `;
}

// ============================================================
// 3. CLOUD VPS PRICING DATA & CALCULATOR
// ============================================================

const CLOUD_PROVIDERS = [
  {
    name: 'DigitalOcean',
    flag: '🇺🇸',
    cpuRate:     4.00,
    ramRate:     0.50,
    storageRate: 0.10,
    bwRate:      0.01,
    bwFree:      1000,
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

function renderCloudResults() {
  const vcpu    = parseInt(document.getElementById('vcpu')?.value    || 4, 10);
  const ramGB   = parseInt(document.getElementById('ram')?.value     || 8, 10);
  const storGB  = parseInt(document.getElementById('storage')?.value || 100, 10);
  const bwTB    = parseInt(document.getElementById('transfer')?.value || 2, 10);

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
              <span>${r.provider.flag}</span>
              <strong>${r.provider.name}</strong>
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
        💡 Hemat hingga <strong style="color:var(--accent-clay)">${formatIDR((results[results.length-1].totalIDR - results[0].totalIDR) * 12)}/tahun</strong> 
        dengan memilih provider yang tepat untuk workload ini.
      </p>
    </div>
  `;
}

// ============================================================
// 4. AI TOKEN PRICING DATA & CALCULATOR
// ============================================================

const AI_MODELS = [
  { name: 'GPT-4o',            provider: 'OpenAI',    inputPer1M:  5.00, outputPer1M: 15.00 },
  { name: 'GPT-4o mini',       provider: 'OpenAI',    inputPer1M:  0.15, outputPer1M:  0.60 },
  { name: 'Claude 3.7 Sonnet', provider: 'Anthropic', inputPer1M:  3.00, outputPer1M: 15.00 },
  { name: 'Claude 3.5 Haiku',  provider: 'Anthropic', inputPer1M:  0.80, outputPer1M:  4.00 },
  { name: 'Gemini 2.5 Pro',    provider: 'Google',    inputPer1M:  2.50, outputPer1M: 10.00 },
  { name: 'Gemini 2.5 Flash',  provider: 'Google',    inputPer1M:  0.075,outputPer1M:  0.30 },
];

function calcAICost(model, inputKTokensDay, outputKTokensDay) {
  const inputMDay  = inputKTokensDay  / 1000;
  const outputMDay = outputKTokensDay / 1000;
  const dayUSD  = model.inputPer1M * inputMDay + model.outputPer1M * outputMDay;
  const monthUSD = dayUSD * 30;
  return { dayUSD, monthUSD, dayIDR: dayUSD*USD_IDR, monthIDR: monthUSD*USD_IDR };
}

function renderAIResults() {
  const inK  = parseInt(document.getElementById('tokens-in')?.value  || 500, 10);
  const outK = parseInt(document.getElementById('tokens-out')?.value || 200, 10);

  const setOut = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
  setOut('tokens-in-val',  inK  >= 1000 ? (inK/1000).toFixed(1)  + 'M token' : inK  + 'K token');
  setOut('tokens-out-val', outK >= 1000 ? (outK/1000).toFixed(1) + 'M token' : outK + 'K token');

  const results = AI_MODELS.map(m => ({
    model: m,
    ...calcAICost(m, inK, outK)
  }));

  results.sort((a, b) => a.monthIDR - b.monthIDR);

  const el = document.getElementById('ai-results');
  if (!el) return;

  el.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Model</th>
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

// ============================================================
// 5. TAB SWITCHING & EVENT LISTENERS
// ============================================================

function initTabs() {
  const tabs = document.querySelectorAll('.calc-tab');
  const bodies = document.querySelectorAll('.calc-body');
  const directLinkBtn = document.getElementById('calc-direct-page-link');

  const TAB_URL_MAP = {
    affiliate: { url: '/tools/kalkulator-affiliate', label: 'Buka Halaman Lengkap Kalkulator Komisi Afiliasi →' },
    social:    { url: '/tools/kalkulator-engagement-rate', label: 'Buka Halaman Lengkap Kalkulator ER & Rate Card →' },
    cloud:     { url: '/tools/kalkulator-cloud-vps', label: 'Buka Halaman Lengkap Kalkulator Cloud VPS →' },
    ai:        { url: '/tools/kalkulator-token-ai', label: 'Buka Halaman Lengkap Kalkulator Token AI →' }
  };

  function activateTab(target) {
    if (!target) return;
    tabs.forEach(t => {
      const isMatch = t.dataset.tab === target;
      t.classList.toggle('active', isMatch);
      t.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });
    bodies.forEach(b => {
      const isTarget = b.id === 'tab-' + target;
      b.classList.toggle('hidden', !isTarget);
    });

    // Update direct page link button (if present on homepage or tools hub)
    if (directLinkBtn && TAB_URL_MAP[target]) {
      directLinkBtn.href = TAB_URL_MAP[target].url;
      directLinkBtn.textContent = TAB_URL_MAP[target].label;
    }

    if (target === 'affiliate') renderAffiliateResults();
    else if (target === 'social') renderSocialResults();
    else if (target === 'cloud') renderCloudResults();
    else if (target === 'ai') renderAIResults();
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      activateTab(target);
      if (window.location.pathname.startsWith('/tools')) {
        try {
          history.replaceState(null, '', '#' + target);
        } catch(e) {}
      }
    });
  });

  // Handle URL hash on initial page load (e.g. #social, #cloud, #ai, #affiliate)
  const hash = window.location.hash.replace('#', '').toLowerCase();
  const validTabs = ['affiliate', 'social', 'cloud', 'ai'];
  if (hash && validTabs.includes(hash)) {
    activateTab(hash);
  } else {
    // Sync initial direct link button with active tab
    const activeTab = document.querySelector('.calc-tab.active');
    if (activeTab && activeTab.dataset.tab) {
      activateTab(activeTab.dataset.tab);
    }
  }
}

function bindSliders() {
  const affSliders = ['aff-views', 'aff-ctr', 'aff-cvr', 'aff-price', 'aff-comm'];
  affSliders.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', renderAffiliateResults);
  });

  const socSliders = ['soc-followers', 'soc-likes', 'soc-comments', 'soc-shares'];
  socSliders.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', renderSocialResults);
  });

  const socRadios = document.querySelectorAll('input[name="soc-platform"]');
  socRadios.forEach(radio => {
    radio.addEventListener('change', renderSocialResults);
  });

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

  drawer.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMenu();
  });

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

function initTools() {
  applyLabSettings();
  initTabs();
  initAffiliatePresets();
  bindSliders();
  initSmoothScroll();
  initScrollSpy();
  initHamburger();
  renderAffiliateResults();
  renderSocialResults();
  renderCloudResults();
  renderAIResults();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTools);
} else {
  initTools();
}
