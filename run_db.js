const fs = require('fs');
const { execSync } = require('child_process');

const sql = `
DROP POLICY IF EXISTS "Public read for portfolio assets" ON storage.objects;
CREATE POLICY "Public read for portfolio assets" ON storage.objects FOR SELECT USING (bucket = 'portfolio-assets');

DROP POLICY IF EXISTS "Admin insert/update/delete for portfolio assets" ON storage.objects;
CREATE POLICY "Admin insert/update/delete for portfolio assets" ON storage.objects FOR ALL USING (bucket = 'portfolio-assets' AND auth.jwt() ->> 'email' = 'jobathanjimenez1265@gmail.com');
`;

const queries = sql.split(';').map(q => q.trim().replace(/\n/g, ' ')).filter(q => q.length > 0);

for (const query of queries) {
  try {
    console.log(`Executing: ${query.substring(0, 50)}...`);
    execSync(`npx @insforge/cli db query -- "${query.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Error executing query:', error.message);
  }
}
console.log('Done.');
