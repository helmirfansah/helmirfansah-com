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


