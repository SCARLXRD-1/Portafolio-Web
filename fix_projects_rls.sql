ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read published projects" ON public.projects;
CREATE POLICY "Public read published projects" ON public.projects FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "Admin full access projects" ON public.projects;
CREATE POLICY "Admin full access projects" ON public.projects FOR ALL USING (auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c');
