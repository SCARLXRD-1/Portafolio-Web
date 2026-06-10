const fs = require('fs');
const { execSync } = require('child_process');

const sql = `
-- Fix Experience
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read experience" ON public.experience;
CREATE POLICY "Public read experience" ON public.experience FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access experience" ON public.experience;
CREATE POLICY "Admin full access experience" ON public.experience FOR ALL USING (auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c');
GRANT SELECT, INSERT, UPDATE, DELETE ON public.experience TO authenticated;
GRANT SELECT ON public.experience TO anon;

-- Fix Skills
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read skills" ON public.skills;
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access skills" ON public.skills;
CREATE POLICY "Admin full access skills" ON public.skills FOR ALL USING (auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c');
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skills TO authenticated;
GRANT SELECT ON public.skills TO anon;

-- Fix Experiments
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read experiments" ON public.experiments;
CREATE POLICY "Public read experiments" ON public.experiments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access experiments" ON public.experiments;
CREATE POLICY "Admin full access experiments" ON public.experiments FOR ALL USING (auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c');
GRANT SELECT, INSERT, UPDATE, DELETE ON public.experiments TO authenticated;
GRANT SELECT ON public.experiments TO anon;

-- Fix Messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert messages" ON public.contact_messages;
CREATE POLICY "Public insert messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin full access messages" ON public.contact_messages;
CREATE POLICY "Admin full access messages" ON public.contact_messages FOR ALL USING (auth.uid() = 'dc64568f-659e-4a22-baa0-56a0225bff0c');
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT INSERT ON public.contact_messages TO anon, authenticated;
`;

try {
  const escapedSql = sql.replace(/"/g, '\\"').replace(/\n/g, ' ');
  execSync(`npx @insforge/cli db query "${escapedSql}"`, { stdio: 'inherit' });
  console.log("Success fixing all other tables RLS");
} catch (e) {
  console.error("Failed:", e);
}
