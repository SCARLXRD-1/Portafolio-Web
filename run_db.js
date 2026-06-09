const fs = require('fs');
const { execSync } = require('child_process');

const sql = fs.readFileSync('setup_db.sql', 'utf8');

try {
  console.log('Executing setup_db.sql...');
  // Escape quotes and backticks correctly for PowerShell
  const escapedSql = sql.replace(/"/g, '\\"').replace(/\n/g, ' ');
  execSync(`npx @insforge/cli db query "${escapedSql}"`, { stdio: 'inherit' });
  console.log('Done.');
} catch (error) {
  console.error('Error executing query:', error.message);
}
