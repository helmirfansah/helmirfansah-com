-- ==============================================================================
-- SUPABASE DATABASE SCHEMA: helmirfansah.com BLOG & LAB
-- Salin dan jalankan script SQL ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Buat Tabel Posts
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL, -- Format Markdown
  category TEXT NOT NULL DEFAULT 'Infrastructure',
  tags TEXT[] DEFAULT '{}',
  reading_time_minutes INTEGER DEFAULT 5,
  cover_image TEXT,
  featured_image TEXT,
  seo_focus_keyword TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT true,
  is_trash BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 3. Policy Posts:
-- Publik dapat melihat artikel yang dipublikasikan dan bukan di kotak sampah
DROP POLICY IF EXISTS "Public users can view published posts" ON public.posts;
CREATE POLICY "Public users can view published posts" 
ON public.posts 
FOR SELECT 
USING (is_published = true AND (is_trash IS NULL OR is_trash = false));

-- Pengguna Login (Authenticated) memiliki akses penuh ke semua artikel
DROP POLICY IF EXISTS "Authenticated users can manage all posts" ON public.posts;
CREATE POLICY "Authenticated users can manage all posts" 
ON public.posts 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Akses via Anon Key (Dashboard Admin Lokal):
DROP POLICY IF EXISTS "Anon users can manage posts" ON public.posts;
CREATE POLICY "Anon users can manage posts" 
ON public.posts 
FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);

-- Indeks untuk performa pencarian cepat
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts(is_published);

-- Trigger untuk update kolom 'updated_at' otomatis
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_posts_modtime ON public.posts;
CREATE TRIGGER update_posts_modtime
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Function & RPC untuk menambah counter pembaca artikel secara atomik
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

-- 4. Storage Bucket untuk Media & Gambar Artikel
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Policy Storage: Publik boleh melihat/mengunduh gambar
DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
CREATE POLICY "Public can view media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'media');

-- Policy Storage: Boleh upload dan kelola media
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

-- 5. Tabel Site Settings & Branding Global
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

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

-- Baris data default untuk 'global'
INSERT INTO public.site_settings (id, data) 
VALUES ('global', '{}'::jsonb) 
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 6. SAMPLE INITIAL POSTS (Artikel Contoh & Perkenalan)
-- ==============================================================================

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
  view_count
) VALUES 
(
  'halo-dunia-perkenalan-helmi-irfansah',
  'Halo Dunia: Membangun Lab Digital, Catatan Arsitektur Cloud, dan Eksplorasi Tech',
  'Selamat datang di helmirfansah.com. Sebuah ruang jurnal teknis, riset infrastruktur cloud, dan laboratorium kalkulator interaktif yang dibangun dengan filosofi efisiensi dan transparansi.',
  '## Selamat Datang di Ruang Catatan Teknis Saya

Halo! Saya **Helmi Irfansah**. Selamat datang di situs web dan blog pribadi saya.

Situs ini saya rancang bukan hanya sebagai portofolio biasa, melainkan sebagai **laboratorium terbuka (Web Lab)** dan catatan teknis jangka panjang tempat saya membagikan hasil riset, eksperimen arsitektur perangkat lunak, evaluasi biaya komputasi awan (*cloud infrastructure*), serta penerapan kecerdasan buatan (*AI tooling*) di dunia nyata.

> [!NOTE]
> Filosofi utama di balik blog ini adalah **kejujuran data dan efisiensi rekayasa**. Kami tidak membahas teori tanpa uji coba empiris, kalkulasi biaya yang transparan, dan benchmark performa yang nyata.

---

## Apa Saja yang Akan Anda Temukan di Sini?

Sebagai praktisi teknologi dan cloud enthusiast, saya memfokuskan artikel dan dokumentasi di situs ini ke dalam empat pilar utama:

1. **Cloud Architecture & Migration:** Analisis mendalam seputar migrasi beban kerja, perbandingan performa VPS versus managed cloud seperti AWS, Google Cloud, dan penyedia lokal, serta strategi mengeliminasi biaya tak terduga (*hidden egress fees*).
2. **Database & Backend Performance:** Eksplorasi PostgreSQL, Supabase, caching layer dengan Redis, serta desain sistem yang tahan banting untuk skalabilitas tinggi.
3. **Kalkulator & Tooling Interaktif:** Kami menyediakan fitur [Kalkulator Cloud & AI](/tools) yang dapat Anda gunakan secara gratis untuk mengestimasi biaya server dan konsumsi token LLM dalam mata uang Rupiah.
4. **SaaS Evaluation & AI Tools:** Uji coba jujur terhadap berbagai SaaS modern, developer tools, dan otomatisasi produktivitas rekayasa perangkat lunak.

---

## Mari Terhubung dan Berkolaborasi

Teknologi berkembang sangat cepat, namun prinsip rekayasa yang solid—seperti performa tinggi, efisiensi biaya, dan kode yang mudah dirawat—akan selalu relevan.

Jika Anda memiliki pandangan teknis yang menarik, ingin mendiskusikan studi kasus infrastruktur, atau sekadar ingin menyapa, silakan hubungi saya melalui:
- **LinkedIn:** [linkedin.com/in/helmirfansah](https://linkedin.com/in/helmirfansah)
- **GitHub:** [github.com/helmirfansah](https://github.com/helmirfansah)
- **Email & Kontak:** Langsung melalui bagian [Kontak](/ #contact) di situs ini.

Terima kasih telah berkunjung, dan semoga artikel-artikel di sini membawa manfaat nyata bagi arsitektur dan sistem Anda!',
  'Cloud Migration',
  ARRAY['Perkenalan', 'Tech Notes', 'Cloud', 'Arsitektur'],
  4,
  '',
  '',
  'Helmi Irfansah',
  'Selamat datang di helmirfansah.com. Ruang eksplorasi dan catatan teknis seputar arsitektur cloud, optimasi biaya, dan AI tooling dunia nyata.',
  true,
  12
),
(
  'studi-kasus-memangkas-biaya-cloud-65-persen',
  'Studi Kasus: Memangkas Biaya Infrastruktur Cloud hingga 65% Tanpa Mengorbankan Reliabilitas',
  'Bagaimana kami mengevaluasi arsitektur cloud, mengeliminasi biaya bandwidth tersembunyi, dan menghemat puluhan juta rupiah per bulan dengan strategi arsitektur hybrid modern.',
  '## Tantangan: Ketika Tagihan Cloud Mulai Membengkak

Salah satu kejutan terbesar yang sering dihadapi startup dan tim engineering yang sedang berkembang pesat adalah **skala tagihan cloud yang naik eksponensial** melampaui pertumbuhan jumlah pengguna aktif.

Banyak arsitektur awalnya dirancang di atas ekosistem *managed services* (seperti AWS RDS multi-AZ, ALB, NAT Gateways, dan CloudWatch logging masif). Di fase awal, managed service memberikan kecepatan peluncuran (*time-to-market*). Namun ketika traffic stabil di angka puluhan juta request per bulan, biaya marjinal per user melonjak tajam.

> [!WARNING]
> Salah satu pos pengeluaran paling tersembunyi namun mematikan di cloud hyperscaler adalah **AWS Data Transfer Out (Egress Bandwidth)** dan biaya **NAT Gateway hourly rate + per GB processing fee**.

---

## Analisis Komponen Biaya Sebelum & Sesudah Optimasi

Berikut adalah perbandingan ringkas alokasi biaya bulanan infrastruktur sebelum dan sesudah restrukturisasi arsitektur:

| Komponen Infrastruktur | Arsitektur Lama (AWS Full-Managed) | Arsitektur Baru (Hybrid Cloud + Edge) | Persentase Penghematan |
|---|---|---|---|
| Compute (vCPU & RAM) | AWS EC2 c5.xlarge ($140/bln) | Dedicated VPS 8 vCPU ($42/bln) | **-70%** |
| Database Storage & IOPS | AWS RDS Aurora PostgreSQL ($185/bln) | Self-hosted Managed PG / Supabase ($45/bln) | **-75%** |
| Egress Bandwidth (10 TB) | $900 ($0.09/GB) | Cloudflare CDN + Free Egress ($20/bln) | **-97%** |
| NAT Gateway & Routing | $95 (Gateway + Data) | Dual-stack IPv6 / Direct Egress ($0) | **-100%** |
| **Total Estimasi Bulanan** | **$1,320 (~Rp 21.120.000)** | **$107 (~Rp 1.712.000)** | **Hemat ~91.8%** |

---

## Tiga Langkah Utama yang Kami Terapkan

### 1. Memindahkan Aset Statis & Cache ke Edge Cloudflare
Dengan memanfaatkan Cloudflare di depan aplikasi kita, lebih dari **88% aset statis, gambar terkompresi, dan respons API yang bersifat idempotence** disajikan langsung dari edge server Cloudflare terdekat dengan pengguna (misalnya node Jakarta/Singapore). Ini secara drastis memangkas beban server utama dan meniadakan biaya transfer data keluar.

### 2. Mengganti NAT Gateway dengan Arsitektur Jaringan Modern
Banyak tim membayar ratusan dolar per bulan hanya untuk NAT Gateway agar private subnet bisa mengakses internet (misalnya untuk pull docker image atau kirim webhook). Dengan konfigurasi proxy keluar yang efisien atau gateway berbasis instance kecil, pos biaya ini dapat dihemat hampir seutuhnya.

### 3. Otomatisasi Backup dan Disaster Recovery (DR)
Penghematan biaya tidak boleh mengorbankan keamanan data. Kami membuat script backup terenkripsi yang berjalan setiap tengah malam ke object storage terpisah (S3-compatible bucket seperti Cloudflare R2 yang bebas biaya egress):

```bash
# Contoh Otomatisasi Backup Database Terkompresi ke R2
pg_dump -Fc -U postgres -d production_db | \
  gzip -9 | \
  aws s3 cp - s3://backup-vault/daily-$(date +%Y-%m-%d).sql.gz \
  --endpoint-url https://<account_id>.r2.cloudflarestorage.com
```

---

## Kesimpulan

Mengoptimalkan infrastruktur cloud bukanlah tentang beralih ke solusi murah yang tidak andal. Kuncinya adalah **memahami arsitektur jaringan, karakteristik beban kerja, dan model penetapan harga masing-masing penyedia cloud**.

Anda dapat mencoba mensimulasikan kebutuhan server dan perbandingan harga antar-penyedia cloud menggunakan [Kalkulator Cloud Kami](/tools) yang telah kami sesuaikan dengan kurs Rupiah saat ini.',
  'Cloud Migration',
  ARRAY['Cloud Architecture', 'AWS', 'DevOps', 'Cost Optimization', 'VPS'],
  6,
  '',
  '',
  'Biaya Cloud',
  'Panduan dan studi kasus nyata memangkas biaya infrastruktur server cloud hingga 65% dengan arsitektur hybrid modern dan optimasi egress.',
  true,
  28
)
ON CONFLICT (slug) DO NOTHING;


