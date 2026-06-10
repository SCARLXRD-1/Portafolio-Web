const { execSync } = require('child_process');

const sql = `
CREATE TABLE IF NOT EXISTS public.site_settings (
  id integer PRIMARY KEY DEFAULT 1,
  accent_color text DEFAULT 'emerald',
  username text DEFAULT 'admin_akashi',
  wallpaper_url text,
  seo_title text DEFAULT 'AKASHI DEV - OS Portfolio',
  seo_description text DEFAULT 'Creative developer portfolio built like a web operating system.',
  seo_keywords text DEFAULT 'React, Nextjs, Frontend, Developer, OS',
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site settings" ON public.site_settings;
CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access site settings" ON public.site_settings;
CREATE POLICY "Admin full access site settings" ON public.site_settings FOR ALL USING (true);

GRANT ALL PRIVILEGES ON TABLE public.site_settings TO authenticated;
GRANT SELECT ON TABLE public.site_settings TO anon;

NOTIFY pgrst, 'reload schema';
`;

try {
  const escapedSql = sql.replace(/"/g, '\\"').replace(/\n/g, ' ');
  execSync(`npx @insforge/cli db query "${escapedSql}"`, { stdio: 'inherit' });
  console.log("Success creating site_settings table");
} catch (e) {
  console.error("Failed:", e);
}
