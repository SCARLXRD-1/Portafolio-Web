const fs = require('fs');
const { execSync } = require('child_process');

const sql = fs.readFileSync('setup_db.sql', 'utf8');

try {
  console.log('Executing setup_db.sql...');
  execSync(`npx @insforge/cli db query -- "${sql.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
  console.log('Done.');
} catch (error) {
  console.error('Error executing query:', error.message);
}
console.log('Done.');
