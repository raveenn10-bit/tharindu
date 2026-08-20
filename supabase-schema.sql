-- ========================================================
-- Tilnogz Photography — Complete Supabase Database Schema
-- Run this in your Supabase SQL Editor:
-- https://app.supabase.com/project/_/sql
--
-- This script is idempotent: it is safe to re-run.
--
-- SECURITY MODEL
--   * Anonymous visitors  : read published content only.
--   * Authenticated admins: full read/write.
-- The anon key is public (it ships in the browser bundle), so anonymous
-- writes must never be allowed. Create your admin user under
-- Authentication -> Users, then sign in through the admin panel.
-- ========================================================

-- ========================================================
-- 1. Storage Bucket for Images & Videos
-- ========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('tilnogz-media', 'tilnogz-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop the earlier permissive policies if they exist
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Public & Authenticated Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Public & Authenticated Delete Access" ON storage.objects;
DROP POLICY IF EXISTS "tilnogz_media_public_read" ON storage.objects;
DROP POLICY IF EXISTS "tilnogz_media_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "tilnogz_media_auth_update" ON storage.objects;
DROP POLICY IF EXISTS "tilnogz_media_auth_delete" ON storage.objects;

-- Anyone may read media (the bucket is public so the site can display it)
CREATE POLICY "tilnogz_media_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'tilnogz-media');

-- Only signed-in admins may upload, replace or remove media
CREATE POLICY "tilnogz_media_auth_insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'tilnogz-media');

CREATE POLICY "tilnogz_media_auth_update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'tilnogz-media')
WITH CHECK (bucket_id = 'tilnogz-media');

CREATE POLICY "tilnogz_media_auth_delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'tilnogz-media');

-- ========================================================
-- 2. Albums Table
-- ========================================================
CREATE TABLE IF NOT EXISTS public.albums (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Wedding Photography',
    image_url TEXT NOT NULL,
    video_url TEXT,
    note TEXT,
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================================
-- 3. Hero Settings Table
-- ========================================================
CREATE TABLE IF NOT EXISTS public.hero_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    desktop_image_url TEXT NOT NULL,
    mobile_image_url TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================================
-- 4. About Settings Table
-- ========================================================
CREATE TABLE IF NOT EXISTS public.about_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    portrait_url TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT 'Tharindu Lakshan',
    address TEXT NOT NULL DEFAULT 'Colombo 7, Sri Lanka',
    bio1 TEXT,
    bio2 TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================================
-- 5. Testimonials Table
-- ========================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    client_name TEXT NOT NULL,
    service TEXT NOT NULL DEFAULT 'Wedding Photography',
    location TEXT NOT NULL DEFAULT 'Colombo, Sri Lanka',
    image_url TEXT NOT NULL,
    review TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================================
-- 6. Row Level Security
-- ========================================================
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Remove the earlier "anyone can do anything" policies
DROP POLICY IF EXISTS "Public Read Albums" ON public.albums;
DROP POLICY IF EXISTS "Public Manage Albums" ON public.albums;
DROP POLICY IF EXISTS "Public Read Hero" ON public.hero_settings;
DROP POLICY IF EXISTS "Public Manage Hero" ON public.hero_settings;
DROP POLICY IF EXISTS "Public Read About" ON public.about_settings;
DROP POLICY IF EXISTS "Public Manage About" ON public.about_settings;
DROP POLICY IF EXISTS "Public Read Testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Public Manage Testimonials" ON public.testimonials;

DROP POLICY IF EXISTS "albums_public_read_published" ON public.albums;
DROP POLICY IF EXISTS "albums_auth_read_all" ON public.albums;
DROP POLICY IF EXISTS "albums_auth_write" ON public.albums;
DROP POLICY IF EXISTS "testimonials_public_read_published" ON public.testimonials;
DROP POLICY IF EXISTS "testimonials_auth_read_all" ON public.testimonials;
DROP POLICY IF EXISTS "testimonials_auth_write" ON public.testimonials;
DROP POLICY IF EXISTS "hero_public_read" ON public.hero_settings;
DROP POLICY IF EXISTS "hero_auth_write" ON public.hero_settings;
DROP POLICY IF EXISTS "about_public_read" ON public.about_settings;
DROP POLICY IF EXISTS "about_auth_write" ON public.about_settings;

-- Albums: visitors see published rows, admins see and manage everything
CREATE POLICY "albums_public_read_published"
ON public.albums FOR SELECT
USING (is_published = true);

CREATE POLICY "albums_auth_read_all"
ON public.albums FOR SELECT TO authenticated
USING (true);

CREATE POLICY "albums_auth_write"
ON public.albums FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- Testimonials: same pattern
CREATE POLICY "testimonials_public_read_published"
ON public.testimonials FOR SELECT
USING (is_published = true);

CREATE POLICY "testimonials_auth_read_all"
ON public.testimonials FOR SELECT TO authenticated
USING (true);

CREATE POLICY "testimonials_auth_write"
ON public.testimonials FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- Hero settings: readable by all, writable by admins
CREATE POLICY "hero_public_read"
ON public.hero_settings FOR SELECT
USING (true);

CREATE POLICY "hero_auth_write"
ON public.hero_settings FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- About settings: readable by all, writable by admins
CREATE POLICY "about_public_read"
ON public.about_settings FOR SELECT
USING (true);

CREATE POLICY "about_auth_write"
ON public.about_settings FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- ========================================================
-- 7. Keep updated_at current on every write
-- ========================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS albums_set_updated_at ON public.albums;
CREATE TRIGGER albums_set_updated_at
BEFORE UPDATE ON public.albums
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS testimonials_set_updated_at ON public.testimonials;
CREATE TRIGGER testimonials_set_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS hero_settings_set_updated_at ON public.hero_settings;
CREATE TRIGGER hero_settings_set_updated_at
BEFORE UPDATE ON public.hero_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS about_settings_set_updated_at ON public.about_settings;
CREATE TRIGGER about_settings_set_updated_at
BEFORE UPDATE ON public.about_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ========================================================
-- 8. Migration helper
-- If an earlier build created a `photos` table, copy its rows into
-- `albums` once, then drop it manually after verifying the data.
-- ========================================================
-- INSERT INTO public.albums (id, title, category, image_url, sort_order, is_published, created_at)
-- SELECT id, title, category, image_url, sort_order, is_published, created_at
-- FROM public.photos
-- ON CONFLICT (id) DO NOTHING;
