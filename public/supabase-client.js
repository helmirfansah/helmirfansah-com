/**
 * supabase-client.js
 * Universal client layer for helmirfansah.com
 * Supports both live Supabase database and local fallback mode
 */

const SUPABASE_STORAGE_KEY_URL = 'hi_sb_url';
const SUPABASE_STORAGE_KEY_ANON = 'hi_sb_anon_key';
const LOCAL_POSTS_STORAGE_KEY = 'hi_local_posts';

// Konfigurasi Default Produksi (Bisa diisi di sini jika ingin live langsung tanpa harus mengisi di admin panel)
const DEFAULT_SUPABASE_URL = '';
const DEFAULT_SUPABASE_ANON_KEY = '';

// Clean Slate: 0 Dummy Content untuk Peluncuran Produksi
const INITIAL_SEED_POSTS = [];

// Sample Artikel Resmi untuk Eksplorasi & Demo (Bisa diisi via 1-click di Admin)
const SAMPLE_ARTICLES = [
  {
    id: 'post_sample_1',
    slug: 'halo-dunia-perkenalan-helmi-irfansah',
    title: 'Halo Dunia: Membangun Audiens Organik, Riset Afiliasi, dan Eksplorasi Web3',
    excerpt: 'Selamat datang di helmirfansah.com. Catatan strategi seputar social media growth, corong konversi affiliate marketing, serta pengujian adopsi Web3 dan AI tools.',
    content: `## Selamat Datang di Ruang Eksplorasi Saya

Halo! Saya **Helmi Irfansah**. Selamat datang di website dan lab digital pribadi saya.

Situs ini saya bangun sebagai ruang dokumentasi teknis dan strategi empiris seputar:
1. **Pertumbuhan Audiens Media Sosial Organik:** Membedah algoritma TikTok, Instagram Reels, dan format konten video pendek yang konsisten mendatangkan atensi audiens tertarget.
2. **Corong Konversi Affiliate Marketing:** Menganalisis metrik nyata (Views, CTR, CVR, AOV, dan EPC) untuk memaksimalkan komisi bersih tanpa harus bergantung pada endorse berbayar.
3. **Eksplorasi Web3 & Crypto:** Mempelajari bagaimana prinsip social media dan affiliate distribution dapat diterapkan pada ekosistem blockchain terdesentralisasi.
4. **Tools & Kalkulator Interaktif:** Mengembangkan kalkulator gratis seperti [Kalkulator Komisi Affiliate](/tools/kalkulator-affiliate) dan [Kalkulator Engagement Rate](/tools/kalkulator-engagement-rate) untuk membantu kreator mengukur performa.

> [!NOTE]
> Filosofi utama di balik blog ini adalah **kejujuran data dan hasil empiris**. Kami tidak membagikan tips tanpa uji coba langsung, metrik yang transparan, dan studi kasus nyata.

Silakan jelajahi tulisan dan tools yang ada, dan mari terhubung melalui media sosial atau kontak di bawah!`,
    category: 'Affiliate Marketing',
    tags: ['Perkenalan', 'Social Media', 'Affiliate Marketing', 'Web3'],
    reading_time_minutes: 3,
    cover_image: '',
    featured_image: '',
    seo_focus_keyword: 'Helmi Irfansah',
    meta_description: 'Selamat datang di helmirfansah.com. Ruang eksplorasi seputar social media growth, corong konversi affiliate marketing, dan adopsi Web3.',
    is_published: true,
    view_count: 35,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'post_sample_2',
    slug: 'strategi-corong-affiliate-marketing-2026',
    title: 'Strategi Corong Affiliate Marketing 2026: Mengubah Views Medsos Menjadi Konversi Omset Nyata',
    excerpt: 'Views jutaan tidak menjamin komisi besar jika corong konversinya bocor. Pelajari cara menghitung rasio CTR dan CVR serta strategi storytelling produk yang terbukti closing.',
    content: `## Mengapa Views Jutaan Bisa Berujung Nol Penjualan?

Banyak kreator pemula terjebak dalam perangkap *vanity metrics*—merasa puas ketika videonya menembus ratusan ribu penonton, namun kecewa saat membuka dashboard afiliasi dan mendapati komisi hanya beberapa ribu rupiah.

Kunci sukses affiliate marketing bukan hanya seberapa banyak orang yang menonton, melainkan seberapa kuat **daya pikat konversi (conversion intent)** dari konten yang Anda sajikan.

---

### Anatomi Rumus Cuan Afiliasi

Penghasilan bersih affiliate dihitung dari perkalian 5 variabel kunci:

$$\\text{Komisi} = \\text{Total Views} \\times \\text{CTR Link} \\times \\text{CVR Pembelian} \\times \\text{AOV} \\times \\text{Komisi \\%}$$

- **CTR (Click-Through Rate):** Persentase penonton yang terdorong mengklik link di bio atau keranjang kuning.
- **CVR (Conversion Rate):** Persentase pengunjung yang benar-benar menyelesaikan pembayaran di marketplace.
- **AOV (Average Order Value):** Rata-rata nilai belanja keranjang pembeli.
- **Komisi %:** Persentase bagi hasil dari penjual/platform (misal Shopee 5-10%, TikTok 7-15%, SaaS 20-30%).

> [!TIP]
> Anda dapat mencoba menyimulasikan berbagai skenario views dan persentase komisi secara instan menggunakan [Kalkulator Komisi Affiliate Kami](/tools/kalkulator-affiliate).

---

### 3 Pilar Storytelling yang Meningkatkan CVR

1. **Hook Berbasis Masalah (The Pain Hook):** Tunjukkan frustrasi nyata penonton dalam 3 detik pertama sebelum menyebutkan solusi produk.
2. **Demonstrasi Tanpa Teori (Show, Don't Tell):** Perlihatkan bagaimana produk menyelesaikan masalah tersebut secara visual.
3. **Call-To-Action yang Mengarahkan (Specific CTA):** Jangan sekadar bilang "klik link di bio", berikan alasan mendesak seperti promo terbatas atau voucher khusus.`,
    category: 'Affiliate Marketing',
    tags: ['Affiliate Marketing', 'Konversi', 'TikTok Shop', 'Shopee Affiliate'],
    reading_time_minutes: 5,
    cover_image: '',
    featured_image: '',
    seo_focus_keyword: 'Affiliate Marketing 2026',
    meta_description: 'Pelajari formula corong affiliate marketing 2026 untuk mengubah views media sosial menjadi komisi bersih nyata dengan optimasi CTR dan CVR.',
    is_published: true,
    view_count: 82,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'post_sample_3',
    slug: 'cara-hitung-engagement-rate-dan-rate-card-medsos',
    title: 'Panduan Menghitung Engagement Rate & Menentukan Nilai Wajar Rate Card Influencer di Indonesia',
    excerpt: 'Berapa tarif endorse yang pantas untuk akun Anda? Pelajari rumus ER standar industri dan tolak ukur rate card endorsement untuk kreator Nano hingga Macro.',
    content: `## Menentukan Nilai Jual Akun Anda di Depan Brand

Banyak kreator bingung saat pertama kali dihubungi agensi atau brand untuk penawaran *endorsement* atau *sponsored post*. Menetapkan harga terlalu tinggi berisiko membuat brand kabur, sedangkan menetapkan harga terlalu rendah merugikan kerja keras Anda.

Untuk menentukan tarif endorse yang profesional dan dapat dipertanggungjawabkan, metrik utama yang dijadikan patokan oleh brand manager adalah **Engagement Rate (ER)**.

---

### Rumus Standar Engagement Rate

Engagement Rate mengukur seberapa aktif audiens berinteraksi dengan postingan Anda dibandingkan jumlah total pengikut (*followers*):

$$\\text{ER (\\%)} = \\frac{\\text{Total Interaksi (Likes + Comments + Shares + Saves)}}{\\text{Total Followers}} \\times 100\\%$$

- **Di atas 6%:** Sangat Tinggi (Viral / Super Sehat)
- **3.5% - 6%:** Sehat & Kinerja Baik (Standar Ideal Brand)
- **1.5% - 3.5%:** Rata-rata Pasar (Wajar untuk Akun Mid/Macro)
- **Di bawah 1.5%:** Butuh Optimasi Konten

> [!TIP]
> Coba hitung skor interaksi akun Anda dan periksa estimasi rate card yang disarankan secara otomatis melalui [Kalkulator Engagement Rate](/tools/kalkulator-engagement-rate).

---

### Kisaran Rate Card Wajar di Pasar Indonesia (2026)

- **Nano Creator (1.000 – 10.000 followers):** Rp 150.000 – Rp 600.000 per video/post.
- **Micro Creator (10.000 – 50.000 followers):** Rp 500.000 – Rp 2.500.000 per video/post.
- **Mid-Tier Creator (50.000 – 200.000 followers):** Rp 1.500.000 – Rp 6.500.000 per video/post.
- **Macro Creator (200.000+ followers):** Rp 6.500.000 ke atas per video/post.

Faktor pengali harga meliputi orisinalitas konsep, kualitas produksi audio-visual, serta hak pakai iklan (*whitelisting/usage rights*).`,
    category: 'Social Media Strategy',
    tags: ['Social Media', 'Engagement Rate', 'Rate Card', 'Endorsement', 'Influencer'],
    reading_time_minutes: 4,
    cover_image: '',
    featured_image: '',
    seo_focus_keyword: 'Engagement Rate Medsos',
    meta_description: 'Cara menghitung Engagement Rate media sosial dan menentukan nilai wajar rate card endorsement kreator di pasar Indonesia tahun 2026.',
    is_published: true,
    view_count: 64,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Koleksi Default Tools & Kalkulator Interaktif Website (Dapat di-CRUD di Admin Panel)
const DEFAULT_TOOLS = [
  {
    id: 'tool_affiliate',
    name: 'Kalkulator Komisi Affiliate Marketing',
    icon: '💰',
    category: 'Affiliate Marketing',
    slug: '/tools/kalkulator-affiliate',
    description: 'Simulasikan proyeksi penghasilan bersih affiliate Shopee, TikTok Shop, SaaS, dan Web3. Hitung estimasi cuan per bulan, GMV, EPC, dan RPM traffic konten.',
    target_keyword: 'kalkulator komisi affiliate, komisi shopee affiliate, komisi tiktok shop affiliate, epc affiliate calculator',
    meta_description: 'Simulasikan estimasi komisi bersih affiliate Shopee, TikTok Shop, SaaS, dan Web3. Hitung cuan, GMV, dan EPC dari traffic konten Anda.',
    badge: 'Populer',
    is_active: true,
    order: 1
  },
  {
    id: 'tool_er',
    name: 'Kalkulator Engagement Rate & Rate Card Medsos',
    icon: '📊',
    category: 'Social Media',
    slug: '/tools/kalkulator-engagement-rate',
    description: 'Ukur tingkat interaksi akun TikTok, Instagram, YouTube, dan 𝕏 Anda. Ketahui status kesehatan akun serta rekomendasi tarif endorse wajar di Indonesia.',
    target_keyword: 'kalkulator engagement rate, rumus er tiktok instagram, estimasi rate card endorse influencer indonesia',
    meta_description: 'Hitung persentase Engagement Rate akun TikTok, IG, YT, X dan periksa rekomendasi tarif endorse influencer wajar di Indonesia.',
    badge: 'Unggulan',
    is_active: true,
    order: 2
  },
  {
    id: 'tool_vps',
    name: 'Kalkulator Biaya Cloud Server VPS (IDR)',
    icon: '☁️',
    category: 'Infrastructure',
    slug: '/tools/kalkulator-cloud-vps',
    description: 'Bandingkan harga sewa VPS dari 6 provider terkemuka (DigitalOcean, AWS EC2, Vultr, GCP, Biznet Gio, IDCloudHost) dalam Rupiah.',
    target_keyword: 'kalkulator vps murah rupiah, biaya cloud server aws vs digitalocean indonesia, sewa cloud vps',
    meta_description: 'Bandingkan harga sewa VPS DigitalOcean, AWS, Vultr, GCP, Biznet Gio, dan IDCloudHost dalam Rupiah secara transparan.',
    badge: 'Utility',
    is_active: true,
    order: 3
  },
  {
    id: 'tool_ai',
    name: 'Kalkulator Biaya Token API AI (IDR)',
    icon: '🤖',
    category: 'AI & LLM',
    slug: '/tools/kalkulator-token-ai',
    description: 'Simulasikan pengeluaran harian dan bulanan penggunaan model LLM populer (OpenAI GPT-4o, Claude 3.7 Sonnet, Gemini 2.5 Flash) dalam Rupiah.',
    target_keyword: 'kalkulator token openai gpt-4o claude gemini, estimasi harga api token llm rupiah, biaya api ai',
    meta_description: 'Hitung estimasi pengeluaran token API AI (GPT-4o, Claude 3.7, Gemini) harian dan bulanan dalam Rupiah.',
    badge: 'AI Dev',
    is_active: true,
    order: 4
  }
];

// Auto-purge cache dummy lama dari pengujian lokal sebelumnya
if (typeof localStorage !== 'undefined' && !localStorage.getItem('hi_prod_cleaned_v2')) {
  localStorage.removeItem(LOCAL_POSTS_STORAGE_KEY);
  localStorage.removeItem('hi_media');
  localStorage.removeItem('hi_site_settings');
  localStorage.setItem('hi_prod_cleaned_v2', 'true');
}

class SupabaseBlogService {
  constructor() {
    this.client = null;
    this.isLive = false;
    this.initClient();
  }

  getConfig() {
    return {
      url: localStorage.getItem(SUPABASE_STORAGE_KEY_URL) || (typeof window !== 'undefined' && window.__PUBLIC_SUPABASE_URL__) || DEFAULT_SUPABASE_URL || '',
      anonKey: localStorage.getItem(SUPABASE_STORAGE_KEY_ANON) || (typeof window !== 'undefined' && window.__PUBLIC_SUPABASE_ANON_KEY__) || DEFAULT_SUPABASE_ANON_KEY || '',
      isLive: this.isLive
    };
  }

  async testConnection(url, anonKey) {
    const targetUrl = (url || this.getConfig().url || '').trim();
    const targetKey = (anonKey || this.getConfig().anonKey || '').trim();
    if (!targetUrl || !targetKey) {
      return { success: false, message: 'URL atau Anon Key Supabase masih kosong. Silakan isi terlebih dahulu.' };
    }
    try {
      if (!window.supabase || !window.supabase.createClient) {
        return { success: false, message: 'Library Supabase JS belum siap.' };
      }
      const testClient = window.supabase.createClient(targetUrl, targetKey);
      const { data, error } = await testClient.from('posts').select('id, title, is_published').limit(5);
      if (error) {
        if (error.code === '42P01' || error.message.includes('does not exist') || error.message.includes('relation')) {
          return {
            success: false,
            tableMissing: true,
            message: 'Terkoneksi ke Supabase, TETAPI tabel "posts" belum dibuat! Silakan jalankan script schema.sql di Supabase SQL Editor.'
          };
        }
        return { success: false, message: 'Supabase Error: ' + error.message };
      }
      return {
        success: true,
        count: (data || []).length,
        message: `Terhubung ke Supabase! Ditemukan ${(data || []).length} artikel aktif di cloud database.`
      };
    } catch (e) {
      return { success: false, message: 'Gagal menghubungi server Supabase: ' + e.message };
    }
  }

  async seedSampleArticles() {
    if (this.isLive && this.client) {
      try {
        for (const post of SAMPLE_ARTICLES) {
          await this.client.from('posts').upsert({
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            category: post.category,
            tags: post.tags,
            reading_time_minutes: post.reading_time_minutes,
            cover_image: post.cover_image,
            featured_image: post.featured_image,
            seo_focus_keyword: post.seo_focus_keyword,
            meta_description: post.meta_description,
            is_published: post.is_published,
            view_count: post.view_count
          }, { onConflict: 'slug' });
        }
        return { success: true, count: SAMPLE_ARTICLES.length, mode: 'supabase' };
      } catch (e) {
        console.warn('Gagal seed Supabase, fallback ke lokal:', e);
      }
    }
    const current = this.getLocalPosts();
    const existingSlugs = new Set(current.map(p => p.slug));
    const toAdd = SAMPLE_ARTICLES.filter(p => !existingSlugs.has(p.slug));
    const merged = [...toAdd, ...current];
    this.saveLocalPosts(merged);
    return { success: true, count: toAdd.length, mode: 'local' };
  }

  saveConfig(url, anonKey) {
    if (url && anonKey) {
      localStorage.setItem(SUPABASE_STORAGE_KEY_URL, url.trim());
      localStorage.setItem(SUPABASE_STORAGE_KEY_ANON, anonKey.trim());
      this.initClient();
      return true;
    }
    return false;
  }

  clearConfig() {
    localStorage.removeItem(SUPABASE_STORAGE_KEY_URL);
    localStorage.removeItem(SUPABASE_STORAGE_KEY_ANON);
    this.client = null;
    this.isLive = false;
  }

  initClient() {
    const { url, anonKey } = this.getConfig();
    if (url && anonKey && window.supabase && window.supabase.createClient) {
      try {
        this.client = window.supabase.createClient(url, anonKey);
        this.isLive = true;
        console.info('[Supabase] Terhubung ke live database:', url);
        this.syncRemoteSettings();
      } catch (e) {
        console.warn('[Supabase] Gagal inisialisasi client, beralih ke local storage:', e);
        this.client = null;
        this.isLive = false;
      }
    } else {
      this.client = null;
      this.isLive = false;
    }
  }

  async syncRemoteSettings() {
    if (this.isLive && this.client) {
      try {
        const { data, error } = await this.client
          .from('site_settings')
          .select('data')
          .eq('id', 'global')
          .single();
        if (!error && data && data.data) {
          const current = this.getSettings();
          const merged = { ...current, ...data.data };
          localStorage.setItem('hi_site_settings', JSON.stringify(merged));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('hi_settings_updated', { detail: merged }));
          }
        }
      } catch (e) {
        // Silently continue
      }
    }
  }

  // --- Local Storage Helpers ---
  getLocalPosts() {
    const stored = localStorage.getItem(LOCAL_POSTS_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(LOCAL_POSTS_STORAGE_KEY, JSON.stringify(INITIAL_SEED_POSTS));
      return INITIAL_SEED_POSTS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_SEED_POSTS;
    }
  }

  saveLocalPosts(posts) {
    localStorage.setItem(LOCAL_POSTS_STORAGE_KEY, JSON.stringify(posts));
  }

  getRawPostsCache() {
    return this.getLocalPosts();
  }

  // --- Post Operations ---
  async getPosts(options = {}) {
    const { category, search, includeDrafts = false, status = 'all' } = options;

    if (this.isLive && this.client) {
      try {
        let query = this.client
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (status === 'trash') {
          query = query.eq('is_trash', true);
        } else {
          query = query.or('is_trash.is.null,is_trash.eq.false');
          if (status === 'published') query = query.eq('is_published', true);
          else if (status === 'draft') query = query.eq('is_published', false);
          else if (!includeDrafts) query = query.eq('is_published', true);
        }

        if (category && category !== 'Semua') {
          query = query.eq('category', category);
        }

        if (search) {
          query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        const normalized = (data || []).map(p => ({
          ...p,
          cover_image: p.cover_image || p.featured_image || '',
          featured_image: p.cover_image || p.featured_image || ''
        }));
        return { data: normalized, isLive: true };
      } catch (err) {
        console.warn('[Supabase] Query gagal, memuat dari local cache:', err);
      }
    }

    // Fallback: Local Storage Mode
    let posts = this.getLocalPosts();
    if (status === 'trash') {
      posts = posts.filter(p => p.is_trash === true);
    } else {
      posts = posts.filter(p => !p.is_trash);
      if (status === 'published') posts = posts.filter(p => p.is_published);
      else if (status === 'draft') posts = posts.filter(p => !p.is_published);
      else if (!includeDrafts) posts = posts.filter(p => p.is_published);
    }

    if (category && category !== 'Semua') {
      posts = posts.filter(p => p.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      posts = posts.filter(p => 
        (p.title && p.title.toLowerCase().includes(q)) || 
        (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
        (p.content && p.content.toLowerCase().includes(q))
      );
    }
    posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { data: posts, isLive: false };
  }

  async getPostBySlug(slug) {
    if (this.isLive && this.client) {
      try {
        const { data, error } = await this.client
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        if (data) {
          // Increment view count asynchronously
          this.incrementViews(data.id, data.view_count || 0);
          return { data, isLive: true };
        }
      } catch (err) {
        console.warn('[Supabase] getPostBySlug gagal, memuat dari local cache:', err);
      }
    }

    const posts = this.getLocalPosts();
    const post = posts.find(p => p.slug === slug);
    if (post) {
      post.view_count = (post.view_count || 0) + 1;
      this.saveLocalPosts(posts);
      return { data: post, isLive: false };
    }
    return { data: null, isLive: false };
  }

  async incrementViews(id, currentCount) {
    if (this.isLive && this.client) {
      try {
        const { error } = await this.client.rpc('increment_post_views', { post_id: id });
        if (error) {
          await this.client
            .from('posts')
            .update({ view_count: (currentCount || 0) + 1 })
            .eq('id', id);
        }
      } catch (e) {
        console.warn('[Supabase] Increment view gagal:', e);
      }
    }
  }

  async createPost(postData) {
    const slug = postData.slug || this.slugify(postData.title);
    const cover_image = postData.cover_image || postData.featured_image || null;

    // Payload strictly matching Supabase public.posts columns
    const dbPayload = {
      title: postData.title,
      slug,
      content: postData.content || '',
      excerpt: postData.excerpt || '',
      category: postData.category || 'Infrastructure',
      tags: Array.isArray(postData.tags) ? postData.tags : [],
      reading_time_minutes: postData.reading_time_minutes || 5,
      cover_image: cover_image,
      seo_focus_keyword: postData.seo_focus_keyword || '',
      meta_description: postData.meta_description || postData.excerpt || '',
      is_published: postData.is_published !== false,
      is_trash: false
    };

    if (this.isLive && this.client) {
      try {
        const { data, error } = await this.client
          .from('posts')
          .insert([dbPayload])
          .select()
          .single();
        if (error) throw error;
        const normalized = {
          ...data,
          cover_image: data.cover_image || '',
          featured_image: data.cover_image || ''
        };
        // Update local cache
        const posts = this.getLocalPosts();
        posts.unshift(normalized);
        this.saveLocalPosts(posts);
        return { data: normalized, isLive: true };
      } catch (err) {
        console.error('[Supabase] Gagal membuat postingan:', err);
        throw err;
      }
    }

    // Local fallback
    const localPost = {
      ...dbPayload,
      id: 'local-' + Date.now(),
      cover_image: cover_image || '',
      featured_image: cover_image || '',
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const posts = this.getLocalPosts();
    posts.unshift(localPost);
    this.saveLocalPosts(posts);
    return { data: localPost, isLive: false };
  }

  async updatePost(id, updateData) {
    const cover_image = (updateData.cover_image !== undefined)
      ? updateData.cover_image
      : (updateData.featured_image !== undefined ? updateData.featured_image : undefined);

    const dbPayload = { ...updateData };
    delete dbPayload.featured_image;
    if (cover_image !== undefined) dbPayload.cover_image = cover_image;
    dbPayload.updated_at = new Date().toISOString();

    if (this.isLive && this.client && !String(id).startsWith('local-')) {
      try {
        const { data, error } = await this.client
          .from('posts')
          .update(dbPayload)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        const normalized = {
          ...data,
          cover_image: data.cover_image || '',
          featured_image: data.cover_image || ''
        };
        // Update local cache
        const posts = this.getLocalPosts();
        const idx = posts.findIndex(p => p.id === id);
        if (idx !== -1) posts[idx] = { ...posts[idx], ...normalized };
        this.saveLocalPosts(posts);
        return { data: normalized, isLive: true };
      } catch (err) {
        console.error('[Supabase] Gagal mengupdate postingan:', err);
        throw err;
      }
    }

    // Local fallback
    const posts = this.getLocalPosts();
    const idx = posts.findIndex(p => p.id === id);
    if (idx !== -1) {
      posts[idx] = {
        ...posts[idx],
        ...updateData,
        cover_image: cover_image !== undefined ? cover_image : (posts[idx].cover_image || ''),
        featured_image: cover_image !== undefined ? cover_image : (posts[idx].featured_image || ''),
        updated_at: new Date().toISOString()
      };
      this.saveLocalPosts(posts);
      return { data: posts[idx], isLive: false };
    }
    throw new Error('Postingan tidak ditemukan di local storage');
  }

  async trashPost(id) {
    return await this.updatePost(id, { is_trash: true });
  }

  async restorePost(id) {
    return await this.updatePost(id, { is_trash: false });
  }

  async quickUpdate(id, fields) {
    return await this.updatePost(id, fields);
  }

  async bulkAction(action, ids) {
    if (!ids || !ids.length) return { count: 0 };
    let count = 0;
    for (const id of ids) {
      try {
        if (action === 'publish') await this.updatePost(id, { is_published: true, is_trash: false });
        else if (action === 'draft') await this.updatePost(id, { is_published: false, is_trash: false });
        else if (action === 'trash') await this.trashPost(id);
        else if (action === 'restore') await this.restorePost(id);
        else if (action === 'delete') await this.deletePost(id);
        count++;
      } catch (e) {
        console.warn('Bulk action error for id', id, e);
      }
    }
    return { count };
  }

  // --- WordPress-Style Taxonomy: Categories ---
  getCategories() {
    const defaultCats = [
      { name: 'Cloud Migration', slug: 'cloud-migration', desc: 'Studi kasus migrasi infrastruktur VPS, Kubernetes, dan hybrid cloud.' },
      { name: 'Database', slug: 'database', desc: 'PostgreSQL, Supabase, Firebase, dan arsitektur data performa tinggi.' },
      { name: 'Payment Gateway', slug: 'payment-gateway', desc: 'Integrasi sistem pembayaran Midtrans, Xendit, Doku, dan fee transaksi.' },
      { name: 'AI Tools', slug: 'ai-tools', desc: 'Benchmark efisiensi LLM API, prompt engineering, dan coding assistant.' },
      { name: 'Infrastructure', slug: 'infrastructure', desc: 'Server hardware, benchmark latensi lokal, dan sistem operasi jaringan.' },
      { name: 'B2B SaaS', slug: 'b2b-saas', desc: 'Evaluasi software operasional, ERP, CRM, dan legalitas bisnis digital.' }
    ];
    const stored = localStorage.getItem('hi_categories');
    if (!stored) {
      localStorage.setItem('hi_categories', JSON.stringify(defaultCats));
      return defaultCats;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return defaultCats;
    }
  }

  saveCategory(cat) {
    const cats = this.getCategories();
    const existing = cats.findIndex(c => c.slug === cat.slug);
    if (existing !== -1) {
      cats[existing] = { ...cats[existing], ...cat };
    } else {
      cats.push(cat);
    }
    localStorage.setItem('hi_categories', JSON.stringify(cats));
    return cats;
  }

  deleteCategory(slug) {
    let cats = this.getCategories();
    cats = cats.filter(c => c.slug !== slug);
    localStorage.setItem('hi_categories', JSON.stringify(cats));
    return cats;
  }

  // --- Client-Side Image Optimizer (Canvas Compression & Resize) ---
  async optimizeImage(file, maxWidth = 1600, maxHeight = 1600, quality = 0.85) {
    if (!file || !file.type || !file.type.startsWith('image/')) return file;
    if (file.type === 'image/svg+xml' || file.size < 120 * 1024) return file;

    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const outType = file.type === 'image/png' && file.size < 400 * 1024 ? 'image/png' : 'image/jpeg';
          canvas.toBlob((blob) => {
            if (blob && blob.size < file.size) {
              const ext = outType === 'image/png' ? '.png' : '.jpg';
              const cleanFileName = file.name.replace(/\.[^.]+$/, ext);
              resolve(new File([blob], cleanFileName, { type: outType }));
            } else {
              resolve(file);
            }
          }, outType, quality);
        };
        img.onerror = () => resolve(file);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  }

  // --- WordPress-Style Media Library & Supabase Storage ---
  async uploadMediaFile(file) {
    const optimized = await this.optimizeImage(file);
    const cleanBaseName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestamp = Date.now();
    const filePath = `blog/${timestamp}_${cleanBaseName}`;

    // 1. Coba upload langsung ke Supabase Storage (Bucket 'media')
    if (this.isLive && this.client && this.client.storage) {
      try {
        const { data, error } = await this.client.storage
          .from('media')
          .upload(filePath, optimized, {
            contentType: optimized.type || file.type || 'image/jpeg',
            cacheControl: '31536000',
            upsert: true
          });

        if (!error && data) {
          const { data: pubData } = this.client.storage
            .from('media')
            .getPublicUrl(filePath);

          if (pubData && pubData.publicUrl) {
            const cleanUrl = pubData.publicUrl;
            const newItem = {
              id: 'm-' + timestamp,
              name: file.name,
              title: file.name,
              url: cleanUrl,
              size: Math.round(optimized.size / 1024) + ' KB',
              type: optimized.type,
              storage: 'supabase',
              date: new Date().toISOString().split('T')[0]
            };
            this.addMedia(newItem);
            return {
              success: true,
              url: cleanUrl,
              isSupabase: true,
              item: newItem,
              message: 'Berhasil diunggah ke Supabase Storage (CDN)!'
            };
          }
        } else {
          console.warn('[Supabase Storage] Notice upload:', error?.message);
        }
      } catch (err) {
        console.warn('[Supabase Storage Exception]:', err);
      }
    }

    // 2. Fallback Lokal (Offline / Bucket 'media' belum dibuat)
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        const newItem = {
          id: 'm-' + timestamp,
          name: file.name,
          title: file.name,
          url: dataUrl,
          size: Math.round(optimized.size / 1024) + ' KB',
          type: optimized.type,
          storage: 'local',
          date: new Date().toISOString().split('T')[0]
        };
        this.addMedia(newItem);
        resolve({
          success: true,
          url: dataUrl,
          isSupabase: false,
          item: newItem,
          message: 'Tersimpan lokal di browser. Buat bucket "media" (Public) di Supabase Storage untuk link CDN pendek.'
        });
      };
      reader.readAsDataURL(optimized);
    });
  }

  getMedia() {
    const defaultMedia = [];
    const stored = localStorage.getItem('hi_media');
    if (!stored) {
      localStorage.setItem('hi_media', JSON.stringify(defaultMedia));
      return defaultMedia;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return defaultMedia;
    }
  }

  addMedia(item) {
    const media = this.getMedia();
    const newItem = {
      id: item.id || ('m-' + Date.now()),
      name: item.name || 'uploaded-asset.jpg',
      url: item.url,
      size: item.size || '150 KB',
      type: item.type || 'image/jpeg',
      storage: item.storage || 'local',
      date: item.date || new Date().toISOString().split('T')[0]
    };
    media.unshift(newItem);
    localStorage.setItem('hi_media', JSON.stringify(media));
    return newItem;
  }

  deleteMedia(id) {
    let media = this.getMedia();
    media = media.filter(m => m.id !== id);
    localStorage.setItem('hi_media', JSON.stringify(media));
    return true;
  }

  // --- Site & Global SEO Settings & Website Branding Copy ---
  getSettings() {
    const defaultSettings = {
      // Identitas & SEO Dasar
      site_title: 'Helmi Irfansah',
      site_tagline: 'Tech Notes & Web Lab',
      site_url: 'https://helmirfansah.com',
      author_name: 'Helmi Irfansah',
      contact_email: 'halo@helmirfansah.com',
      meta_title_format: '%title% - %site_name%',
      meta_description: 'Helmi Irfansah: developer Indonesia yang menulis studi teknis mendalam tentang cloud infrastructure, SaaS tools, AI, dan web development.',
      meta_keywords: 'cloud migration, nextjs, vps, coolify, supabase, midtrans, llm token, tech writer indonesia',
      og_image: '',
      google_verification: '',
      adsense_client_id: '',
      adsense_enabled: false,
      ads_txt_content: '',

      // Header, Logo & Footer Branding
      brand_logo_text: 'Helmi Irfansah',
      footer_status_text: '● Siap Berkolaborasi',
      footer_copyright: '© 2026 Helmi · Dibuat dengan bantuan Antigravity',
      drawer_copyright: '© 2026 Helmi Irfansah',

      // Hero Section
      hero_badge: 'Riset Teknis & Rekayasa Sistem · helmirfansah.com',
      hero_title: 'Membongkar kompleksitas <em style="font-style:italic;color:var(--accent-clay);">cloud</em> dan perangkat lunak.',
      hero_sub: 'Dari audit efisiensi server hingga integrasi AI modern - dibedah tuntas dengan data empiris, angka nyata, dan arsitektur mandiri <em>(self-hosted)</em>.',
      hero_cta_1_text: 'Buka Lab Kalkulator',
      hero_cta_1_url: '#lab',
      hero_cta_2_text: 'Baca Catatan Teknis →',
      hero_cta_2_url: '/blog',

      // About Section
      about_badge: 'Tentang Saya',
      about_title: 'Membangun perangkat lunak.<br>Membagikan apa yang dipelajari.',
      about_p1: 'Halo, saya <strong>Helmi Irfansah</strong>. Saya seorang software engineer dan tech writer asal Indonesia yang berfokus pada arsitektur cloud berbiaya efisien, integrasi AI modern, dan pengembangan produk B2B SaaS.',
      about_p2: 'Di era di mana biaya cloud dan kompleksitas stack semakin tidak terkendali, saya memprioritaskan kesederhanaan, transparansi angka, dan kepemilikan data mandiri <em>(self-hosting)</em>.',
      about_p3: 'Website ini adalah kanvas riset terbuka saya - tempat saya mempublikasikan benchmark latensi nyata, audit biaya penyedia infrastruktur, dan kalkulator interaktif gratis untuk membantu sesama developer & pendiri startup.',

      // 4 Kartu Keahlian & Fokus (Skills)
      skill_1_num: '01',
      skill_1_title: 'Cloud Architecture & VPS',
      skill_1_desc: 'Migrasi dari platform serverless mahal (Vercel, Heroku) ke VPS mandiri (Coolify, Dokku, Hetzner, Biznet Gio) yang menghemat biaya hingga 80%.',
      skill_2_num: '02',
      skill_2_title: 'BaaS & Database Modern',
      skill_2_desc: 'PostgreSQL, Supabase, Firebase, dan ClickHouse - merancang skema relasional tangguh dengan Row Level Security dan query sub-50ms.',
      skill_3_num: '03',
      skill_3_title: 'Integrasi LLM & AI Tools',
      skill_3_desc: 'Menerapkan OpenAI, Anthropic Claude, dan Gemini API ke dalam produk produksi dengan caching token efisien dan pemantauan biaya transparan.',
      skill_4_num: '04',
      skill_4_title: 'B2B Payment & FinTech',
      skill_4_desc: 'Integrasi Midtrans, Xendit, dan Doku untuk pasar Indonesia - simulasi fee transaksi, penanganan webhook andal, dan rekonsiliasi otomatis.',

      // Judul Bagian Konten & Empty State
      works_badge: 'Studi Kasus Unggulan',
      works_title: 'Eksplorasi Teknis<br>& Benchmark Nyata',
      works_empty_title: 'Belum Ada Studi Kasus Dipublikasikan',
      works_empty_desc: 'Artikel dan eksplorasi teknis terbaru akan segera hadir. Anda dapat menulis dan merilis artikel pertama Anda melalui panel admin.',
      works_empty_btn: 'Buka Admin Panel →',
      works_more_btn_text: 'Lihat Semua Tulisan →',

      notes_badge: 'Catatan Teknis',
      notes_title: 'Fragmen Pemikiran<br>& Eksplorasi',
      notes_empty_desc: 'Belum ada catatan teknis tersedia saat ini.',
      notes_more_btn_text: 'Semua Catatan →',

      // Lab & Kalkulator
      lab_enabled: true,
      lab_badge: 'KALKULATOR & TOOLS',
      lab_title: 'Kalkulator Cuan Afiliasi<br>&amp; Engagement Medsos',
      lab_desc: 'Simulasi potensi komisi affiliate marketing, estimasi rate card endorsement akun media sosial, serta efisiensi server cloud &amp; token AI.',
      lab_usd_idr: 16000,

      // Bagian Kontak
      contact_badge: 'Kontak',
      contact_title: 'Mari ngobrol.',
      contact_desc: 'Tertarik berkolaborasi, ada pertanyaan seputar social media &amp; affiliate, atau sekadar mau berdiskusi? Saya terbuka untuk semuanya.',
      contact_github_text: 'GitHub',
      contact_github_url: 'https://github.com/helmirfansah',
      contact_linkedin_text: 'LinkedIn',
      contact_linkedin_url: 'https://linkedin.com/in/helmirfansah',

      // Halaman Blog
      blog_archive_title: 'Catatan & Studi Kasus',
      blog_archive_desc: 'Eksplorasi strategi social media growth, teknik konversi affiliate marketing, serta riset implementasi Web3 dunia nyata.',

      // Navigasi Menu Utama (Header & Mobile Drawer) dengan Dukungan Submenu
      nav_main: [
        { id: 'nav_1', label: 'Tentang', url: '/#about', target: '_self' },
        { id: 'nav_2', label: 'Arsip Karya', url: '/#works', target: '_self' },
        { 
          id: 'nav_3', 
          label: 'Kalkulator & Tools', 
          url: '/tools', 
          target: '_self',
          children: [
            { id: 'sub_aff', label: 'Kalkulator Komisi Affiliate', url: '/tools/kalkulator-affiliate', target: '_self' },
            { id: 'sub_er', label: 'Kalkulator ER & Rate Card', url: '/tools/kalkulator-engagement-rate', target: '_self' },
            { id: 'sub_cloud', label: 'Kalkulator Cloud VPS', url: '/tools/kalkulator-cloud-vps', target: '_self' },
            { id: 'sub_ai', label: 'Kalkulator Token AI', url: '/tools/kalkulator-token-ai', target: '_self' }
          ]
        },
        { id: 'nav_4', label: 'Blog', url: '/blog', target: '_self' },
        { id: 'nav_5', label: 'Kontak', url: '/#contact', target: '_self' }
      ],

      // Navigasi Menu Footer
      nav_footer: [
        { id: 'fnav_1', label: 'About Me', url: '/#about', target: '_self' },
        { id: 'fnav_2', label: 'Kalkulator & Tools', url: '/tools', target: '_self' },
        { id: 'fnav_3', label: 'Blog', url: '/blog', target: '_self' },
        { id: 'fnav_4', label: 'Privacy Policy', url: '/privacy', target: '_self' },
        { id: 'fnav_5', label: 'Disclaimer', url: '/disclaimer', target: '_self' },
        { id: 'fnav_6', label: 'Contact', url: '/#contact', target: '_self' }
      ],

      // Daftar Tools & Kalkulator Interaktif Website (Dapat di-CRUD di Admin)
      site_tools: DEFAULT_TOOLS
    };
    const stored = localStorage.getItem('hi_site_settings');
    if (!stored) {
      localStorage.setItem('hi_site_settings', JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    try {
      const parsed = JSON.parse(stored);
      // Auto-migrate outdated nav labels cached in user browser
      if (parsed.nav_main && Array.isArray(parsed.nav_main)) {
        parsed.nav_main = parsed.nav_main.map(item => {
          if (item.url === '/tools' || item.label.includes('Lab')) {
            const children = (item.children && Array.isArray(item.children) && item.children.length > 0)
              ? item.children
              : defaultSettings.nav_main.find(d => d.id === 'nav_3')?.children || [];
            return { ...item, label: 'Kalkulator & Tools', url: '/tools', children };
          }
          if (item.url === '/#works' && item.label.includes('Studi Kasus')) {
            return { ...item, label: 'Arsip Karya' };
          }
          return item;
        });
      } else {
        parsed.nav_main = defaultSettings.nav_main;
      }

      // Auto-migrate site_tools
      if (!parsed.site_tools || !Array.isArray(parsed.site_tools) || parsed.site_tools.length === 0) {
        parsed.site_tools = DEFAULT_TOOLS;
      }

      return { ...defaultSettings, ...parsed };
    } catch {
      return defaultSettings;
    }
  }

  saveSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem('hi_site_settings', JSON.stringify(updated));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hi_settings_updated', { detail: updated }));
    }

    // Sinkronisasi otomatis ke cloud Supabase jika terhubung
    if (this.isLive && this.client) {
      this.client
        .from('site_settings')
        .upsert({
          id: 'global',
          data: updated,
          updated_at: new Date().toISOString()
        })
        .then(({ error }) => {
          if (error) console.warn('[Supabase] Gagal sync site_settings:', error);
          else console.info('[Supabase] site_settings berhasil disinkronkan ke cloud.');
        })
        .catch(err => console.warn('[Supabase] Error sync site_settings:', err));
    }

    return updated;
  }

  // --- Lab & Tools CRUD Methods ---
  getTools() {
    const s = this.getSettings();
    if (s.site_tools && Array.isArray(s.site_tools) && s.site_tools.length > 0) {
      return s.site_tools;
    }
    return DEFAULT_TOOLS;
  }

  saveTool(tool) {
    const tools = [...this.getTools()];
    if (tool.id) {
      const idx = tools.findIndex(t => t.id === tool.id);
      if (idx !== -1) {
        tools[idx] = { ...tools[idx], ...tool };
      } else {
        tools.push(tool);
      }
    } else {
      const newTool = {
        ...tool,
        id: 'tool_' + Date.now(),
        order: tools.length + 1,
        is_active: tool.is_active !== undefined ? tool.is_active : true
      };
      tools.push(newTool);
    }
    this.saveSettings({ site_tools: tools });
    return tools;
  }

  toggleToolStatus(id) {
    const tools = this.getTools().map(t => {
      if (t.id === id) {
        return { ...t, is_active: !t.is_active };
      }
      return t;
    });
    this.saveSettings({ site_tools: tools });
    return tools;
  }

  deleteTool(id) {
    const tools = this.getTools().filter(t => t.id !== id);
    this.saveSettings({ site_tools: tools });
    return tools;
  }

  // --- WordPress-Style Tools: Export & Import ---
  async exportData() {
    const { data: posts } = await this.getPosts({ includeDrafts: true });
    const categories = this.getCategories();
    const media = this.getMedia();
    const payload = {
      export_version: '2.0',
      exported_at: new Date().toISOString(),
      author: 'Helmi Irfansah',
      posts: posts || [],
      categories,
      media
    };
    return JSON.stringify(payload, null, 2);
  }

  async importData(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.posts && Array.isArray(parsed.posts)) {
        for (const p of parsed.posts) {
          // clean up id to avoid collision
          const { id, ...cleanPost } = p;
          await this.createPost(cleanPost);
        }
      }
      if (parsed.categories && Array.isArray(parsed.categories)) {
        localStorage.setItem('hi_categories', JSON.stringify(parsed.categories));
      }
      return { success: true, count: parsed.posts ? parsed.posts.length : 0 };
    } catch (e) {
      throw new Error('Format JSON tidak valid: ' + e.message);
    }
  }

  // --- Authentication & Persistent Session Helpers ---
  async getSession() {
    if (this.isLive && this.client) {
      try {
        const { data: { session }, error } = await this.client.auth.getSession();
        if (!error && session) {
          return session;
        }
      } catch (err) {
        console.warn('[Supabase] getSession gagal:', err);
      }
    }
    // Fallback: Persistent local session
    const stored = localStorage.getItem('hi_mock_auth');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        return { user, access_token: 'local-session-active' };
      } catch {
        localStorage.removeItem('hi_mock_auth');
      }
    }
    return null;
  }

  async getCurrentUser() {
    const session = await this.getSession();
    return session ? session.user : null;
  }

  async login(email, password, rememberMe = true) {
    if (this.isLive && this.client) {
      const res = await this.client.auth.signInWithPassword({ email, password });
      if (!res.error && res.data?.user) {
        // Supabase persists session automatically in localStorage
        localStorage.setItem('hi_admin_logged_in', 'true');
      }
      return res;
    }

    // Demo / Local Admin Login
    if (email === 'admin@helmirfansah.com' && password === 'admin123') {
      const mockUser = {
        id: 'usr_admin_helmi',
        email: 'admin@helmirfansah.com',
        user_metadata: { name: 'Helmi Irfansah' },
        role: 'superadmin'
      };
      if (rememberMe) {
        localStorage.setItem('hi_mock_auth', JSON.stringify(mockUser));
        localStorage.setItem('hi_admin_logged_in', 'true');
      } else {
        sessionStorage.setItem('hi_mock_auth', JSON.stringify(mockUser));
      }
      return { data: { user: mockUser, session: { user: mockUser } }, error: null };
    }

    return {
      data: null,
      error: {
        message: 'Kredensial salah. Gunakan email admin@helmirfansah.com & password admin123 (Demo), atau masukkan kredensial Supabase Anda di menu Pengaturan.'
      }
    };
  }

  async signUp(email, password) {
    if (this.isLive && this.client) {
      return await this.client.auth.signUp({
        email,
        password,
        options: { data: { name: 'Helmi Irfansah' } }
      });
    }
    return {
      data: null,
      error: {
        message: 'Silakan sambungkan Supabase Project URL & Anon Key terlebih dahulu untuk membuat user baru di database cloud Anda.'
      }
    };
  }

  async logout() {
    localStorage.removeItem('hi_mock_auth');
    localStorage.removeItem('hi_admin_logged_in');
    sessionStorage.removeItem('hi_mock_auth');
    if (this.isLive && this.client) {
      return await this.client.auth.signOut();
    }
    return { error: null };
  }

  onAuthStateChange(callback) {
    if (this.isLive && this.client) {
      return this.client.auth.onAuthStateChange(callback);
    }
    return { data: { subscription: { unsubscribe: () => {} } } };
  }

  slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
}

// Export single instance globally
window.BlogService = new SupabaseBlogService();
