const fs = require('fs');
const { execSync } = require('child_process');

const sql = fs.readFileSync('fix_storage_final.sql', 'utf8');

try {
  const escapedSql = sql.replace(/"/g, '\\"').replace(/\n/g, ' ');
  execSync(`npx @insforge/cli db query "${escapedSql}"`, { stdio: 'inherit' });
  console.log('Done.');
} catch (error) {
  console.error('Error:', error.message);
}
