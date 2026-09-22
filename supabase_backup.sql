-- ==============================================================================
-- FULL SUPABASE DATABASE BACKUP & RESTORE SCRIPT
-- Website: helmirfansah.com
-- Author: Helmi Irfansah
-- Description: Complete DDL schema, tables (posts, site_settings), storage bucket,
--              RLS security policies, triggers, indexes, and all 6 curated articles.
-- 
-- CARA PENGGUNAAN / RESTORE:
-- 1. Buka Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Pilih Project Anda -> Buka menu "SQL Editor" di sidebar kiri
-- 3. Klik "New Query", paste seluruh isi file ini, lalu klik "Run" (atau Ctrl+Enter)
-- 4. Semua tabel, relasi, storage bucket, dan artikel otomatis pulih 100%.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABEL POSTS (ARTIKEL BLOG)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL, -- Format Markdown
  category TEXT NOT NULL DEFAULT 'Affiliate Marketing',
  tags TEXT[] DEFAULT '{}',
  reading_time_minutes INTEGER DEFAULT 5,
  cover_image TEXT DEFAULT '',
  featured_image TEXT DEFAULT '',
  seo_focus_keyword TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  is_published BOOLEAN DEFAULT true,
  is_trash BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. TABEL SITE SETTINGS (BRANDING & KONTEN GLOBAL)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Posts Policies
DROP POLICY IF EXISTS "Public users can view published posts" ON public.posts;
CREATE POLICY "Public users can view published posts" 
ON public.posts 
FOR SELECT 
USING (is_published = true AND (is_trash IS NULL OR is_trash = false));

DROP POLICY IF EXISTS "Authenticated users can manage all posts" ON public.posts;
CREATE POLICY "Authenticated users can manage all posts" 
ON public.posts 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Anon users can manage posts" ON public.posts;
CREATE POLICY "Anon users can manage posts" 
ON public.posts 
FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);

-- Site Settings Policies
DROP POLICY IF EXISTS "Public can view site_settings" ON public.site_settings;
CREATE POLICY "Public can view site_settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Anyone can manage site_settings" ON public.site_settings;
CREATE POLICY "Anyone can manage site_settings" 
ON public.site_settings 
FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 4. INDEKS UNTUK OPTIMASI PERFORMA QUERY
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts(is_published);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);

-- ------------------------------------------------------------------------------
-- 5. FUNCTION & TRIGGER: AUTO UPDATE 'updated_at'
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_posts_modtime ON public.posts;
CREATE TRIGGER update_posts_modtime
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- ------------------------------------------------------------------------------
-- 6. RPC FUNCTION: INCREMENT POST VIEWS SECURELY
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.posts
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = post_id;
END;
$$;

GRANT EXECUTE ON FUNCTION increment_post_views(UUID) TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 7. STORAGE BUCKET: MEDIA & GAMBER
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
CREATE POLICY "Public can view media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Anyone can upload media" ON storage.objects;
CREATE POLICY "Anyone can upload media" 
ON storage.objects 
FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "Anyone can update media" ON storage.objects;
CREATE POLICY "Anyone can update media" 
ON storage.objects 
FOR UPDATE 
TO public 
USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Anyone can delete media" ON storage.objects;
CREATE POLICY "Anyone can delete media" 
ON storage.objects 
FOR DELETE 
TO public 
USING (bucket_id = 'media');

-- ------------------------------------------------------------------------------
-- 8. DATA: SITE SETTINGS (BRANDING, COPYWRITING & NAVIGASI)
-- ------------------------------------------------------------------------------
INSERT INTO public.site_settings (id, data) 
VALUES ('global', '{
  "brand_logo_text": "Helmi Irfansah",
  "brand_role": "Social Media & Affiliate Marketer | Web3 Explorer",
  "brand_tagline": "Spesialis pertumbuhan audiens organik, optimasi konversi afiliasi, dan riset adopsi Web3.",
  "hero_badge": "Social Media & Affiliate Marketing · helmirfansah.com",
  "hero_title": "Membangun audiens setia. <em style=\"font-style:italic;color:var(--accent-clay);\">Mengubah atensi</em> menjadi konversi nyata.",
  "hero_sub": "Dari strategi viral organik di TikTok & Instagram, rekayasa konversi corong affiliate marketing (Shopee/TikTok/SaaS), hingga eksperimen adopsi Web3 & Blockchain.",
  "hero_cta_1_text": "Kalkulator & Tools",
  "hero_cta_1_url": "/tools",
  "hero_cta_2_text": "Baca Catatan Strategi →",
  "hero_cta_2_url": "/blog",
  "about_badge": "Tentang Saya",
  "about_title": "Membangun audiens.<br>Menguji apa yang benar-benar menghasilkan.",
  "lab_badge": "KALKULATOR & TOOLS",
  "lab_title": "Kalkulator Cuan Afiliasi<br>&amp; Engagement Medsos",
  "lab_desc": "Simulasi potensi komisi affiliate marketing, estimasi rate card endorsement akun media sosial, serta efisiensi server cloud &amp; token AI.",
  "lab_usd_idr": 16000,
  "nav_main": [
    { "id": "nav_1", "label": "Tentang", "url": "/#about", "target": "_self" },
    { "id": "nav_2", "label": "Arsip Karya", "url": "/#works", "target": "_self" },
    { "id": "nav_3", "label": "Kalkulator & Tools", "url": "/tools", "target": "_self" },
    { "id": "nav_4", "label": "Blog", "url": "/blog", "target": "_self" },
    { "id": "nav_5", "label": "Kontak", "url": "/#contact", "target": "_self" }
  ],
  "nav_footer": [
    { "id": "fnav_1", "label": "About Me", "url": "/#about", "target": "_self" },
    { "id": "fnav_2", "label": "Kalkulator & Tools", "url": "/tools", "target": "_self" },
    { "id": "fnav_3", "label": "Blog", "url": "/blog", "target": "_self" },
    { "id": "fnav_4", "label": "Privacy Policy", "url": "/privacy", "target": "_self" },
    { "id": "fnav_5", "label": "Disclaimer", "url": "/disclaimer", "target": "_self" },
    { "id": "fnav_6", "label": "Contact", "url": "/#contact", "target": "_self" }
  ]
}'::jsonb) 
ON CONFLICT (id) DO UPDATE 
SET data = EXCLUDED.data, updated_at = timezone('utc'::text, now());

-- ------------------------------------------------------------------------------
-- 9. DATA: 6 ARTIKEL LENGKAP (POSTS SEED)
-- ------------------------------------------------------------------------------
INSERT INTO public.posts (
  slug,
  title,
  excerpt,
  content,
  category,
  tags,
  reading_time_minutes,
  cover_image,
  featured_image,
  seo_focus_keyword,
  meta_description,
  is_published,
  is_trash,
  view_count,
  created_at,
  updated_at
) VALUES 
(
  'halo-dunia-perkenalan-helmi-irfansah',
  'Halo Dunia: Membangun Audiens Organik, Riset Afiliasi, dan Eksplorasi Web3',
  'Selamat datang di helmirfansah.com. Catatan strategi seputar social media growth, corong konversi affiliate marketing, serta pengujian adopsi Web3 dan AI tools.',
  '## Selamat Datang di Ruang Eksplorasi Saya

Halo! Saya **Helmi Irfansah**. Selamat datang di website dan lab digital pribadi saya.

Situs ini saya bangun sebagai ruang dokumentasi teknis dan strategi empiris seputar:
1. **Pertumbuhan Audiens Media Sosial Organik:** Membedah algoritma TikTok, Instagram Reels, dan format konten video pendek yang konsisten mendatangkan atensi audiens tertarget.
2. **Corong Konversi Affiliate Marketing:** Menganalisis metrik nyata (Views, CTR, CVR, AOV, dan EPC) untuk memaksimalkan komisi bersih tanpa harus bergantung pada endorse berbayar.
3. **Eksplorasi Web3 & Crypto:** Mempelajari bagaimana prinsip social media dan affiliate distribution dapat diterapkan pada ekosistem blockchain terdesentralisasi.
4. **Tools & Kalkulator Interaktif:** Mengembangkan kalkulator gratis seperti [Kalkulator Komisi Affiliate](/tools/kalkulator-affiliate) dan [Kalkulator Engagement Rate](/tools/kalkulator-engagement-rate) untuk membantu kreator mengukur performa.

> [!NOTE]
> Filosofi utama di balik blog ini adalah **kejujuran data dan hasil empiris**. Kami tidak membagikan tips tanpa uji coba langsung, metrik yang transparan, dan studi kasus nyata.

Silakan jelajahi tulisan dan tools yang ada, dan mari terhubung melalui media sosial atau kontak di bawah!',
  'Affiliate Marketing',
  ARRAY['Perkenalan', 'Social Media', 'Affiliate Marketing', 'Web3'],
  3,
  '',
  '',
  'Helmi Irfansah',
  'Selamat datang di helmirfansah.com. Ruang eksplorasi seputar social media growth, corong konversi affiliate marketing, dan adopsi Web3.',
  true,
  false,
  35,
  now() - interval '5 days',
  now()
),
(
  'strategi-corong-affiliate-marketing-2026',
  'Strategi Corong Affiliate Marketing 2026: Mengubah Views Medsos Menjadi Konversi Omset Nyata',
  'Views jutaan tidak menjamin komisi besar jika corong konversinya bocor. Pelajari cara menghitung rasio CTR dan CVR serta strategi storytelling produk yang terbukti closing.',
  '## Mengapa Views Jutaan Bisa Berujung Nol Penjualan?

Banyak kreator pemula terjebak dalam perangkap *vanity metrics*—merasa puas ketika videonya menembus ratusan ribu penonton, namun kecewa saat membuka dashboard afiliasi dan mendapati komisi hanya beberapa ribu rupiah.

Kunci sukses affiliate marketing bukan hanya seberapa banyak orang yang menonton, melainkan seberapa kuat **daya pikat konversi (conversion intent)** dari konten yang Anda sajikan.

---

### Anatomi Rumus Cuan Afiliasi

Penghasilan bersih affiliate dihitung dari perkalian 5 variabel kunci:

$$\text{Komisi} = \text{Total Views} \times \text{CTR Link} \times \text{CVR Pembelian} \times \text{AOV} \times \text{Komisi \%}$$

- **CTR (Click-Through Rate):** Persentase penonton yang terdorong mengklik link di bio atau keranjang kuning.
- **CVR (Conversion Rate):** Persentase pengunjung yang benar-benar menyelesaikan pembayaran di marketplace.
- **AOV (Average Order Value):** Rata-rata nilai belanja keranjang pembeli.
- **Komisi %:** Persentase bagi hasil dari penjual/platform (misal Shopee 5-10%, TikTok 7-15%, SaaS 20-30%).

> [!TIP]
> Anda dapat mencoba menyimulasikan berbagai skenario views dan persentase komisi secara instan menggunakan [Kalkulator Komisi Affiliate Kami](/tools/kalkulator-affiliate).

---

### 3 Pilar Storytelling yang Meningkatkan CVR

1. **Hook Berbasis Masalah (The Pain Hook):** Tunjukkan frustrasi nyata penonton dalam 3 detik pertama sebelum menyebutkan solusi produk.
2. **Demonstrasi Tanpa Teori (Show, Don''t Tell):** Perlihatkan bagaimana produk menyelesaikan masalah tersebut secara visual.
3. **Call-To-Action yang Mengarahkan (Specific CTA):** Jangan sekadar bilang "klik link di bio", berikan alasan mendesak seperti promo terbatas atau voucher khusus.',
  'Affiliate Marketing',
  ARRAY['Affiliate Marketing', 'Konversi', 'TikTok Shop', 'Shopee Affiliate'],
  5,
  '',
  '',
  'Affiliate Marketing 2026',
  'Pelajari formula corong affiliate marketing 2026 untuk mengubah views media sosial menjadi komisi bersih nyata dengan optimasi CTR dan CVR.',
  true,
  false,
  82,
  now() - interval '4 days',
  now()
),
(
  'cara-hitung-engagement-rate-dan-rate-card-medsos',
  'Panduan Menghitung Engagement Rate & Menentukan Nilai Wajar Rate Card Influencer di Indonesia',
  'Berapa tarif endorse yang pantas untuk akun Anda? Pelajari rumus ER standar industri dan tolak ukur rate card endorsement untuk kreator Nano hingga Macro.',
  '## Menentukan Nilai Jual Akun Anda di Depan Brand

Banyak kreator bingung saat pertama kali dihubungi agensi atau brand untuk penawaran *endorsement* atau *sponsored post*. Menetapkan harga terlalu tinggi berisiko membuat brand kabur, sedangkan menetapkan harga terlalu rendah merugikan kerja keras Anda.

Untuk menentukan tarif endorse yang profesional dan dapat dipertanggungjawabkan, metrik utama yang dijadikan patokan oleh brand manager adalah **Engagement Rate (ER)**.

---

### Rumus Standar Engagement Rate

Engagement Rate mengukur seberapa aktif audiens berinteraksi dengan postingan Anda dibandingkan jumlah total pengikut (*followers*):

$$\text{ER (\%)} = \frac{\text{Total Interaksi (Likes + Comments + Shares + Saves)}}{\text{Total Followers}} \times 100\%$$

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

Faktor pengali harga meliputi orisinalitas konsep, kualitas produksi audio-visual, serta hak pakai iklan (*whitelisting/usage rights*).',
  'Social Media Strategy',
  ARRAY['Social Media', 'Engagement Rate', 'Rate Card', 'Endorsement', 'Influencer'],
  4,
  '',
  '',
  'Engagement Rate Medsos',
  'Cara menghitung Engagement Rate media sosial dan menentukan nilai wajar rate card endorsement kreator di pasar Indonesia tahun 2026.',
  true,
  false,
  64,
  now() - interval '3 days',
  now()
),
(
  'apa-itu-airdrop-crypto-panduan-pemula',
  'Apa Itu Airdrop Crypto? Panduan Lengkap Mendapatkan Token Gratis untuk Pemula',
  'Mengenal konsep airdrop crypto, alasan di balik pembagian token digital gratis oleh proyek Web3, serta cara berpartisipasi dengan aman.',
  '## Berkenalan dengan Konsep Airdrop Crypto

Bayangkan Anda sedang mencoba platform digital baru yang sedang dalam tahap peluncuran. Tiba-tiba pengembang platform tersebut membagikan token utilitas atau aset digital secara cuma-cuma ke dompet digital Anda karena Anda menjadi pengguna awal *(early adopter)*.

Di dunia teknologi terdesentralisasi *(Web3)*, mekanisme promosi ini dikenal luas dengan istilah **Airdrop Crypto**.

---

### Mengapa Proyek Web3 Membagikan Token Gratis?

Banyak orang yang baru pertama kali mendengar airdrop merasa heran: *Mengapa pengembang bersedia membagikan aset bernilai ekonomis tanpa meminta pembayaran tunai?*

Jawabannya terletak pada strategi pemasaran dan distribusi kepemilikan jaringan:

1. **Insentif Penguji Jaringan (Beta Testing):** Sebelum meluncurkan produk ke jaringan utama (*Mainnet*), pengembang membutuhkan ribuan pengguna nyata untuk menguji skalabilitas server, menemukan celah bug, dan mencoba fitur transaksi.
2. **Distribusi Tata Kelola (Decentralized Governance):** Proyek Web3 sering kali bertransformasi menjadi organisasi otonom (DAO). Token yang dibagikan berfungsi sebagai hak suara *(voting power)* bagi komunitas.
3. **Efek Jaringan & Pertumbuhan Organik:** Strategi airdrop menciptakan gelombang atensi masif di media sosial (X/Twitter, Discord, Telegram) yang mendongkrak adopsi produk dengan biaya akuisisi pengguna (*CAC*) yang jauh lebih terukur dibandingkan iklan konvensional.

---

### 3 Kategori Misi Airdrop yang Umum Dijumpai

- **Testnet Airdrop:** Misi yang 100% bebas risiko finansial. Pengguna hanya berinteraksi menggunakan token uji coba gratis (faucet) untuk mencoba fitur aplikasi.
- **Retroactive Airdrop:** Hadiah kejutan bagi pengguna awal yang pernah menggunakan produk (seperti transaksi swap atau penyediaan likuiditas) sebelum pengumuman resmi token diluncurkan.
- **Community & Social Tasks:** Misi partisipasi komunitas, seperti mengikuti pembaruan riset, memberikan umpan balik produk, dan mengedukasi audiens baru di platform media sosial.

> [!NOTE]
> Selalu terapkan prinsip kehati-hatian: jangan pernah membagikan kata kunci rahasia (*Secret Recovery Phrase / Seed Phrase*) dompet Anda kepada siapa pun, dan hindari menandatangani transaksi dari tautan yang tidak resmi.',
  'Web3 & Crypto',
  ARRAY['Airdrop', 'Web3', 'Crypto', 'Blockchain', 'Edukasi'],
  5,
  '',
  '',
  'Apa itu airdrop crypto',
  'Panduan lengkap memahami apa itu airdrop crypto, alasan pembagian token gratis di Web3, dan cara berpartisipasi dengan aman bagi pemula.',
  true,
  false,
  95,
  now() - interval '2 days',
  now()
),
(
  'apa-itu-blockchain-penjelasan-mudah-untuk-pemula',
  'Memahami Apa Itu Blockchain: Penjelasan Sederhana Cara Kerja Buku Kas Digital Terdesentralisasi',
  'Penjelasan mudah cara kerja teknologi blockchain menggunakan analogi buku kas kelas yang transparan, aman dari manipulasi, dan tanpa perantara.',
  '## Membedah Teknologi di Balik Internet Masa Depan

Banyak orang mengira blockchain adalah teknologi yang sangat rumit dan penuh dengan matematika rumit. Padahal, jika disederhanakan, konsep dasarnya sangat mirip dengan **buku catatan kas bersama yang anti-curang**.

---

### Cerita Analogi: Buku Kas yang Dipegang Bersama

Bayangkan dalam sebuah organisasi atau perkumpulan, hanya ada satu orang bendahara yang memegang satu-satunya buku catatan keuangan. 
- Jika bendahara tersebut salah mencatat atau berniat curang, catatan bisa diubah secara sepihak.
- Jika buku tersebut hilang atau rusak, seluruh riwayat transaksi musnah.

**Solusi Blockchain:**
Setiap kali terjadi transaksi pembayaran, pengumuman disiarkan secara terbuka ke seluruh anggota. **Semua anggota serentak mencatat transaksi yang sama di buku catatan masing-masing.** 

Jika ada satu pihak yang mencoba memalsukan catatannya, salinan tersebut akan langsung ditolak oleh mayoritas anggota lain karena tidak cocok dengan ribuan salinan yang sah. 

Inilah esensi dasar dari **sistem buku besar terdistribusi (Distributed Ledger Technology)**.

---

### Mengapa Disebut "Block" dan "Chain"?

- **Block (Blok Data):** Transaksi yang terjadi dalam rentang waktu tertentu dikelompokkan ke dalam satu balok data digital.
- **Chain (Rantai Kriptografi):** Setiap blok data baru dihubungkan ke blok sebelumnya menggunakan kode sidik jari digital unik (*cryptographic hash*). 

Keterikatan matematis ini memastikan bahwa sekali sebuah transaksi tercatat dan dirantai ke masa lalu, catatan tersebut **mustahil diubah atau dihapus (immutable)** tanpa merusak seluruh integritas rantai berikutnya.

---

### 3 Pilar Keunggulan Blockchain

1. **Desentralisasi:** Tidak ada server tunggal yang dapat dimatikan oleh satu pihak berwenang. Sistem berjalan di ribuan komputer independen *(node)* di seluruh dunia.
2. **Transparansi Tinggi:** Siapa pun dapat memeriksa keabsahan riwayat transaksi melalui *blockchain explorer* publik tanpa perlu bergantung pada pihak ketiga.
3. **Ketahanan Data:** Data yang telah divalidasi bersifat permanen dan tahan terhadap risiko sensor maupun manipulasi data.',
  'Web3 & Crypto',
  ARRAY['Blockchain', 'Teknologi', 'Web3', 'Desentralisasi', 'Edukasi'],
  5,
  '',
  '',
  'Apa itu blockchain',
  'Penjelasan mudah cara kerja teknologi blockchain menggunakan analogi buku kas digital terdesentralisasi, transparan, dan tahan manipulasi.',
  true,
  false,
  112,
  now() - interval '1 day',
  now()
),
(
  'apa-itu-crypto-wallet-dan-web3-wallet',
  'Mengenal Crypto Wallet: Cara Kerja Dompet Web3 dan Fondasi Keamanan Aset Digital',
  'Pelajari perbedaan nomor alamat publik dan kata sandi pemulihan rahasia (seed phrase), serta aturan dasar menjaga aset digital tetap aman.',
  '## Dompet Digital Bukan Sekadar Tempat Menyimpan Uang

Jika dalam perbankan konvensional Anda menyimpan saldo di server milik bank, pada ekosistem Web3 Anda memegang kendali penuh atas aset digital Anda sendiri. Media utama yang digunakan untuk berinteraksi di dunia ini adalah **Crypto Wallet** atau **Web3 Wallet**.

---

### Cara Kerja: Dompet Tidak Menyimpan Koin Secara Fisik

Salah satu kesalahpahaman paling umum adalah mengira dompet crypto menyimpan koin di dalam perangkat memori HP atau laptop Anda.

Secara teknis, koin digital Anda **selalu berada di dalam jaringan blockchain**. Yang disimpan oleh aplikasi dompet Anda adalah **kunci kriptografi rahasia** yang membuktikan kepemilikan Anda atas alamat aset tersebut.

---

### Rahasia Dua Kunci: Public Address vs Private Key

Agar mudah dipahami, bayangkan dompet crypto seperti **kotak surat pribadi**:

1. **Public Address (Alamat Publik):**
   - Diibaratkan seperti nomor kotak surat atau nomor rekening bank Anda.
   - Formatnya berupa kombinasi panjang huruf dan angka (misal diawali `0x...`).
   - Informasi ini aman untuk dibagikan kepada siapa pun yang ingin mengirimkan token atau aset kepada Anda.

2. **Seed Phrase / Secret Recovery Phrase (Frase Pemulihan Rahasia):**
   - Diibaratkan sebagai kunci fisik master untuk membuka brankas kotak surat tersebut.
   - Terdiri dari rangkaian 12 atau 24 kata acak bahasa Inggris.
   - **Peringatan Penting:** Siapa pun yang mengetahui rangkaian kata ini memiliki akses penuh untuk memindahkan seluruh aset Anda. Jangan pernah menyimpan frase ini di tangkapan layar (screenshot), email, atau memberikannya kepada siapa pun.

---

### Checklist Praktis Menjaga Keamanan Dompet Web3

- **Cadangkan di Media Fisik:** Tulis 12/24 kata frase pemulihan di atas kertas dan simpan di tempat yang aman dari air dan api.
- **Gunakan Dompet Terpisah untuk Eksplorasi:** Pisahkan dompet untuk penyimpanan jangka panjang *(cold storage)* dengan dompet aktif yang digunakan untuk menguji aplikasi baru.
- **Waspada Phishing:** Selalu periksa kembali URL situs web sebelum menghubungkan *(connect)* dompet digital Anda.',
  'Web3 & Crypto',
  ARRAY['Crypto Wallet', 'Web3', 'MetaMask', 'Keamanan Digital', 'Edukasi'],
  5,
  '',
  '',
  'Crypto wallet pemula',
  'Panduan memahami cara kerja crypto wallet, perbedaan public address dan seed phrase, serta tips penting menjaga keamanan dompet Web3.',
  true,
  false,
  88,
  now(),
  now()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  reading_time_minutes = EXCLUDED.reading_time_minutes,
  seo_focus_keyword = EXCLUDED.seo_focus_keyword,
  meta_description = EXCLUDED.meta_description,
  is_published = EXCLUDED.is_published,
  updated_at = now();

-- ------------------------------------------------------------------------------
-- 10. VERIFIKASI HASIL RESTORE
-- ------------------------------------------------------------------------------
SELECT 
  category, 
  count(*) AS total_artikel,
  sum(view_count) AS total_views
FROM public.posts 
GROUP BY category
ORDER BY total_artikel DESC;
