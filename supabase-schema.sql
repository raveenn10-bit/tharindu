-- ========================================================
-- Tilnogz Photography — Complete Supabase Database Schema
-- Run this in your Supabase SQL Editor:
-- https://app.supabase.com/project/_/sql
-- ========================================================

-- 1. Create Storage Bucket for Images & Videos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tilnogz-media', 'tilnogz-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public read access to storage bucket
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'tilnogz-media');

-- Allow authenticated or public insert for owner management
CREATE POLICY "Public & Authenticated Upload Access" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'tilnogz-media');

CREATE POLICY "Public & Authenticated Delete Access" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'tilnogz-media');

-- 2. Albums Table
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

-- 3. Hero Settings Table
CREATE TABLE IF NOT EXISTS public.hero_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    desktop_image_url TEXT NOT NULL,
    mobile_image_url TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. About Settings Table
CREATE TABLE IF NOT EXISTS public.about_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    portrait_url TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT 'Tharindu Lakshan',
    address TEXT NOT NULL DEFAULT 'Colombo 7, Sri Lanka',
    bio1 TEXT,
    bio2 TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Testimonials Table
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

-- 6. Enable Row Level Security (RLS) with Public Read & Manage Policies
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read published items
CREATE POLICY "Public Read Albums" ON public.albums FOR SELECT USING (true);
CREATE POLICY "Public Manage Albums" ON public.albums FOR ALL USING (true);

CREATE POLICY "Public Read Hero" ON public.hero_settings FOR SELECT USING (true);
CREATE POLICY "Public Manage Hero" ON public.hero_settings FOR ALL USING (true);

CREATE POLICY "Public Read About" ON public.about_settings FOR SELECT USING (true);
CREATE POLICY "Public Manage About" ON public.about_settings FOR ALL USING (true);

CREATE POLICY "Public Read Testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public Manage Testimonials" ON public.testimonials FOR ALL USING (true);
