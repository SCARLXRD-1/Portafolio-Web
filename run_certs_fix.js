const fs = require('fs');
const { execSync } = require('child_process');

const sql = `
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read published certificates" ON public.certificates;
CREATE POLICY "Public read published certificates" ON public.certificates FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "Admin full access certificates" ON public.certificates;
CREATE POLICY "Admin full access certificates" ON public.certificates FOR ALL USING (auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c');
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO authenticated;
GRANT SELECT ON public.certificates TO anon;
`;

try {
  const escapedSql = sql.replace(/"/g, '\\"').replace(/\n/g, ' ');
  execSync(`npx @insforge/cli db query "${escapedSql}"`, { stdio: 'inherit' });
  console.log("Success fixing certificates RLS");
} catch (e) {
  console.error("Failed:", e);
}
