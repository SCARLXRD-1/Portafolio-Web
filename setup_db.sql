-- Create profile_settings table
CREATE TABLE IF NOT EXISTS public.profile_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    avatar_url TEXT,
    display_name TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a single row if it doesn't exist
INSERT INTO public.profile_settings (id) 
SELECT '00000000-0000-0000-0000-000000000001' 
WHERE NOT EXISTS (SELECT 1 FROM public.profile_settings);

-- Enable RLS
ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Public read access" ON public.profile_settings;
CREATE POLICY "Public read access" ON public.profile_settings
    FOR SELECT USING (true);

-- Allow updates only from the admin
DROP POLICY IF EXISTS "Admin update access" ON public.profile_settings;
CREATE POLICY "Admin update access" ON public.profile_settings
    FOR UPDATE USING (
        auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c'
    );

-- Grant base table privileges to API roles
GRANT SELECT ON public.profile_settings TO anon, authenticated;
GRANT UPDATE ON public.profile_settings TO authenticated;


-- Storage objects policies
DROP POLICY IF EXISTS "Public read for portfolio assets" ON storage.objects;
CREATE POLICY "Public read for portfolio assets" ON storage.objects
    FOR SELECT USING (bucket = 'portfolio-assets');

DROP POLICY IF EXISTS "Admin insert/update/delete for portfolio assets" ON storage.objects;
CREATE POLICY "Admin insert/update/delete for portfolio assets" ON storage.objects
    FOR ALL USING (
        bucket = 'portfolio-assets' AND
        auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c'
    );
