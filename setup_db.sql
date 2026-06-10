-- ============================================================
-- AKASHI DEV Portfolio — Full Database Schema
-- ============================================================

-- ============================================================
-- 1. PROFILE SETTINGS (single row, bilingual)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profile_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    avatar_url TEXT,
    display_name TEXT,
    role_es TEXT DEFAULT '',
    role_en TEXT DEFAULT '',
    location_es TEXT DEFAULT '',
    location_en TEXT DEFAULT '',
    bio_es TEXT DEFAULT '',
    bio_en TEXT DEFAULT '',
    education_es TEXT DEFAULT '',
    education_en TEXT DEFAULT '',
    interests_es TEXT DEFAULT '',
    interests_en TEXT DEFAULT '',
    cv_url TEXT DEFAULT '',
    public_email TEXT DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed single row if empty
INSERT INTO public.profile_settings (id)
SELECT '00000000-0000-0000-0000-000000000001'
WHERE NOT EXISTS (SELECT 1 FROM public.profile_settings);

ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON public.profile_settings;
CREATE POLICY "Public read access" ON public.profile_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin update access" ON public.profile_settings;
CREATE POLICY "Admin update access" ON public.profile_settings
    FOR UPDATE USING (
        auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c'
    );

GRANT SELECT ON public.profile_settings TO anon, authenticated;
GRANT UPDATE ON public.profile_settings TO authenticated;


-- ============================================================
-- 2. PROJECTS (bilingual, gallery)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_es TEXT NOT NULL DEFAULT '',
    title_en TEXT NOT NULL DEFAULT '',
    description_es TEXT DEFAULT '',
    description_en TEXT DEFAULT '',
    technologies TEXT[] DEFAULT '{}',
    github_url TEXT DEFAULT '',
    demo_url TEXT DEFAULT '',
    image_urls TEXT[] DEFAULT '{}',
    sort_order INT DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published projects" ON public.projects;
CREATE POLICY "Public read published projects" ON public.projects
    FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admin full access projects" ON public.projects;
CREATE POLICY "Admin full access projects" ON public.projects
    FOR ALL USING (
        auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c'
    );

GRANT SELECT ON public.projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.projects TO authenticated;


-- ============================================================
-- 3. EXPERIENCE (bilingual)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_es TEXT NOT NULL DEFAULT '',
    title_en TEXT NOT NULL DEFAULT '',
    company TEXT DEFAULT '',
    start_date TEXT DEFAULT '',
    end_date TEXT DEFAULT '',
    description_es TEXT DEFAULT '',
    description_en TEXT DEFAULT '',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read experience" ON public.experience;
CREATE POLICY "Public read experience" ON public.experience
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access experience" ON public.experience;
CREATE POLICY "Admin full access experience" ON public.experience
    FOR ALL USING (
        auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c'
    );

GRANT SELECT ON public.experience TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.experience TO authenticated;


-- ============================================================
-- 4. SKILLS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL DEFAULT '',
    category TEXT DEFAULT 'Frontend' CHECK (category IN ('Frontend', 'Backend', 'Herramientas', 'Bases de Datos')),
    icon_url TEXT DEFAULT '',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read skills" ON public.skills;
CREATE POLICY "Public read skills" ON public.skills
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access skills" ON public.skills;
CREATE POLICY "Admin full access skills" ON public.skills
    FOR ALL USING (
        auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c'
    );

GRANT SELECT ON public.skills TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.skills TO authenticated;


-- ============================================================
-- 5. CERTIFICATES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL DEFAULT '',
    issuer TEXT DEFAULT '',
    date TEXT DEFAULT '',
    url TEXT DEFAULT '',
    skills TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published certificates" ON public.certificates;
CREATE POLICY "Public read published certificates" ON public.certificates
    FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admin full access certificates" ON public.certificates;
CREATE POLICY "Admin full access certificates" ON public.certificates
    FOR ALL USING (
        auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c'
    );

GRANT SELECT ON public.certificates TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.certificates TO authenticated;


-- ============================================================
-- 6. EXPERIMENTS (bilingual)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_es TEXT NOT NULL DEFAULT '',
    name_en TEXT NOT NULL DEFAULT '',
    description_es TEXT DEFAULT '',
    description_en TEXT DEFAULT '',
    embed_code TEXT DEFAULT '',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read experiments" ON public.experiments;
CREATE POLICY "Public read experiments" ON public.experiments
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access experiments" ON public.experiments;
CREATE POLICY "Admin full access experiments" ON public.experiments
    FOR ALL USING (
        auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c'
    );

GRANT SELECT ON public.experiments TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.experiments TO authenticated;


-- ============================================================
-- 7. CONTACT MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can INSERT (send a message)
DROP POLICY IF EXISTS "Public insert messages" ON public.contact_messages;
CREATE POLICY "Public insert messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

-- Only admin can read/update/delete messages
DROP POLICY IF EXISTS "Admin full access messages" ON public.contact_messages;
CREATE POLICY "Admin full access messages" ON public.contact_messages
    FOR ALL USING (
        auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c'
    );

GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT INSERT ON public.contact_messages TO anon, authenticated;


-- ============================================================
-- STORAGE POLICIES
-- ============================================================
DROP POLICY IF EXISTS "Public read for portfolio assets" ON storage.objects;
CREATE POLICY "Public read for portfolio assets" ON storage.objects
    FOR SELECT USING (bucket = 'portfolio-assets');

DROP POLICY IF EXISTS "Admin insert/update/delete for portfolio assets" ON storage.objects;
CREATE POLICY "Admin insert/update/delete for portfolio assets" ON storage.objects
    FOR ALL USING (
        bucket = 'portfolio-assets' AND
        auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c'
    );


-- ============================================================
-- RELOAD SCHEMA CACHE
-- ============================================================
NOTIFY pgrst, 'reload schema';

-- Storage Bucket Policies
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-assets', 'portfolio-assets', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'portfolio-assets');
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-assets' AND auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c');
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-assets' AND auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c');
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio-assets' AND auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c');
