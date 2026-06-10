const { execSync } = require('child_process');

const sql = `
GRANT ALL PRIVILEGES ON TABLE public.experience TO authenticated;
GRANT SELECT ON TABLE public.experience TO anon;
GRANT ALL PRIVILEGES ON TABLE public.experiments TO authenticated;
GRANT SELECT ON TABLE public.experiments TO anon;

ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read experience" ON public.experience;
CREATE POLICY "Public read experience" ON public.experience FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access experience" ON public.experience;
CREATE POLICY "Admin full access experience" ON public.experience FOR ALL USING (true);

ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read experiments" ON public.experiments;
CREATE POLICY "Public read experiments" ON public.experiments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access experiments" ON public.experiments;
CREATE POLICY "Admin full access experiments" ON public.experiments FOR ALL USING (true);

NOTIFY pgrst, 'reload schema';
`;

try {
  const escapedSql = sql.replace(/"/g, '\\"').replace(/\n/g, ' ');
  execSync(`npx @insforge/cli db query "${escapedSql}"`, { stdio: 'inherit' });
  console.log("Success fixing permissions for experience and experiments");
} catch (e) {
  console.error("Failed:", e);
}
