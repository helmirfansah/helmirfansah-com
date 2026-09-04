-- ==============================================================================
-- SUPABASE DATABASE SCHEMA: helmirfansah.com BLOG
-- Salin dan jalankan script SQL ini di: Supabase Dashboard -> SQL Editor
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

-- 3. Policy: Siapa saja (publik) boleh membaca postingan yang berstatus 'is_published = true' dan bukan di sampah
DROP POLICY IF EXISTS "Public users can view published posts" ON public.posts;
CREATE POLICY "Public users can view published posts" 
ON public.posts 
FOR SELECT 
USING (is_published = true AND (is_trash IS NULL OR is_trash = false));

-- 4. Policy: Pengguna yang sudah login (Authenticated) boleh melakukan SELECT, INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "Authenticated users can manage all posts" ON public.posts;
CREATE POLICY "Authenticated users can manage all posts" 
ON public.posts 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Policy Opsional: Jika ingin mengizinkan akses penuh lewat API anon (Anon Key)
-- Hapus tanda komentar dua baris di bawah jika ingin bisa mengelola artikel tanpa login Supabase Auth:
-- DROP POLICY IF EXISTS "Anon users can manage posts" ON public.posts;
-- CREATE POLICY "Anon users can manage posts" ON public.posts FOR ALL TO anon USING (true) WITH CHECK (true);

-- Indeks untuk pencarian cepat berdasarkan slug dan kategori
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts(is_published);

-- Trigger untuk mengupdate kolom 'updated_at' secara otomatis saat ada perubahan
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

-- Function & RPC untuk menaikkan view_count secara atomik dan aman untuk publik
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

-- 5. Storage Bucket untuk Media & Gambar (Opsional jika upload ke Supabase Storage)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Policy Storage: Publik boleh melihat/mengunduh gambar
DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
CREATE POLICY "Public can view media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'media');

-- Policy Storage: Pengguna login (Authenticated) boleh upload dan kelola media
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
CREATE POLICY "Authenticated users can upload media" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "Authenticated users can update media" ON storage.objects;
CREATE POLICY "Authenticated users can update media" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Authenticated users can delete media" ON storage.objects;
CREATE POLICY "Authenticated users can delete media" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'media');

-- 6. Tabel Site Settings & Branding Global
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

DROP POLICY IF EXISTS "Authenticated users can manage site_settings" ON public.site_settings;
CREATE POLICY "Authenticated users can manage site_settings" 
ON public.site_settings 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Policy Opsional: Jika ingin sinkronisasi branding/settings lewat anon key tanpa login Auth:
-- DROP POLICY IF EXISTS "Anon users can manage site_settings" ON public.site_settings;
-- CREATE POLICY "Anon users can manage site_settings" ON public.site_settings FOR ALL TO anon USING (true) WITH CHECK (true);

-- Baris data default untuk 'global'
INSERT INTO public.site_settings (id, data) 
VALUES ('global', '{}'::jsonb) 
ON CONFLICT (id) DO NOTHING;


