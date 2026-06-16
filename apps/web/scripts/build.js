const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const apiPath = path.join(__dirname, '../app/api');
const backupPath = path.join(__dirname, '../app_api_backup');

let moved = false;

try {
  if (fs.existsSync(apiPath)) {
    console.log('Temporarily moving app/api to app_api_backup for static build...');
    fs.renameSync(apiPath, backupPath);
    moved = true;
  }

  console.log('Running next build...');
  execSync('next build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error);
  process.exitCode = 1;
} finally {
  if (moved && fs.existsSync(backupPath)) {
    console.log('Restoring app/api from backup...');
    fs.renameSync(backupPath, apiPath);
  }
}
