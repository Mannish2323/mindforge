import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const canonicalDirectories = [
  'src/app',
  'src/components/ui',
  'src/components/layout',
  'src/components/shared',
  'src/components/charts',
  'src/components/forms',
  'src/components/dialogs',
  'src/components/animations',
  'src/features/auth',
  'src/features/onboarding',
  'src/features/dashboard',
  'src/features/lessons',
  'src/features/grammar',
  'src/features/vocabulary',
  'src/features/kanji',
  'src/features/speaking',
  'src/features/writing',
  'src/features/listening',
  'src/features/reading',
  'src/features/ai',
  'src/features/community',
  'src/features/premium',
  'src/features/profile',
  'src/features/settings',
  'src/features/admin',
  'src/services',
  'src/hooks',
  'src/stores',
  'src/lib',
  'src/api',
  'src/types',
  'src/utils',
  'src/constants',
  'src/assets',
  'src/styles',
  'public'
];

const args = process.argv.slice(2);
const fixMode = args.includes('--fix');

console.log('🌸 Starting Learning Velmorth Architecture Verification...\n');

let missingCount = 0;
const results = [];

for (const dir of canonicalDirectories) {
  const targetPath = path.join(rootDir, dir);
  const exists = fs.existsSync(targetPath);

  if (!exists) {
    missingCount++;
    if (fixMode) {
      try {
        fs.mkdirSync(targetPath, { recursive: true });
        // Write a .gitkeep to ensure Git tracks the empty folder
        fs.writeFileSync(path.join(targetPath, '.gitkeep'), '');
        results.push({ dir, status: 'CREATED', color: '\x1b[32m' });
      } catch (err) {
        results.push({ dir, status: 'FAILED CREATION: ' + err.message, color: '\x1b[31m' });
      }
    } else {
      results.push({ dir, status: 'MISSING', color: '\x1b[31m' });
    }
  } else {
    results.push({ dir, status: 'OK', color: '\x1b[36m' });
  }
}

// Print results table
console.log('Folder Verification Results:');
console.log('--------------------------------------------------');
for (const res of results) {
  console.log(`${res.color}[${res.status}]\x1b[0m ${res.dir}`);
}
console.log('--------------------------------------------------');

if (missingCount > 0) {
  if (fixMode) {
    console.log(`\n🌸 All missing directories have been resolved and initialized with .gitkeep files.`);
    process.exit(0);
  } else {
    console.error(`\n❌ Error: ${missingCount} required architectural directory/directories are missing.`);
    console.error(`Run 'node scripts/verify-architecture.js --fix' to automatically create and initialize them.`);
    process.exit(1);
  }
} else {
  console.log('\n✅ Success: All canonical directories are present and aligned with Master Architecture Document 2.');
  process.exit(0);
}
